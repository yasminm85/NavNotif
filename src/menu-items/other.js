// assets
import { IconBrandChrome, IconNotification } from '@tabler/icons-react';

// constant
const icons = { IconBrandChrome, IconNotification };

// ==============================|| Disposisi & DOCUMENTATION MENU ITEMS ||============================== //

const other = {
  id: 'sample-docs-roadmap',
  type: 'group',
  children: [
    {
      id: 'disposisi',
      title: 'Disposisi',
      type: 'item',
      url: '/disposisi',
      icon: icons.IconBrandChrome,
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
