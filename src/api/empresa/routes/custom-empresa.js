module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/empresasCards',
        handler: 'empresa.findCards',
        config: {
          auth: false,
        }
      },
    ]
  }