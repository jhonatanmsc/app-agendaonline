export default [
  {
    path: '/unidades-de-atendimento',
    name: 'apps-unities',
    component: () => import('@/views/apps/unities/unity-list/UnityList.vue'),
    meta: {
      pageTitle: 'Unidades de atendimento',
      breadcrumb: [
        {
          text: 'Configurações',
        },
        {
          text: 'Unidades de atendimento',
          active: true,
        },
      ],
    },
  },
  {
    path: '/unidades-de-atendimento/nova',
    name: 'apps-unities-create',
    component: () => import('@/views/apps/unities/unity-list/UnityAdd.vue'),
    meta: {
      pageTitle: 'Nova Unidade de atendimento',
      breadcrumb: [
        {
          text: 'Configurações',
        },
        {
          text: 'Unidades de atendimento',
          to: { name: 'apps-unities' },
        },
        {
          text: 'Nova',
          active: true,
        },
      ],
    },
  },
  {
    path: '/unidades-de-atendimento/:id',
    name: 'apps-unities-view',
    component: () => import('@/views/apps/unities/unity-list/UnityAdd.vue'),
    props: {
      isView: true,
    },
    meta: {
      pageTitle: 'Editar Unidade de atendimento',
      breadcrumb: [
        {
          text: 'Configurações',
        },
        {
          text: 'Unidades de atendimento',
          to: { name: 'apps-unities' },
        },
        {
          text: 'Editar',
          active: true,
        },
      ],
    },
  },
  {
    path: '/unidades-de-atendimento/:id/editar',
    name: 'apps-unities-update',
    component: () => import('@/views/apps/unities/unity-list/UnityAdd.vue'),
    meta: {
      pageTitle: 'Editar Unidade de atendimento',
      breadcrumb: [
        {
          text: 'Configurações',
        },
        {
          text: 'Unidades de atendimento',
          to: { name: 'apps-unities' },
        },
        {
          text: 'Editar',
          active: true,
        },
      ],
    },
  },
]
