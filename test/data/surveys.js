module.exports = [{
  _id: 'eeeeeeef0000000f00000000',
  title: 'Declaramos estado de greve?',
  createDate: Date.now(),
  closeDate: Date.now() + 30000,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ' +
    'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis ' +
    'nostrud exercitation ullamco laboris \n\n nisi ut aliquip ex ea commodo ' +
    'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum ' +
    'dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, ' +
    'sunt in culpa qui officia deserunt mollit anim id est laborum.',
  votes: [
    { user: 'aaaaaaaf0000000f00001111', option: true },
    { user: 'aaaaaaaf0000000f00002222', option: true },
    { user: 'aaaaaaaf0000000f00003333', option: false },
    { user: 'aaaaaaaf0000000f00004444', option: true }
  ],
  posts: [
    { user: 'aaaaaaaf0000000f00001111', date: Date.now() - 2000, message: '2000 bla bla bla bla' },
    { user: 'aaaaaaaf0000000f00002222', date: Date.now() - 3000, message: '3000 bla bla bla bla' },
    { user: 'aaaaaaaf0000000f00001111', date: Date.now() - 4000, message: '4000 bla bla bla bla' },
    { user: 'aaaaaaaf0000000f00003333', date: Date.now() - 5000, message: '5000 bla bla bla bla' },
    { user: 'aaaaaaaf0000000f00001111', date: Date.now() - 6000, message: '6000 bla bla bla bla' },
  ]
}, {
  _id: 'eeeeeeef0000000f00001111',
  title: 'Devemos aceitar o fim do nível 5?',
  createDate: Date.now() - 30000,
  closeDate: Date.now() - 10000,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ' +
    'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis ' +
    'nostrud exercitation ullamco laboris \n\n nisi ut aliquip ex ea commodo ' +
    'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum ' +
    'dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, ' +
    'sunt in culpa qui officia deserunt mollit anim id est laborum.',
  votes: [
    { user: 'aaaaaaaf0000000f00001111', option: true },
    { user: 'aaaaaaaf0000000f00002222', option: true },
    { user: 'aaaaaaaf0000000f00003333', option: false },
    { user: 'aaaaaaaf0000000f00004444', option: true }
  ],
  posts: []
}];
