'use strict'

const Lab = require('@hapi/lab')
const Hapi = require('@hapi/hapi')
const EventEmitter = require('events')
const { expect } = require('@hapi/code')

const { experiment, it, beforeEach } = (exports.lab = Lab.script())

experiment('hapi-class-extension-points plugin', () => {
  beforeEach(async () => {
    this.server = new Hapi.Server()

    await this.server.register({
      plugin: require('../lib/index')
    })
  })

  it('server has ".extClass" decoration', async () => {
    expect(this.server.extClass).to.exist()
  })

  it('registers class with extension points', async () => {
    class TestExtension {
      onRequest (request, h) {
        request.setUrl('/testing')

        return h.continue
      }
    }

    this.server.extClass(TestExtension)

    this.server.route({
      path: '/testing',
      method: 'GET',
      handler: request => request.path
    })

    const request = {
      url: '/',
      method: 'GET'
    }

    const response = await this.server.inject(request)
    expect(response.statusCode).to.equal(200)
    expect(response.payload).to.equal('/testing')
  })

  it('registers multiple classes', async () => {
    const emitter = new EventEmitter()
    let called = false

    emitter.on('onPreStart', () => {
      called = true
    })

    class TestExtension {
      onRequest (request, h) {
        request.setUrl('/testing')

        return h.continue
      }
    }

    class OnPreStart {
      onPreStart () {
        emitter.emit('onPreStart')
      }
    }

    this.server.extClass(TestExtension, OnPreStart)

    await this.server.initialize()
    expect(called).to.be.true()

    this.server.route({
      path: '/testing',
      method: 'GET',
      handler: request => request.path
    })

    const request = {
      url: '/',
      method: 'GET'
    }

    const response = await this.server.inject(request)
    expect(response.statusCode).to.equal(200)
    expect(response.payload).to.equal('/testing')
  })

  it('registers multiple classes from Array', async () => {
    const emitter = new EventEmitter()
    let called = false

    emitter.on('onPreStart', () => {
      called = true
    })

    class TestExtension {
      onRequest (request, h) {
        request.setUrl('/testing')

        return h.continue
      }
    }

    class OnPreStart {
      onPreStart () {
        emitter.emit('onPreStart')
      }
    }

    this.server.extClass([TestExtension, OnPreStart])

    await this.server.initialize()
    expect(called).to.be.true()
  })

  it('throws for non-class parameter', async () => {
    const extension = function onRequest () {}
    const throws = () => this.server.extClass(extension)
    expect(throws).to.throw()
  })

  it('throws when missing methods extending the request lifecycle', async () => {
    class TestExtension {
      constructor (server) {
        this.server = server
      }
    }

    const throws = () => this.server.extClass(TestExtension)
    expect(throws).to.throw()
  })
})
