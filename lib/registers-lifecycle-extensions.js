'use strict'

const _ = require('lodash')
const Typical = require('typical')

class RegisterLifecycleExtensions {
  constructor (server) {
    this.server = server
    this.allowedExtensionPoints = [
      'onPreStart',
      'onPostStart',
      'onRequest',
      'onPreAuth',
      'onCredentials',
      'onPostAuth',
      'onPreHandler',
      'onPostHandler',
      'onPreResponse',
      'onPreStop',
      'onPostStop'
    ]
  }

  from (clazz) {
    if (Typical.isClass(clazz)) {
      return this._loadFromClass(clazz)
    }

    throw new Error(`Cannot load middleware ${clazz}. Only classes are supported.`)
  }

  _loadFromClass (Extension) {
    const middleware = new Extension(this.server)

    if (!this._hasLifecycleMethods(middleware)) {
      throw new Error(`Your middleware ${middleware.constructor.name} does not include a valid hapi request lifecycle extension point.
        Implement at least one of the following methods:
        -> ${this.allowedExtensionPoints}.
      `)
    }

    this._implementedLifecycleMethods(middleware).forEach(method => {
      this.server.ext(method, async (request, h) => middleware[method](request, h))
    })
  }

  _hasLifecycleMethods (middleware) {
    return !_.isEmpty(this._implementedLifecycleMethods(middleware))
  }

  _implementedLifecycleMethods (middleware) {
    return _.intersection(
      this.allowedExtensionPoints,
      this._classMethods(middleware)
    )
  }

  _classMethods (middleware) {
    return Object.getOwnPropertyNames(Object.getPrototypeOf(middleware))
  }
}

module.exports = RegisterLifecycleExtensions
