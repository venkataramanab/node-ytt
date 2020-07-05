<div align="center">
  <p>
    <a href="https://www.npmjs.com/package/node-ytt"><img src="https://img.shields.io/npm/v/node-ytt.svg?maxAge=3600" alt="NPM version" /></a>
    <a href="https://www.npmjs.com/package/ytsr"><img src="https://img.shields.io/npm/dt/node-ytt.svg?maxAge=3600" alt="NPM downloads" /></a>
    <a href="https://david-dm.org/"><img src="https://img.shields.io/david/venkataramanab/node-ytt.svg?maxAge=3600" alt="Dependencies" /></a>
    <a href="https://greenkeeper.io/"><img src="https://badges.greenkeeper.io/venkataramanab/node-ytt.svg" alt="Dependencies" /></a>
  </p>
  <p>
    <a href="https://nodei.co/npm/node-ytt/"><img src="https://nodei.co/npm/node-ytt.png?downloads=true&stars=true" alt="NPM info" /></a>
  </p>
</div>

# node-ytt

Simple module to get YouTube trending videos.
No need of GoogleAPI key.

# Usage

```js
const ytt = require('node-ytt');

ytt((response) => {
    if(response instanceof Error)
        throw response
    console.log(response)
})
```


# API
### ytt(callback)

Fetches latest YouTube trending videos from US origin. 

* `callback(result)`
    * function
    * fires on request completion
    * result can be error or videos response

# Related / Works well with

* [node-ytdl-core](https://github.com/fent/node-ytdl-core)
* [node-ytsr](https://github.com/TimeForANinja/node-ytsr)
* [node-ytpl](https://github.com/TimeForANinja/node-ytpl)


# Install

    npm install --save node-ytt

# License
MIT
