export default [
  {
    path: '/estoque/unidades-de-medida',
    name: 'stock-units-measures',
    component: () => import('@/views/pages/stock/units-measures/unit-measure-list/UnitMeasureList.vue'),
    meta: {
      pageTitle: 'Unidades de medida',
      breadcrumb: [
        {
          text: 'Estoque',
        },
        {
          text: 'Unidades de medida',
          active: true,
        },
      ],
    },
  },
  {
    path: '/estoque/unidades-de-medida/:id',
    name: 'stock-units-measures-view',
    component: () => import('@/views/pages/stock/units-measures/unit-measure-edit/UnitMeasureEdit.vue'),
    props: {
      isView: true,
    },
    meta: {
      pageTitle: 'Unidades de medida',
      breadcrumb: [
        {
          text: 'Estoque',
        },
        {
          text: 'Unidades de medida',
          active: true,
        },
      ],
    },
  },
  {
    path: '/estoque/unidades-de-medida/:id/editar',
    name: 'stock-units-measures-edit',
    component: () => import('@/views/pages/stock/units-measures/unit-measure-edit/UnitMeasureEdit.vue'),
    meta: {
      pageTitle: 'Unidades de medida',
      breadcrumb: [
        {
          text: 'Estoque',
        },
        {
          text: 'Unidades de medida',
          active: true,
        },
      ],
    },
  },
  {
    path: '/estoque/unidades-de-medida/cadastro',
    name: 'stock-units-measures-create',
    component: () => import('@/views/pages/stock/units-measures/unit-measure-edit/UnitMeasureEdit.vue'),
    meta: {
      pageTitle: 'Unidades de medida',
      breadcrumb: [
        {
          text: 'Estoque',
        },
        {
          text: 'Unidades de medida',
          active: true,
        },
      ],
    },
  },
]
