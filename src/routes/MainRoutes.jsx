import { lazy } from 'react';

import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import ProtectedRoute from './ProtectedRoute';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// Disposisi routing
const Disposisi = Loadable(lazy(() => import('views/disposisi')));

//daftar display routing
const DaftarDisplay = Loadable(lazy(() => import('views/daftar-display')));

// dashboard pegawai routing
const DashboardPegawai = Loadable(lazy(() => import('views/dashboard-pegawai/Default')));

//daftar notifikasi routing
const DaftarNotifikasi = Loadable(lazy(() => import('views/daftar-notifikasi')));


// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <ProtectedRoute>
        <MainLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      path: '/',
      element: 
        <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: '/disposisi',
      element: (
            <ProtectedRoute allowedRoles={['admin']} > 
            <Disposisi />
            </ProtectedRoute>
      )
    },
    {
      path: '/daftar-display',
      element: (
            <ProtectedRoute allowedRoles={['admin']} > 
            <DaftarDisplay />
            </ProtectedRoute>
      )
    },
    {
      path: '/dashboard-pegawai',
      element: (
            <ProtectedRoute allowedRoles={['pegawai']} > 
            <DashboardPegawai />
            </ProtectedRoute>
      )
    },
    {
      path: '/daftar-notifikasi',
      element: (
            <ProtectedRoute allowedRoles={['pegawai']} > 
            <DaftarNotifikasi />
            </ProtectedRoute>
      )
    }
  ]
};

export default MainRoutes;
