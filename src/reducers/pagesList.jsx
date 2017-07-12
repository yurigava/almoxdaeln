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
      link: 'addFamilia',
      linkText: 'Adicionar Família de Equipamentos'
    },
    allowedRoles: [
      "almoxarife",
      "admin"
    ]
  },
  {
    info: {
      link: 'addTipo',
      linkText: 'Adicionar Tipo de Equipamento'
    },
    allowedRoles: [
      "almoxarife",
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
      link: 'addReserve',
      linkText: 'Adicionar Reservas'
    },
    allowedRoles: [
      "almoxarife",
      "professor",
      "admin"
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
