import { lazy } from 'react';

import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// Disposisi routing
const Disposisi = Loadable(lazy(() => import('views/disposisi')));

// dashboard pegawai routing
const DashboardPegawai = Loadable(lazy(() => import('views/dashboard-pegawai/Default')));

//daftar notifikasi routing
const DaftarNotifikasi = Loadable(lazy(() => import('views/daftar-notifikasi')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
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
      element: <Disposisi />
    },
    {
      path: '/dashboard-pegawai',
      element: <DashboardPegawai />
    },
    {
      path: '/daftar-notifikasi',
      element: <DaftarNotifikasi />
    }
  ]
};

export default MainRoutes;
