'use strict'

const Hapi = require('@hapi/hapi')

const server = new Hapi.Server({ host: 'localhost', port: 3000 })

async function kickOff () {
  await server.register({
    plugin: require('../lib')
  })

  server.extClass(require('./request-logger'))

  await server.start()
  console.log('server started on http://localhost:3000')
}

kickOff()
