export default [
    {
        path: '/configuracoes/sms',
        name: 'apps-messages-list',
        component: () => import('@/views/apps/messages/messages-list/MessagesList.vue'),
        meta: {
            pageTitle: 'Mensagem',
            breadcrumb: [
                {
                    text: 'Configurações',
                },
                {
                    text: 'Mensagem',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/configuracoes/sms/novo',
        name: 'apps-messages-create',
        component: () => import('@/views/apps/messages/messages-edit/MessagesEdit.vue'),
        meta: {
            pageTitle: 'Mensagem',
            breadcrumb: [
                {
                    text: 'Configurações',
                },
                {
                    text: 'Mensagem',
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
        path: '/configuracoes/sms/:id',
        name: 'apps-messages-view',
        component: () => import('@/views/apps/messages/messages-edit/MessagesEdit.vue'),
        props: {
            isView: true
        },
        meta: {
            pageTitle: 'Mensagem',
            breadcrumb: [
                {
                    text: 'Configurações',
                },
                {
                    text: 'Mensagem',
                    to: { name: 'apps-users-list' },
                },
                {
                    text: 'Visualizar',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/configuracoes/sms/:id/editar',
        name: 'apps-messages-edit',
        component: () => import('@/views/apps/messages/messages-edit/MessagesEdit.vue'),
        meta: {
            pageTitle: 'Mensagem',
            breadcrumb: [
                {
                    text: 'Configurações',
                },
                {
                    text: 'Mensagem',
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
