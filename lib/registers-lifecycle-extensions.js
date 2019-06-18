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

  /**
   * Checks whether the given `class` parameter  is a class
   * and if yes, it registers lifecycle extension points
   * from the given `class`. Throws otherwise.
   *
   * @param {Class} clazz
   *
   * @throws
   */
  from (clazz) {
    if (this.isClass(clazz)) {
      return this.loadFrom(clazz)
    }

    throw new Error(`Cannot load middleware ${clazz}. Only classes are supported.`)
  }

  /**
   * Determines whether the given `clazz`
   * is a JavaScript class.
   *
   * @param {Class} clazz
   *
   * @returns {Boolean}
   */
  isClass (clazz) {
    return Typical.isClass(clazz)
  }

  /**
   * Creates a class instance and determines whether the
   * instance implements any lifecycle extensions. If
   * yes, it registers all methods. Throws otherwise.
   *
   * @param {Class} ClassWithLifecycleExtensions
   *
   * @throws
   */
  loadFrom (ClassWithLifecycleExtensions) {
    const instance = new ClassWithLifecycleExtensions(this.server)

    if (this.hasLifecycleMethods(instance)) {
      return this.registerLifecycleExtensions(instance)
    }

    const message = `
      Your middleware ${instance.constructor.name} does not include a valid hapi request lifecycle extension point.
      Implement at least one of the following methods:
      -> ${this.allowedExtensionPoints}.
    `

    throw new Error(message)
  }

  /**
   * Determines whether the class `instance`
   * implements a hapi lifecycle method.
   *
   * @param {Object} classInstance
   *
   * @returns {Boolean}
   */
  hasLifecycleMethods (classInstance) {
    return !_.isEmpty(this.implementedLifecycleMethods(classInstance))
  }

  /**
   * Returns the intersection of available lifecycle
   * extension points in hapi and the methods
   * implemented by the class `instance`.
   *
   * @param {Object} classInstance
   *
   * @returns {Array}
   */
  implementedLifecycleMethods (classInstance) {
    return _.intersection(
      this.allowedExtensionPoints,
      this.classMethods(classInstance)
    )
  }

  /**
   * Returns the list of methods implemented
   * by the class `instance`. This list
   * also includes the constructor.
   *
   * @param {Object} instance
   *
   * @returns {Array}
   */
  classMethods (instance) {
    return Object.getOwnPropertyNames(Object.getPrototypeOf(instance))
  }

  /**
   * Register all lifecycle extension points
   * to the hapi server.
   *
   * @param {Object} instance
   */
  registerLifecycleExtensions (instance) {
    const lifecycleMethods = this.implementedLifecycleMethods(instance)

    lifecycleMethods.forEach(method => {
      this.server.ext(method, async (request, h) => instance[method](request, h))
    })
  }
}

module.exports = RegisterLifecycleExtensions
