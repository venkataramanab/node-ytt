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
