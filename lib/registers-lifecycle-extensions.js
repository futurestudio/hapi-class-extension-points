'use strict'

const _ = require('lodash')
const { isClass } = require('@supercharge/classes')

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
   * @param {Array} clazz
   *
   * @throws
   */
  with (classes) {
    []
      .concat(...classes)
      .forEach(Candidate => {
        if (isClass(Candidate)) {
          return this.loadFrom(Candidate)
        }

        throw new Error(`Cannot load middleware ${Candidate}. Only classes are supported, received ${typeof Candidate}.`)
      })
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

    throw new Error(`
      Your middleware ${instance.constructor.name} does not include a valid hapi lifecycle extension point.
      Implement at least one of the following methods:
      -> ${this.allowedExtensionPoints}.
    `)
  }

  /**
   * Determines whether the class `instance` implements a hapi lifecycle method.
   *
   * @param {Object} classInstance
   *
   * @returns {Boolean}
   */
  hasLifecycleMethods (classInstance) {
    return !_.isEmpty(
      this.implementedLifecycleMethods(classInstance)
    )
  }

  /**
   * Returns the intersection of available lifecycle
   * extension points in hapi and the methods
   * implemented by the class `instance`.
   *
   * @param {Object} instance
   *
   * @returns {Array}
   */
  implementedLifecycleMethods (instance) {
    return _.intersection(
      this.allowedExtensionPoints,
      this.allMethodsInChainOf(instance)
    )
  }

  /**
   * Returns the list of unique method names in the inheritance/prototype chain.
   *
   * @param {Object} instance
   *
   * @returns {Array}
   */
  allMethodsInChainOf (instance) {
    const methods = []

    do {
      methods.push(...this.getMethodsOf(instance))
    } while (
      (instance = this.parentOf(instance))
    )

    return Array.from(new Set(methods))
  }

  /**
   * Returns the list of method names implemented
   * by the given `instance`.
   *
   * @param {Object} instance
   *
   * @returns {Array}
   */
  getMethodsOf (instance) {
    return Object
      .getOwnPropertyNames(instance)
      .filter(item => typeof instance[item] === 'function')
  }

  /**
   * Returns the parent instance, one level up in the inheritance chain.
   *
   * @param {Object} instance
   *
   * @returns {Object}
   */
  parentOf (instance) {
    return Object.getPrototypeOf(instance)
  }

  /**
   * Register all lifecycle extension points to the hapi server.
   *
   * @param {Object} instance
   */
  registerLifecycleExtensions (instance) {
    const lifecycleMethods = this.implementedLifecycleMethods(instance)

    lifecycleMethods.forEach(method => {
      this.server.ext(method, async (request, h) => {
        const response = await instance[method](request, h)

        if (h) {
          return response || h.continue
        }
      })
    })
  }
}

module.exports = RegisterLifecycleExtensions
