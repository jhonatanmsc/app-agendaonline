export default [
  {
    path: '/convenios-e-planos',
    name: 'apps-plans',
    component: () => import('@/views/apps/plans/plan-list/PlanList.vue'),
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
    name: 'apps-plans-create',
    component: () => import('@/views/apps/plans/plan-list/PlanAdd.vue'),
    meta: {
      pageTitle: 'Novo Convênio / plano',
      breadcrumb: [
        {
          text: 'Configurações',
        },
        {
          text: 'Convênios e planos',
          to: { name: 'apps-plans' },
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
    name: 'apps-plans-update',
    component: () => import('@/views/apps/plans/plan-list/PlanAdd.vue'),
    meta: {
      pageTitle: 'Editar Convênio / plano',
      breadcrumb: [
        {
          text: 'Configurações',
        },
        {
          text: 'Convênios e planos',
          to: { name: 'apps-plans' },
        },
        {
          text: 'Editar',
          active: true,
        },
      ],
    },
  },
]
