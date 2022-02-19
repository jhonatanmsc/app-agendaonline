export default [
    {
        path: '/configuracoes/scheduling',
        name: 'settings-scheduling',
        component: () => import('@/views/pages/settings/scheduling/Scheduling.vue'),
        meta: {
            pageTitle: 'Agendamento online',
            breadcrumb: [
                {
                    text: 'Configurações',
                },
                {
                    text: 'Agendamento online',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/configuracoes/email',
        name: 'settings-email-setup',
        component: () => import('@/views/pages/settings/email-setup/EmailSetup.vue'),
        meta: {
            pageTitle: 'E-mail',
            breadcrumb: [
                {
                    text: 'Configurações',
                },
                {
                    text: 'E-mail',
                    active: true,
                },
            ],
        },
    },
    {
        path: '/configuracoes/backup',
        name: 'settings-backup',
        component: () => import('@/views/pages/settings/backup/Backup.vue'),
        meta: {
            pageTitle: 'Backup de dados',
            breadcrumb: [
                {
                    text: 'Configurações',
                },
                {
                    text: 'Backup',
                    active: true,
                },
            ],
        },
    },
]
