// assets
import { IconDashboard } from '@tabler/icons-react';
import AssignmentIcon from '@mui/icons-material/Assignment';

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
      allowedRoles: ['admin'],   // <-- role admin
      breadcrumbs: false

    },
    {
      id: 'disposisi',
      title: 'Disposisi',
      type: 'item',
      url: '/disposisi',
      icon: AssignmentIcon,
      allowedRoles: ['admin'],   // <-- hanya admin
      breadcrumbs: false

    },
  ]
};

export default dashboard;
