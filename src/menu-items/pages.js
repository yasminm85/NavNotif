// assets
import { IconKey } from '@tabler/icons-react';

// constant
const icons = {
  IconKey
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
  id: 'pages',
  title: 'Pages',
  caption: 'Pages Caption',
  icon: icons.IconKey,
  type: 'group',
  children: [
    {
      id: 'authentication',
      title: 'Authentication',
      type: 'collapse',
      icon: icons.IconKey,
      children: [
        {
          id: 'login',
          title: 'login',
          type: 'item',
          url: '/pages/login',
          target: true
        },
      ]
    },
    {
          id: 'sample-page',
          title: 'Sample Page',
          type: 'item',
          url: '/sample-page',
          icon: icons.IconBrandChrome,
          breadcrumbs: false
        },
  ]
};

export default pages;
