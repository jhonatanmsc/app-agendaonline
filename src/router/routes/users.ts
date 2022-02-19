export default [
    {
        path: '/auxiliares',
        name: 'apps-users-list',
        component: () => import('@/views/apps/user/users-list/UsersList.vue'),
        meta: {
            pageTitle: 'Auxiliares',
            breadcrumb: [
                {
                    text: 'Auxiliares',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/auxiliares/novo',
        name: 'apps-users-create',
        component: () => import('@/views/apps/user/users-edit/UsersEdit.vue'),
        meta: {
            pageTitle: 'Auxiliares',
            breadcrumb: [
                {
                    text: 'Auxiliares',
                    to: { name: 'apps-users-list' },
                },
                {
                    text: 'Cadastro',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/auxiliar/:id/editar',
        name: 'apps-users-edit',
        component: () => import('@/views/apps/user/users-edit/UsersEdit.vue'),
        meta: {
            pageTitle: 'Auxiliares',
            breadcrumb: [
                {
                    text: 'Auxiliares',
                    to: { name: 'apps-users-list' },
                },
                {
                    text: 'Editar',
                    active: true,
                },
            ],
        },
    },
]
