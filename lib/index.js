'use strict'

const Extender = require('./registers-lifecycle-extensions')

function register (server) {
  const extendServer = new Extender(server)

  server.decorate('server', 'extClass', (clazz) => extendServer.from(clazz))
}

exports.plugin = {
  register,
  once: true,
  pkg: require('../package.json'),
  requirements: { hapi: '>=17.0.0' }
}
