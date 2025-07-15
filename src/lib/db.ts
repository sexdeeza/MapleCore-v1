// src/lib/db.ts
// Secure database configuration with connection pooling

import mysql from 'mysql2/promise';

// Create a connection pool instead of individual connections
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '3306'),
  
  // Connection pool settings
  waitForConnections: true,
  connectionLimit: 10,      // Max 10 connections
  queueLimit: 0,           // Unlimited queue
  
  // Security settings
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  
  // Timeouts
  connectTimeout: 60000,    // 60 seconds
  
  // SSL (uncomment in production)
  // ssl: {
  //   rejectUnauthorized: true
  // }
});

// Test connection on startup
pool.getConnection()
  .then(connection => {
    console.log('Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });

// Export pool for use in API routes
export default pool;

// ==========================================
// SECURE QUERY HELPERS
// ==========================================

// Execute query with automatic connection handling
export async function query<T = any>(
  sql: string, 
  params?: any[]
): Promise<T[]> {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error('Database operation failed');
  }
}

// Execute single row query
export async function queryOne<T = any>(
  sql: string, 
  params?: any[]
): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] || null;
}

// Transaction helper
export async function transaction<T>(
  callback: (connection: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// ==========================================
// COMMON SECURE QUERIES
// ==========================================

export const secureQueries = {
  // User queries
  getUserByUsername: async (username: string) => {
    return queryOne(
      'SELECT id, name, password, banned FROM accounts WHERE name = ? LIMIT 1',
      [username]
    );
  },

  getUserById: async (userId: number) => {
    return queryOne(
      'SELECT id, name, email, createdat, nxCredit, nxPrepaid, votepoints FROM accounts WHERE id = ? LIMIT 1',
      [userId]
    );
  },

  createUser: async (username: string, hashedPassword: string, email: string, birthday: string) => {
    const result = await query(
      'INSERT INTO accounts (name, password, email, birthday, createdat) VALUES (?, ?, ?, ?, NOW())',
      [username, hashedPassword, email, birthday]
    );
    return (result as any).insertId;
  },

  updatePassword: async (userId: number, hashedPassword: string) => {
    await query(
      'UPDATE accounts SET password = ? WHERE id = ?',
      [hashedPassword, userId]
    );
  },

  // Character queries
  getCharactersByAccountId: async (accountId: number) => {
    return query(
      `SELECT id, name, level, job, exp, meso, str, dex, \`int\`, luk 
       FROM characters 
       WHERE accountid = ? 
       ORDER BY level DESC`,
      [accountId]
    );
  },

  getMainCharacter: async (accountId: number) => {
    return queryOne(
      `SELECT name, level, job 
       FROM characters 
       WHERE accountid = ? 
       ORDER BY level DESC 
       LIMIT 1`,
      [accountId]
    );
  },

  // Admin queries - Check gm status in characters table
  isUserAdmin: async (userId: number) => {
    const result = await queryOne<{ isAdmin: number }>(
      `SELECT COUNT(*) as isAdmin 
       FROM characters 
       WHERE accountid = ? AND gm >= 6 
       LIMIT 1`,
      [userId]
    );
    return (result?.isAdmin || 0) > 0;
  },

  // Vote queries
  recordVote: async (userId: number, site: string, nxReward: number) => {
    await transaction(async (conn) => {
      // Record vote
      await conn.execute(
        'INSERT INTO vote_logs (user_id, site, voted_at, nx_reward) VALUES (?, ?, NOW(), ?)',
        [userId, site, nxReward]
      );
      
      // Update user NX
      await conn.execute(
        'UPDATE accounts SET nxCredit = nxCredit + ?, votepoints = votepoints + 1 WHERE id = ?',
        [nxReward, userId]
      );
    });
  },

  getVoteStatus: async (userId: number, site: string, cooldownHours: number = 12) => {
    return queryOne<{ lastVote: Date }>(
      `SELECT voted_at as lastVote 
       FROM vote_records 
       WHERE user_id = ? AND site = ? 
       AND voted_at > DATE_SUB(NOW(), INTERVAL ? HOUR)
       ORDER BY voted_at DESC 
       LIMIT 1`,
      [userId, site, cooldownHours]
    );
  }
};

// ==========================================
// SQL INJECTION PREVENTION HELPERS
// ==========================================

// NEVER use these for user input - only for system-generated values
export function escapeIdentifier(identifier: string): string {
  // For table/column names that can't be parameterized
  if (!/^[a-zA-Z0-9_]+$/.test(identifier)) {
    throw new Error('Invalid identifier');
  }
  return `\`${identifier}\``;
}

// Validate sort order
export function validateSortOrder(order: string): 'ASC' | 'DESC' {
  const upperOrder = order.toUpperCase();
  if (upperOrder !== 'ASC' && upperOrder !== 'DESC') {
    throw new Error('Invalid sort order');
  }
  return upperOrder as 'ASC' | 'DESC';
}