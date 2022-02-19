export default [
  {
    path: '/empresas',
    name: 'apps-companies',
    component: () => import('@/views/apps/companies/company-list/CompanyList.vue'),
    meta: {
      pageTitle: 'Empresas',
      breadcrumb: [
        {
          text: 'Configurações',
        },
        {
          text: 'Empresas',
          active: true,
        },
      ],
    },
  },
  {
    path: '/empresas/nova',
    name: 'apps-company-create',
    component: () => import('@/views/apps/companies/company-list/CompanyAdd.vue'),
    meta: {
      pageTitle: 'Nova Empresa',
      breadcrumb: [
        {
          text: 'Configurações',
        },
        {
          text: 'Empresas',
          to: { name: 'apps-companies' },
        },
        {
          text: 'Nova',
          active: true,
        },
      ],
    },
  },
  {
    path: '/empresa/:id',
    name: 'apps-company-view',
    component: () => import('@/views/apps/companies/company-list/CompanyAdd.vue'),
    props: {
      isView: true,
    },
    meta: {
      pageTitle: 'Editar Empresa',
      breadcrumb: [
        {
          text: 'Configurações',
        },
        {
          text: 'Empresas',
          to: { name: 'apps-companies' },
        },
        {
          text: 'Editar',
          active: true,
        },
      ],
    },
  },
  {
    path: '/empresa/:id/editar',
    name: 'apps-company-edit',
    component: () => import('@/views/apps/companies/company-list/CompanyAdd.vue'),
    meta: {
      pageTitle: 'Editar Empresa',
      breadcrumb: [
        {
          text: 'Configurações',
        },
        {
          text: 'Empresas',
          to: { name: 'apps-companies' },
        },
        {
          text: 'Editar',
          active: true,
        },
      ],
    },
  },
]
