export default [
  {
    path: '/profissionais-de-saude',
    name: 'apps-professionals',
    component: () => import('@/views/apps/professionals/professional-list/ProfessionalList.vue'),
    meta: {
      pageTitle: 'Profissionais de saúde',
      breadcrumb: [
        {
          text: 'Configurações',
        },
        {
          text: 'Profissionais de saúde',
          active: true,
        },
      ],
    },
  },
  {
    path: '/profissionais-de-saude/novo',
    name: 'apps-professionals-create',
    component: () => import('@/views/apps/professionals/professional-edit/ProfessionalEdit.vue'),
    meta: {
      pageTitle: 'Novo Profissional de saúde',
      breadcrumb: [
        {
          text: 'Configurações',
        },
        {
          text: 'Profissionais de saúde',
          to: { name: 'apps-professionals' },
        },
        {
          text: 'Novo',
          active: true,
        },
      ],
    },
  },
  {
    path: '/profissionais-de-saude/:id',
    name: 'apps-professionals-view',
    component: () => import('@/views/apps/professionals/professional-edit/ProfessionalEdit.vue'),
    props: {
        isView: true
    },
    meta: {
      pageTitle: 'Editar profissional de saúde',
      breadcrumb: [
        {
          text: 'Configurações',
        },
        {
          text: 'Profissionais de saúde',
          to: { name: 'apps-professionals' },
        },
        {
          text: 'Visualizar',
          active: true,
        },
      ],
    },
  },
  {
    path: '/profissionais-de-saude/:id/editar',
    name: 'apps-professionals-edit',
    component: () => import('@/views/apps/professionals/professional-edit/ProfessionalEdit.vue'),
    meta: {
      pageTitle: 'Editar profissional de saúde',
      breadcrumb: [
        {
          text: 'Configurações',
        },
        {
          text: 'Profissionais de saúde',
          to: { name: 'apps-professionals' },
        },
        {
          text: 'Editar',
          active: true,
        },
      ],
    },
  },
]
