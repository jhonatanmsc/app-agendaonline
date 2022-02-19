export default [
  {
    title: 'Estoque',
    icon: 'FileTextIcon',
    children: [
      {
        title: 'Cadastros',
        route: 'not-implemented',
        children: [
          {
            title: 'Unidades de medidas',
            route: { name: 'stock-units-measures', params: {} },
          },
          {
            title: 'Itens de estoque',
            route: { name: 'not-implemented', params: { id: 4987 } },
          },
          {
            title: 'Locais de estoque',
            route: { name: 'not-implemented', params: { id: 4987 } },
          },
        ]
      },
      {
        title: 'Movimentações',
        route: { name: 'not-implemented', params: { id: 4987 } },
      },
      {
        title: 'Contagens',
        route: { name: 'not-implemented', params: { id: 4987 } },
      },

    ],
  },
]
