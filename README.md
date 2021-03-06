<div align="center">
<img width="471" style="max-width:100%;" src="https://raw.githubusercontent.com/futurestudio/hapi-class-extension-points/master/media/hapi-class-extension-points.png" alt="hapi-class-extension-points logo">
  <br/>
  <br/>
  <p>
    Use class methods to add lifecycle extension points to your hapi server.
  </p>
  <br/>
  <p>
    <a href="#installation"><strong>Installation</strong></a> ·
    <a href="#usage"><strong>Usage</strong></a> ·
    <a href="#contributing"><strong>Contribute</strong></a>
  </p>
  <br/>
  <br/>
  <p>
    <a href="https://travis-ci.com/futurestudio/hapi-class-extension-points"><img src="https://travis-ci.com/futurestudio/hapi-class-extension-points.svg?branch=master" alt="Build Status" data-canonical-src="https://travis-ci.com/futurestudio/hapi-class-extension-points.svg?branch=master" style="max-width:100%;"></a>
    <a href="https://snyk.io/test/github/futurestudio/hapi-class-extension-points"><img src="https://snyk.io/test/github/futurestudio/hapi-class-extension-points/badge.svg" alt="Known Vulnerabilities" data-canonical-src="https://snyk.io/test/github/futurestudio/hapi-class-extension-points" style="max-width:100%;"></a>
    <a href="https://www.npmjs.com/package/hapi-class-extension-points"><img src="https://img.shields.io/npm/v/hapi-class-extension-points.svg" alt="hapi-class-extension-points Version" data-canonical-src="https://img.shields.io/npm/v/hapi-class-extension-points.svg" style="max-width:100%;"></a>
        <a href="https://www.npmjs.com/package/hapi-class-extension-points"><img src="https://img.shields.io/npm/dm/hapi-class-extension-points.svg" alt="Monthly downloads"></a>
  </p>
  <p>
    <em>Follow <a href="http://twitter.com/marcuspoehls">@marcuspoehls</a> for updates!</em>
  </p>
</div>

------

<p align="center"><sup>The <a href="https://futurestud.io">Future Studio University</a> supports development of this hapi plugin 🚀</sup>
<br><b>
Join the <a href="https://futurestud.io/university">Future Studio University and Skyrocket in Node.js</a></b>
</p>

------


## Introduction
This hapi plugin adds the `server.extClass(class)` decoration to register lifecycle extensions from class methods.


## Requirements
> **hapi v19 (or later)** and **Node.js v12 (or newer)**

This plugin requires **hapi v19** (or later) and **Node.js v12 or newer**.


### Compatibility
| Major Release | [hapi.js](https://github.com/hapijs/hapi) version | Node.js version |
| --- | --- | --- |
| `v2` | `>=17 hapi` | `>=12` |
| `v1` | `>=17 hapi` | `>=8` |


## Installation
Add `hapi-class-extension-points` as a dependency to your project:

```bash
npm i hapi-class-extension-points
```


## Usage
Register `hapi-class-extension-points` to your hapi server. This will decorate the hapi `server` with a `server.extClass()` method:

```js
await server.register({
  plugin: require('hapi-class-extension-points')
})

// went smooth like chocolate :)
// now your hapi server supports 'server.extClass(class MyMiddleware {})'
```

Having the plugin registered, you can now write your lifecycle extension points as classes:

```js
class RateLimiting {
  constructor (server) {
    this.server = server
  }

  async onRequest (request, h) {
    // rate limit the request

    await this.handle(request)

    return h.continue
  }

  async handle (request) {
    // this is a private method that won't be registered as a lifecycle extension
  }

  onPreResponse (request, h) {
    // add rate limiting headers

    return h.continue
  }
}

server.extClass(RateLimiting)
```

That's it! The constructor of your class receives the hapi server. You can then store it as a class property and use it when needed!

Enjoy!


## Links & Resources

- [hapi tutorial series](https://futurestud.io/tutorials/hapi-get-your-server-up-and-running) with 100+ tutorials


## Contributing

1.  Create a fork
2.  Create your feature branch: `git checkout -b my-feature`
3.  Commit your changes: `git commit -am 'Add some feature'`
4.  Push to the branch: `git push origin my-new-feature`
5.  Submit a pull request 🚀


## License

MIT © [Future Studio](https://futurestud.io)

---

> [futurestud.io](https://futurestud.io) &nbsp;&middot;&nbsp;
> GitHub [@futurestudio](https://github.com/futurestudio/) &nbsp;&middot;&nbsp;
> Twitter [@futurestud_io](https://twitter.com/futurestud_io)
