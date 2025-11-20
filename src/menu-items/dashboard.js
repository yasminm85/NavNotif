// assets
import { IconDashboard } from '@tabler/icons-react';

// constant
const icons = { IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',
  title: 'Dashboard',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.IconDashboard,
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
  ]
};

export default dashboard;
