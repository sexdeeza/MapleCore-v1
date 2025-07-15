// src/services/api.ts
// This is your centralized API service - all API calls go here!

// Helper function for all API calls
async function apiCall(endpoint: string, options?: RequestInit) {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    // Handle different response types
    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // Handle non-JSON responses
      data = await response.text();
    }

    // Return both response status and data
    return { ok: response.ok, data, status: response.status };
  } catch (error) {
    // Network error or other fetch errors
    console.error('API call error:', error);
    return { 
      ok: false, 
      data: { error: 'Network error. Please check your connection.' }, 
      status: 0 
    };
  }
}

// ==========================================
// AUTH API - Used in auth/page.tsx
// ==========================================
export const authAPI = {
  login: async (username: string, password: string) => {
    return apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  register: async (userData: {
    username: string;
    email: string;
    password: string;
    birthday: string;
  }) => {
    return apiCall('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
};

// ==========================================
// ADMIN API - Used in AdminPage.tsx
// ==========================================
export const adminAPI = {
  checkAccess: async () => {
    return apiCall('/api/admin/check');
  },

  getUsers: async () => {
    return apiCall('/api/admin/users');
  },

  updateUserPassword: async (userId: number, newPassword: string) => {
    return apiCall('/api/admin/users/update-password', {
      method: 'POST',
      body: JSON.stringify({ userId, newPassword }),
    });
  },

  deleteUser: async (userId: number) => {
    return apiCall(`/api/admin/users/${userId}`, {
      method: 'DELETE',
    });
  },
};

// ==========================================
// DASHBOARD API - Used in UserDashboard.tsx
// ==========================================
export const dashboardAPI = {
  getStats: async () => {
    return apiCall('/api/dashboard/stats');
  },

  getCharacters: async () => {
    return apiCall('/api/dashboard/characters');
  },

  getRankings: async () => {
    return apiCall('/api/dashboard/rankings');
  },
};

// ==========================================
// ANNOUNCEMENTS API - Used in both AdminPage.tsx and UserDashboard.tsx
// ==========================================
export const announcementsAPI = {
  getAll: async () => {
    return apiCall('/api/announcements');
  },

  create: async (announcement: {
    type: 'event' | 'update' | 'maintenance';
    title: string;
    description: string;
    priority?: number;
  }) => {
    return apiCall('/api/announcements', {
      method: 'POST',
      body: JSON.stringify(announcement),
    });
  },

  delete: async (id: number) => {
    return apiCall(`/api/announcements?id=${id}`, {
      method: 'DELETE',
    });
  },
};

// ==========================================
// VOTE API - Used in UserDashboard.tsx
// ==========================================
export const voteAPI = {
  getStatus: async () => {
    return apiCall('/api/vote/status');
  },
};

// ==========================================
// SERVER API - Used in MapleKaedeLanding.tsx
// ==========================================
export const serverAPI = {
  getStatus: async () => {
    return apiCall('/api/server/status');
  },
};

// ==========================================
// DISCORD API - Used in MapleKaedeLanding.tsx
// ==========================================
export const discordAPI = {
  getServerInfo: async (serverId: string = '1388386202805342293') => {
    try {
      const response = await fetch(`https://discord.com/api/guilds/${serverId}/widget.json`);
      if (response.ok) {
        const data = await response.json();
        return {
          online: data.presence_count || 0,
          members: data.member_count || 0,
          loading: false
        };
      }
      throw new Error('Failed to fetch Discord data');
    } catch (error) {
      // Return fallback data
      return {
        online: 127,
        members: 2847,
        loading: false
      };
    }
  },
};