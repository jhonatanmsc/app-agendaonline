export default [
  {
    path: '/convenios-e-planos',
    name: 'apps-covenants',
    component: () => import('@/views/apps/covenants/covenant-list/CovenantList.vue'),
    meta: {
      pageTitle: 'Convênios e planos',
      breadcrumb: [
        {
          text: 'Configurações',
        },
        {
          text: 'Convênios e planos',
          active: true,
        },
      ],
    },
  },
  {
    path: '/convenios-e-planos/novo',
    name: 'apps-covenants-create',
    component: () => import('@/views/apps/covenants/covenant-edit/CovenantEdit.vue'),
    meta: {
      pageTitle: 'Novo Convênio / plano',
      breadcrumb: [
        {
          text: 'Configurações',
        },
        {
          text: 'Convênios e planos',
          to: { name: 'apps-covenants' },
        },
        {
          text: 'Novo',
          active: true,
        },
      ],
    },
  },
  {
    path: '/convenios-e-planos/:id',
    name: 'apps-covenants-view',
    props: {
      isView: true,
    },
    component: () => import('@/views/apps/covenants/covenant-edit/CovenantEdit.vue'),
    meta: {
      pageTitle: 'Editar Convênio / plano',
      breadcrumb: [
        {
          text: 'Configurações',
        },
        {
          text: 'Convênios e planos',
          to: { name: 'apps-covenants' },
        },
        {
          text: 'Editar',
          active: true,
        },
      ],
    },
  },
  {
    path: '/convenios-e-planos/:id/editar',
    name: 'apps-covenants-update',
    component: () => import('@/views/apps/covenants/covenant-edit/CovenantEdit.vue'),
    meta: {
      pageTitle: 'Editar Convênio / plano',
      breadcrumb: [
        {
          text: 'Configurações',
        },
        {
          text: 'Convênios e planos',
          to: { name: 'apps-covenants' },
        },
        {
          text: 'Editar',
          active: true,
        },
      ],
    },
  },
]
