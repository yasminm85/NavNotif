// src/menu-items/other.js
import { IconDashboard } from '@tabler/icons-react';
import AssignmentIcon from '@mui/icons-material/Assignment';
import NotificationsIcon from '@mui/icons-material/Notifications';


const other = {
  id: 'other-group',
  type: 'group',
  title: 'Lainnya',
  children: [
  {
    id: 'dashboard-pegawai',
    title: 'Dashboard Pegawai',
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
  }

  ]
};


export default other;
