// src/menu-items/other.js
import { IconDashboard } from '@tabler/icons-react';
import AssignmentIcon from '@mui/icons-material/Assignment';
// 03feb2026
import FeedbackIcon from '@mui/icons-material/Feedback';
// 03feb2026

const other = {
  id: 'other-group',
  type: 'group',
  title: 'Halaman Pegawai',
  children: [
    {
      id: 'dashboard-pegawai',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard-pegawai',
      icon: IconDashboard,
      breadcrumbs: false,
      allowedRoles: ['pegawai']
    },
    {
      id: 'notifikasi',
      title: 'Notifikasi',
      type: 'item',
      url: '/daftar-notifikasi',
      icon: AssignmentIcon,
      breadcrumbs: false,
      allowedRoles: ['pegawai']
    },
    // 03feb2026
    {
      id: 'daftar-tindak-lanjut',
      title: 'Daftar Tindak Lanjut',
      type: 'item',
      url: '/daftar-tindak-lanjut',
      icon: FeedbackIcon,
      breadcrumbs: false,
      allowedRoles: ['pegawai']
    }
    // 03feb2026

  ]
};


export default other;
