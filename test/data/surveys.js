module.exports = [{
  _id: 'eeeeeeef0000000f00000000',
  title: 'Declaramos estado de greve?',
  createDate: Date.now(),
  author: 'aaaaaaaf0000000f00001111',
  closeDate: Date.now() + (24 * 3600 * 50000),
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ' +
    'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis ' +
    'nostrud exercitation ullamco laboris \n\n nisi ut aliquip ex ea commodo ' +
    'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum ' +
    'dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, ' +
    'sunt in culpa qui officia deserunt mollit anim id est laborum.',
  ballot: [{
      option: 'True',
      votes: [
      { user: 'aaaaaaaf0000000f00001111' },
      { user: 'aaaaaaaf0000000f00003333' },
      { user: 'aaaaaaaf0000000f00004444' }
    ]
  }],
  posts: [
    { user: 'aaaaaaaf0000000f00001111', date: Date.now() - 1000, message: '1000 bla bla bla bla' },
    { user: 'aaaaaaaf0000000f00002222', date: Date.now() - 2000, message: '2000 bla bla bla bla' },
    { user: 'aaaaaaaf0000000f00001111', date: Date.now() - 3000, message: '3000 bla bla bla bla' },
    { user: 'aaaaaaaf0000000f00003333', date: Date.now() - 4000, message: '4000 bla bla bla bla' },
    { user: 'aaaaaaaf0000000f00001111', date: Date.now() - 5000, message: '5000 bla bla bla bla' },
    { user: 'aaaaaaaf0000000f00001111', date: Date.now() - 6000, message: '8000 bla bla bla bla' },
    { user: 'aaaaaaaf0000000f00001111', date: Date.now() - 7000, message: '7000 bla bla bla bla' },
    { user: 'aaaaaaaf0000000f00001111', date: Date.now() - 8000, message: '8000 bla bla bla bla' },
    { user: 'aaaaaaaf0000000f00001111', date: Date.now() - 9000, message: '9000 bla bla bla bla' },
    { user: 'aaaaaaaf0000000f00001111', date: Date.now() - 10000, message: '10000 bla bla bla bla' }
  ]
}, {
  _id: 'eeeeeeef0000000f00001111',
  title: 'Devemos aceitar o fim do nível 5?',
  author: 'aaaaaaaf0000000f00002222',
  createDate: Date.now() - 30000,
  closeDate: Date.now() + (24 * 3600 * 30000),
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ' +
    'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis ' +
    'nostrud exercitation ullamco laboris \n\n nisi ut aliquip ex ea commodo ' +
    'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum ' +
    'dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, ' +
    'sunt in culpa qui officia deserunt mollit anim id est laborum.',
  ballot: [{
      option: 'True',
      votes: [
      { user: 'aaaaaaaf0000000f00001111' },
      { user: 'aaaaaaaf0000000f00002222' },
      { user: 'aaaaaaaf0000000f00004444' }
    ]
  }, {
      option: 'False',
      votes: [
      { user: 'aaaaaaaf0000000f00003333' },
    ]
  }],
  posts: []
}, {
  _id: 'eeeeeeef0000000f00002222',
  title: 'Lorem ipsum',
  author: 'aaaaaaaf0000000f00001111',
  createDate: Date.now(),
  closeDate: Date.now() + (24 * 3600 * 1000),
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ' +
    'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis ' +
    'nostrud exercitation ullamco laboris \n\n nisi ut aliquip ex ea commodo ' +
    'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum ' +
    'dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, ' +
    'sunt in culpa qui officia deserunt mollit anim id est laborum.'
}, {
  _id: 'eeeeeeef0000000f00003333',
  title: 'ipsum dolor',
  author: 'aaaaaaaf0000000f00001111',
  createDate: Date.now(),
  closeDate: Date.now() + (24 * 3600 * 1000),
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ' +
    'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis ' +
    'nostrud exercitation ullamco laboris \n\n nisi ut aliquip ex ea commodo ' +
    'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum ' +
    'dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, ' +
    'sunt in culpa qui officia deserunt mollit anim id est laborum.'
}, {
  _id: 'eeeeeeef0000000f00004444',
  title: 'dolor sit',
  author: 'aaaaaaaf0000000f00001111',
  createDate: Date.now(),
  closeDate: Date.now() + (24 * 3600 * 1000),
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ' +
    'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis ' +
    'nostrud exercitation ullamco laboris \n\n nisi ut aliquip ex ea commodo ' +
    'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum ' +
    'dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, ' +
    'sunt in culpa qui officia deserunt mollit anim id est laborum.'
}, {
  _id: 'eeeeeeef0000000f00005555',
  title: 'sit amet',
  author: 'aaaaaaaf0000000f00001111',
  createDate: Date.now(),
  closeDate: Date.now() + (24 * 3600 * 1000),
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ' +
    'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis ' +
    'nostrud exercitation ullamco laboris \n\n nisi ut aliquip ex ea commodo ' +
    'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum ' +
    'dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, ' +
    'sunt in culpa qui officia deserunt mollit anim id est laborum.'
}, {
  _id: 'eeeeeeef0000000f00006666',
  title: 'consectetur adipiscing',
  author: 'aaaaaaaf0000000f00001111',
  createDate: Date.now(),
  closeDate: Date.now() + (24 * 3600 * 1000),
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ' +
    'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis ' +
    'nostrud exercitation ullamco laboris \n\n nisi ut aliquip ex ea commodo ' +
    'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum ' +
    'dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, ' +
    'sunt in culpa qui officia deserunt mollit anim id est laborum.'
}, {
  _id: 'eeeeeeef0000000f00007777',
  title: 'elit sed',
  author: 'aaaaaaaf0000000f00001111',
  createDate: Date.now(),
  closeDate: Date.now() + (24 * 3600 * 1000),
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ' +
    'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis ' +
    'nostrud exercitation ullamco laboris \n\n nisi ut aliquip ex ea commodo ' +
    'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum ' +
    'dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, ' +
    'sunt in culpa qui officia deserunt mollit anim id est laborum.'
}, {
  _id: 'eeeeeeef0000000f00008888',
  title: 'sed do',
  author: 'aaaaaaaf0000000f00001111',
  createDate: Date.now(),
  closeDate: Date.now() + (24 * 3600 * 1000),
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ' +
    'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis ' +
    'nostrud exercitation ullamco laboris \n\n nisi ut aliquip ex ea commodo ' +
    'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum ' +
    'dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, ' +
    'sunt in culpa qui officia deserunt mollit anim id est laborum.'
}, {
  _id: 'eeeeeeef0000000f00009999',
  title: 'do eiusmod',
  author: 'aaaaaaaf0000000f00001111',
  createDate: Date.now(),
  closeDate: Date.now() + (24 * 3600 * 1000),
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ' +
    'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis ' +
    'nostrud exercitation ullamco laboris \n\n nisi ut aliquip ex ea commodo ' +
    'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum ' +
    'dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, ' +
    'sunt in culpa qui officia deserunt mollit anim id est laborum.'
}, {
  _id: 'eeeeeeef0000000f11110000',
  title: 'tempor incididunt',
  author: 'aaaaaaaf0000000f00001111',
  createDate: Date.now(),
  closeDate: Date.now() + (24 * 3600 * 1000),
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ' +
    'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis ' +
    'nostrud exercitation ullamco laboris \n\n nisi ut aliquip ex ea commodo ' +
    'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum ' +
    'dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, ' +
    'sunt in culpa qui officia deserunt mollit anim id est laborum.'
}, {
  _id: 'eeeeeeef0000000f11111111',
  title: 'incididunt ut labore',
  author: 'aaaaaaaf0000000f00001111',
  createDate: Date.now(),
  closeDate: Date.now() + (24 * 3600 * 1000),
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ' +
    'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis ' +
    'nostrud exercitation ullamco laboris \n\n nisi ut aliquip ex ea commodo ' +
    'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum ' +
    'dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, ' +
    'sunt in culpa qui officia deserunt mollit anim id est laborum.'
}, {
  _id: 'eeeeeeef0000000f11112222',
  title: 'cupidatat non proiden',
  author: 'aaaaaaaf0000000f00001111',
  createDate: Date.now(),
  closeDate: Date.now() + (24 * 3600 * 1000),
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ' +
    'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis ' +
    'nostrud exercitation ullamco laboris \n\n nisi ut aliquip ex ea commodo ' +
    'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum ' +
    'dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, ' +
    'sunt in culpa qui officia deserunt mollit anim id est laborum.'
}, {
  _id: 'eeeeeeef0000000f11113333',
  title: 'reprehenderit in voluptate',
  author: 'aaaaaaaf0000000f00001111',
  createDate: Date.now(),
  closeDate: Date.now() + (24 * 3600 * 1000),
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ' +
    'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis ' +
    'nostrud exercitation ullamco laboris \n\n nisi ut aliquip ex ea commodo ' +
    'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum ' +
    'dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, ' +
    'sunt in culpa qui officia deserunt mollit anim id est laborum.'
}, {
  _id: 'eeeeeeef0000000f11114444',
  title: 'mollit anim id est',
  author: 'aaaaaaaf0000000f00001111',
  createDate: Date.now(),
  closeDate: Date.now() + (24 * 3600 * 1000),
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ' +
    'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis ' +
    'nostrud exercitation ullamco laboris \n\n nisi ut aliquip ex ea commodo ' +
    'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum ' +
    'dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, ' +
    'sunt in culpa qui officia deserunt mollit anim id est laborum.'
}, {
  _id: 'eeeeeeef0000000f11115555',
  title: 'reprehenderit in voluptate',
  author: 'aaaaaaaf0000000f00001111',
  createDate: Date.now(),
  closeDate: Date.now() + (24 * 3600 * 1000),
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ' +
    'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis ' +
    'nostrud exercitation ullamco laboris \n\n nisi ut aliquip ex ea commodo ' +
    'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum ' +
    'dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, ' +
    'sunt in culpa qui officia deserunt mollit anim id est laborum.'
}, {
  _id: 'eeeeeeef0000000f11116666',
  title: 'nulla pariatur',
  author: 'aaaaaaaf0000000f00001111',
  createDate: Date.now(),
  closeDate: Date.now() + (24 * 3600 * 1000),
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ' +
    'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis ' +
    'nostrud exercitation ullamco laboris \n\n nisi ut aliquip ex ea commodo ' +
    'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum ' +
    'dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, ' +
    'sunt in culpa qui officia deserunt mollit anim id est laborum.'
}, {
  _id: 'eeeeeeef0000000f11117777',
  title: 'aliquip ex ea commodo',
  author: 'aaaaaaaf0000000f00001111',
  createDate: Date.now(),
  closeDate: Date.now() + (24 * 3600 * 1000),
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ' +
    'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis ' +
    'nostrud exercitation ullamco laboris \n\n nisi ut aliquip ex ea commodo ' +
    'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum ' +
    'dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, ' +
    'sunt in culpa qui officia deserunt mollit anim id est laborum.'
}, {
  _id: 'eeeeeeef0000000f11118888',
  title: 'labore et dolore magna aliquai ut',
  author: 'aaaaaaaf0000000f00001111',
  createDate: Date.now(),
  closeDate: Date.now() + (24 * 3600 * 1000),
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ' +
    'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis ' +
    'nostrud exercitation ullamco laboris \n\n nisi ut aliquip ex ea commodo ' +
    'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum ' +
    'dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, ' +
    'sunt in culpa qui officia deserunt mollit anim id est laborum.'
}, {
  _id: 'eeeeeeef0000000f11119999',
  title: 'Excepteur sint occaecat',
  author: 'aaaaaaaf0000000f00001111',
  createDate: Date.now(),
  closeDate: Date.now() + (24 * 3600 * 1000),
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ' +
    'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis ' +
    'nostrud exercitation ullamco laboris \n\n nisi ut aliquip ex ea commodo ' +
    'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum ' +
    'dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, ' +
    'sunt in culpa qui officia deserunt mollit anim id est laborum.'
}, {
  _id: 'eeeeeeef0000000f22220000',
  title: 'eiusmod dolor',
  author: 'aaaaaaaf0000000f00001111',
  createDate: Date.now(),
  closeDate: Date.now() + (24 * 3600 * 1000),
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ' +
    'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis ' +
    'nostrud exercitation ullamco laboris \n\n nisi ut aliquip ex ea commodo ' +
    'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum ' +
    'dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, ' +
    'sunt in culpa qui officia deserunt mollit anim id est laborum.'
}, {
  _id: 'eeeeeeef0000000f22221111',
  title: 'ipsum in reprehenderit',
  author: 'aaaaaaaf0000000f00001111',
  createDate: Date.now(),
  closeDate: Date.now() + (24 * 3600 * 1000),
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ' +
    'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis ' +
    'nostrud exercitation ullamco laboris \n\n nisi ut aliquip ex ea commodo ' +
    'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum ' +
    'dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, ' +
    'sunt in culpa qui officia deserunt mollit anim id est laborum.'
}, {
  _id: 'eeeeeeef0000000f22222222',
  title: 'Excepteur dolor',
  author: 'aaaaaaaf0000000f00001111',
  createDate: Date.now(),
  closeDate: Date.now() + (24 * 3600 * 1000),
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ' +
    'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis ' +
    'nostrud exercitation ullamco laboris \n\n nisi ut aliquip ex ea commodo ' +
    'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum ' +
    'dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, ' +
    'sunt in culpa qui officia deserunt mollit anim id est laborum.'
}, {
  _id: 'eeeeeeef0000000f22223333',
  title: 'Excepteur dolor',
  author: 'aaaaaaaf0000000f00001111',
  createDate: Date.now(),
  closeDate: Date.now() + (24 * 3600 * 1000),
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ' +
    'tempor incididunt ut  et dolore magna aliqua. Ut enim ad minim veniam, quis ' +
    'nostrud exercitation ullamco laboris \n\n nisi ut aliquip ex ea commodo ' +
    'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum ' +
    'dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, ' +
    'sunt in culpa qui officia deserunt mollit anim id est laborum.'
}, {
  _id: 'eeeeeeef0000000f22224444',
  title: 'incididunt labore',
  author: 'aaaaaaaf0000000f00001111',
  createDate: Date.now(),
  closeDate: Date.now() + (24 * 3600 * 1000),
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ' +
    'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis ' +
    'nostrud exercitation ullamco laboris \n\n nisi ut aliquip ex ea commodo ' +
    'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum ' +
    'dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, ' +
    'sunt in culpa qui officia deserunt mollit anim id est laborum.'
}, {
  _id: 'eeeeeeef0000000f22225555',
  title: 'exercitation pariatur',
  author: 'aaaaaaaf0000000f00001111',
  createDate: Date.now(),
  closeDate: Date.now() + (24 * 3600 * 1000),
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ' +
    'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis ' +
    'nostrud exercitation ullamco laboris \n\n nisi ut aliquip ex ea commodo ' +
    'consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum ' +
    'dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, ' +
    'sunt in culpa qui officia deserunt mollit anim id est laborum.'
}];
