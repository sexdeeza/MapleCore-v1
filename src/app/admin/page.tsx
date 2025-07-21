// src/app/admin/page.tsx
'use client';

import dynamic from 'next/dynamic';

// Dynamically import AdminPage with no SSR to avoid hydration issues
const AdminPage = dynamic(() => import('@/components/admin-dashboard/AdminPage'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading admin panel...</p>
      </div>
    </div>
  )
});

export default function Admin() {
  return <AdminPage />;
}