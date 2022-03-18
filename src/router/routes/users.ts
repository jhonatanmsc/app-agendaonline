export default [
    {
        path: '/usuarios',
        name: 'apps-users-list',
        component: () => import('@/views/apps/user/users-list/UsersList.vue'),
        meta: {
            pageTitle: 'Usuários',
            breadcrumb: [
                {
                    text: 'Usuários',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/usuarios/novo',
        name: 'apps-users-create',
        component: () => import('@/views/apps/user/users-edit/UsersEdit.vue'),
        meta: {
            pageTitle: 'Usuários',
            breadcrumb: [
                {
                    text: 'Usuários',
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
        path: '/usuario/:id/editar',
        name: 'apps-users-edit',
        component: () => import('@/views/apps/user/users-edit/UsersEdit.vue'),
        meta: {
            pageTitle: 'Usuários',
            breadcrumb: [
                {
                    text: 'Usuários',
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
