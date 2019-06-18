'use strict'

class RequestLogger {
  constructor (server) {
    this.server = server
  }

  onRequest (request, h) {
    console.log(`incoming request for URI path: ${request.path}`)

    return h.continue
  }

  onPreResponse (request, h) {
    return this.handleResponse(request, h)
  }

  handleResponse (request, h) {
    console.log(`response status code: ${request.response.output.statusCode}`)

    return h.continue
  }
}

module.exports = RequestLogger
