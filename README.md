# MapleCore CMS 🎮  
*A Complete MapleStory v83 Private Server Website*

---

## 🌟 Overview

**MapleCore CMS** is a modern, full-featured Content Management System built for MapleStory v83 private servers. Developed with **Next.js 14** and **TypeScript**, it delivers a sleek and powerful web experience for both players and administrators.

### ✨ Key Features

- 🏠 **Modern Landing Page** – Live server stats and animated UI
- 👤 **User Dashboard** – Account management, character view, rankings
- 🗳️ **Vote System** – Earn NX cash via vote rewards
- 👑 **Admin Panel** – Manage users, announcements, and the server
- 📊 **Live Rankings** – Real-time player stats and rankings
- 🎨 **Beautiful UI** – Responsive design with smooth animations
- 🔒 **Secure Auth** – Safe login and registration with JWT

---

## 🖥️ Prerequisites (Windows)

Before installation, ensure the following:

- **Node.js** (v18+): [Download](https://nodejs.org/)
- **Git for Windows** *(optional but recommended)*: [Download](https://git-scm.com/download/win)
- **Visual Studio Code** *(recommended)*: [Download](https://code.visualstudio.com/)
- **MapleStory v83 Server** with MySQL (required)

---

## 🚀 Installation Guide (Windows)

### Step 1: Clone or Download the Project

**Option A – Using Git:**
```bash
git clone https://github.com/yourusername/maplecore-cms.git](https://github.com/Khuwanko/MapleCore-CMS.git
cd maplecore-cms
```

Option B – Download ZIP:

Click "Code" → "Download ZIP"
Extract to C:\MapleCore-CMS


Step 2: Install Dependencies
```bash
npm install
```

Step 3: Configure Environment Variables
Create a .env.local file in the project root with:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=your_maplestory_database_name

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here-make-it-random

# VOTE SYSTEM
GTOP100_PINGBACK_KEY=maple_sd_vote_2025

# Server URL
NEXT_PUBLIC_API_URL=http://localhost:3000

# Discord Webhook
DISCORD_WEBHOOK_URL=your_discord_webhook_url_here

# Next.js Environment
NODE_ENV=development #production
```

Step 4: Set Up the Database

1. Go to the database/ folder
2. Open SQL files and copy contents
3. Use a MySQL tool (HeidiSQL, phpMyAdmin, etc.)
4. Connect to your v83 database
5. Run the SQL to create tables and fields

Step 5: Run the App
Development Mode:

```bash
npm run dev
```
Access via: http://localhost:3000

Production Build:
```bash
npm run build
npm start
```

📁 Project Structure
```bash
MapleCore-CMS/
├── src/
│   ├── app/               # Next.js App Dir
│   │   ├── page.tsx       # Landing Page
│   │   ├── auth/          # Auth Pages
│   │   ├── dashboard/     # User Dashboard
│   │   ├── admin/         # Admin Panel
│   │   └── api/           # API Routes
│   ├── components/        # UI Components
│   └── services/          # API Services
├── public/
│   └── assets/            # Images & Icons
├── database/              # SQL Setup Files
├── .env.local             # Your Environment File
└── package.json           # Project Metadata
```

🎮 Usage Guide

Players
```
✅ Register: Go to /register
🔐 Login: Manage your account, characters, and vote
💰 Vote: Earn NX through the voting system
💾 Download Client: Find it in the Dashboard → Download
```
Admins
```
🔧 Access Admin Panel: Log in with a GM account → /admin
📢 Create Announcements: Post updates & events
👥 User Management: View, update, and monitor users
```
🎨 Customization

🔤 Change Server Name
Find and replace MapleKaede in:
```
src/components/MapleKaedeLanding.tsx
src/components/UserDashboard.tsx
src/components/AdminPage.tsx
public/ logos and etc.
```
🎨 Change Colors
```
Update Tailwind classes in components:
orange-500 → Your primary color
amber-500 → Your secondary color
```

📬 Contributions & Support
Pull requests and issues are welcome!
If you'd like to contribute or report bugs just dm me.

❤️ Special Thanks
To the MapleStory private server community and all developers maintaining this game’s legacy!
