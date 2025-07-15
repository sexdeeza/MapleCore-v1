// src/app/api/vote/manual/route.ts
// Manual vote verification with enhanced security
import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT!),
};

// Get client IP from various headers
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');
  const cloudflare = request.headers.get('cf-connecting-ip');
  
  if (cloudflare) return cloudflare;
  if (forwarded) return forwarded.split(',')[0].trim();
  if (real) return real;
  
  return 'unknown';
}

// Generate a hash of the IP for privacy
function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip + process.env.JWT_SECRET).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;
    
    const clientIp = getClientIp(request);
    const hashedIp = hashIp(clientIp);

    const { site } = await request.json();

    // Validate site
    if (!site || site !== 'Gtop100') {
      return NextResponse.json({ error: 'Invalid site' }, { status: 400 });
    }

    const connection = await mysql.createConnection(dbConfig);

    try {
      // Start transaction
      await connection.beginTransaction();

      // Get user info
      const [userRows] = await connection.execute(
        'SELECT id, name, nxPrepaid, votepoints FROM accounts WHERE id = ?',
        [userId]
      );

      if (!Array.isArray(userRows) || userRows.length === 0) {
        await connection.rollback();
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const user = userRows[0] as any;
      const siteKey = 'gtop100';
      const cooldownHours = 24;
      const nxReward = 8000;

      // Check if manual verification was recently used (prevent spam)
      const [recentManualRows] = await connection.execute(`
        SELECT COUNT(*) as manual_count FROM vote_logs 
        WHERE username = ? AND vote_time > DATE_SUB(NOW(), INTERVAL 5 MINUTE)
        AND failure_reason LIKE '%Manual verification%'
      `, [user.name]);

      if (Array.isArray(recentManualRows) && recentManualRows.length > 0) {
        const manualCount = (recentManualRows[0] as any).manual_count;
        if (manualCount >= 3) {
          await connection.rollback();
          return NextResponse.json({ 
            error: 'Too many manual verification attempts. Please wait a few minutes.' 
          }, { status: 429 });
        }
      }

      // Check IP cooldown
      const [ipCooldownRows] = await connection.execute(`
        SELECT last_vote_time FROM vote_ip_cooldowns 
        WHERE ip_hash = ? AND site = ? 
        AND last_vote_time > DATE_SUB(NOW(), INTERVAL ? HOUR)
        FOR UPDATE
      `, [hashedIp, siteKey, cooldownHours]);

      if (Array.isArray(ipCooldownRows) && ipCooldownRows.length > 0) {
        const ipRecord = ipCooldownRows[0] as any;
        const lastVoteTime = new Date(ipRecord.last_vote_time);
        const nextVoteTime = new Date(lastVoteTime.getTime() + (cooldownHours * 60 * 60 * 1000));
        const remainingMinutes = Math.ceil((nextVoteTime.getTime() - Date.now()) / (1000 * 60));

        // Log the attempt
        await connection.execute(`
          INSERT INTO vote_logs (username, site, vote_time, nx_awarded, ip_address, ip_hash, status, failure_reason) 
          VALUES (?, ?, NOW(), 0, ?, ?, 'cooldown', ?)
        `, [user.name, siteKey, clientIp, hashedIp, `Manual verification: IP cooldown - ${Math.floor(remainingMinutes/60)}h ${remainingMinutes%60}m remaining`]);

        await connection.commit();
        return NextResponse.json({ 
          error: `IP cooldown active. You can vote again in ${Math.floor(remainingMinutes/60)}h ${remainingMinutes%60}m` 
        }, { status: 429 });
      }

      // Check user cooldown
      const [userCooldownRows] = await connection.execute(`
        SELECT vote_time FROM vote_logs 
        WHERE username = ? AND site = ? 
        AND status = 'success'
        AND vote_time > DATE_SUB(NOW(), INTERVAL ? HOUR)
        ORDER BY vote_time DESC 
        LIMIT 1
      `, [user.name, siteKey, cooldownHours]);

      if (Array.isArray(userCooldownRows) && userCooldownRows.length > 0) {
        const lastVote = userCooldownRows[0] as any;
        const lastVoteTime = new Date(lastVote.vote_time);
        const nextVoteTime = new Date(lastVoteTime.getTime() + (cooldownHours * 60 * 60 * 1000));
        const remainingMinutes = Math.ceil((nextVoteTime.getTime() - Date.now()) / (1000 * 60));

        // Log the attempt
        await connection.execute(`
          INSERT INTO vote_logs (username, site, vote_time, nx_awarded, ip_address, ip_hash, status, failure_reason) 
          VALUES (?, ?, NOW(), 0, ?, ?, 'cooldown', ?)
        `, [user.name, siteKey, clientIp, hashedIp, `Manual verification: User cooldown - ${Math.floor(remainingMinutes/60)}h ${remainingMinutes%60}m remaining`]);

        await connection.commit();
        return NextResponse.json({ 
          error: `You already voted today. You can vote again in ${Math.floor(remainingMinutes/60)}h ${remainingMinutes%60}m` 
        }, { status: 429 });
      }

      // IMPORTANT: Manual verification should only be used as a backup
      // In production, you should verify with the voting site's API if available
      console.warn(`⚠️ Manual vote verification used by ${user.name} from IP ${hashedIp.substring(0, 16)}...`);

      const currentNX = user.nxPrepaid || 0;
      const currentVotePoints = user.votepoints || 0;
      const newNXAmount = currentNX + nxReward;
      const newVotePoints = currentVotePoints + 1;

      // Update user account
      const [updateResult] = await connection.execute(
        'UPDATE accounts SET nxPrepaid = ?, votepoints = ? WHERE id = ?',
        [newNXAmount, newVotePoints, userId]
      );

      if ((updateResult as any).affectedRows > 0) {
        // Log the successful vote
        await connection.execute(`
          INSERT INTO vote_logs (username, site, vote_time, nx_awarded, ip_address, ip_hash, status, failure_reason) 
          VALUES (?, ?, NOW(), ?, ?, ?, 'success', 'Manual verification')
        `, [user.name, siteKey, nxReward, clientIp, hashedIp]);

        // Update IP cooldown
        await connection.execute(`
          INSERT INTO vote_ip_cooldowns (ip_hash, site, last_vote_time, vote_count)
          VALUES (?, ?, NOW(), 1)
          ON DUPLICATE KEY UPDATE 
            last_vote_time = NOW(),
            vote_count = vote_count + 1
        `, [hashedIp, siteKey]);

        await connection.commit();

        console.log(`Manual vote verified: ${user.name} received ${nxReward} NX (${currentNX} -> ${newNXAmount})`);
        
        return NextResponse.json({
          success: true,
          reward: nxReward,
          message: `${nxReward} NX added to your account! Total: ${newNXAmount.toLocaleString()} NX`
        });
      } else {
        await connection.rollback();
        return NextResponse.json({ error: 'Failed to update account' }, { status: 500 });
      }

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      await connection.end();
    }

  } catch (error) {
    console.error('Manual vote error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}