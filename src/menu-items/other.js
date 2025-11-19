// assets
import { IconBrandChrome, IconHelp } from '@tabler/icons-react';

// constant
const icons = { IconBrandChrome, IconHelp };

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
  ]
};

export default other;
