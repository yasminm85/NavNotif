// assets
import { IconBrandChrome, IconHelp, IconDashboard, IconNotification } from '@tabler/icons-react';

// constant
const icons = { IconBrandChrome, IconHelp, IconDashboard, IconNotification };

// ==============================|| Surat Tugas & DOCUMENTATION MENU ITEMS ||============================== //

const other = {
  id: 'sample-docs-roadmap',
  type: 'group',
  children: [
    {
      id: 'surat-tugas',
      title: 'Surat Tugas',
      type: 'item',
      url: '/surat-tugas',
      icon: icons.IconBrandChrome,
      breadcrumbs: false
    },
    {
      id: 'dashboard-pegawai',
      title: 'Dashboard Pegawai',
      type: 'item',
      url: '/dashboard-pegawai',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'daftar-notifikasi',
      title: 'Daftar Notifikasi',
      type: 'item',
      url: '/daftar-notifikasi',
      icon: icons.IconNotification,
      breadcrumbs: false
    },
  ]
};

export default other;
