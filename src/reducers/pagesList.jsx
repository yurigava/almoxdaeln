//Aqui são inseridas as páginas com o texto a ser mostrado na Drawer e o link a ser acessado no Router
export const pagesList = [
  {
    info: {
      link: 'login',
      linkText: 'Login'
    },
    allowedRoles: [
      "loggedOut"
    ]
  },
  {
    info: {
      link: 'addReserve',
      linkText: 'Adicionar Reservas'
    },
    allowedRoles: [
      "professor",
      "admin"
    ]
  },
  {
    info: {
      link: 'prepareReserve',
      linkText: 'Preparar Reserva'
    },
    allowedRoles: [
      "almoxarife",
      "admin"
    ]
  },
  {
    info: {
      link: 'provideReserve',
      linkText: 'Entregar Reserva ao Professor'
    },
    allowedRoles: [
      "almoxarife",
      "admin"
    ]
  },
  {
    info: {
      link: 'returnReserve',
      linkText: 'Devolver Reserva'
    },
    allowedRoles: [
      "almoxarife",
      "admin"
    ]
  },
  {
    info: {
      link: 'changeEquipState',
      linkText: 'Controle de Equipamentos'
    },
    allowedRoles: [
      "almoxarife",
      "admin"
    ]
  },
  {
    info: {
      link: 'addEquips',
      linkText: 'Registrar Equipamentos'
    },
    allowedRoles: [
      "almoxarife",
      "admin"
    ]
  },
  {
    info: {
      link: 'changeFamiliaName',
      linkText: 'Alterar nome de Família'
    },
    allowedRoles: [
      "admin"
    ]
  },
  {
    info: {
      link: 'changeTipoName',
      linkText: 'Alterar nome de Tipo'
    },
    allowedRoles: [
      "admin"
    ]
  },
  {
    info: {
      link: 'addFamilia',
      linkText: 'Adicionar Família de Equipamentos'
    },
    allowedRoles: [
      "admin"
    ]
  },
  {
    info: {
      link: 'addTipo',
      linkText: 'Adicionar Tipo de Equipamento'
    },
    allowedRoles: [
      "admin"
    ]
  },
  {
    info: {
      link: 'equips',
      linkText: 'Equipamentos'
    },
    allowedRoles: [
      "almoxarife",
      "professor",
      "admin"
    ]
  },
  {
    info: {
      link: 'equipsGraphics',
      linkText: 'Gráfico de Equipamentos'
    },
    allowedRoles: [
      "almoxarife",
      "admin"
    ]
  },
  {
    info: {
      link: 'studentLend',
      linkText: 'Empréstimo Para Aluno'
    },
    allowedRoles: [
      "almoxarife"
    ]
  },
  {
    info: {
      link: 'studentReturn',
      linkText: 'Devolução de Aluno'
    },
    allowedRoles: [
      "almoxarife"
    ]
  },
  {
    info: {
      link: 'logout',
      linkText: 'Logout'
    },
    allowedRoles: [
      "almoxarife",
      "professor",
      "admin"
    ]
  }
];
