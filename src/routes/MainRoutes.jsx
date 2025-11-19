import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// Surat Tugas routing
const SuratTugas = Loadable(lazy(() => import('views/surat-tugas')));

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
      path: '/surat-tugas',
      element: <SuratTugas />
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
