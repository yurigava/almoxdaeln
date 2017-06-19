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
