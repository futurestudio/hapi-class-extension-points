'use strict'

const RegisterLifecycleExtensions = require('./registers-lifecycle-extensions')

function register (server) {
  const registerExtensions = new RegisterLifecycleExtensions(server)

  server.decorate('server', 'extClass', (clazz) => registerExtensions.from(clazz))
}

exports.plugin = {
  register,
  once: true,
  pkg: require('../package.json'),
  requirements: { hapi: '>=18.0.0' }
}
