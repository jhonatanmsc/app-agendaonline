export default [
  {
    path: '/pacientes',
    name: 'patients-list',
    component: () => import('@/views/apps/patients/patients-list/PatientsList.vue'),
    meta: {
      pageTitle: 'Pacientes',
      breadcrumb: [
        {
          text: 'Pacientes',
          active: true,
        },
      ],
    },
  },
  {
    path: '/pacientes/novo',
    name: 'patient-create',
    component: () => import('@/views/apps/patients/patients-list/PatientAdd.vue'),
    meta: {
      pageTitle: 'Pacientes',
      breadcrumb: [
        {
          text: 'Pacientes',
          to: { name: 'patients-list' },
        },
        {
          text: 'Novo',
          active: true,
        },
      ],
    },
  },
  {
    path: '/paciente/:id',
    name: 'patient-update',
    component: () => import('@/views/apps/patients/patients-list/PatientAdd.vue'),
    meta: {
      pageTitle: 'Pacientes',
      breadcrumb: [
        {
          text: 'Pacientes',
          to: { name: 'patients-list' },
        },
        {
          text: 'Editar',
          active: true,
        },
      ],
    },
  },
]
