'use strict'

const Extender = require('./registers-lifecycle-extensions')

function register (server) {
  const extendServer = new Extender(server)

  server.decorate('server', 'extClass', (...classes) => extendServer.with(classes))
}

exports.plugin = {
  register,
  once: true,
  pkg: require('../package.json'),
  requirements: { hapi: '>=17.0.0' }
}
