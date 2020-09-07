var _url = 'https://api.payload.co';

var payload = {
    URL: _url,
    api_url: _url,
    api_key: null
}

module.exports = payload;
module.exports.default = payload;

var objects = require('./objects')
var ARMRequest = require('./arm/request')
var ARMObject = require('./arm/object')
var Attr = require('./arm/attr')
var utils = require('./utils')
var exceptions = require('./exceptions')

utils.object_update( payload, objects )
utils.object_update( payload, exceptions )

payload.attr = new Attr()

payload.create = function() {
    var req = new ARMRequest()
    return req.create.apply( req, arguments )
}

payload.update = function() {
    var req = new ARMRequest()
    return req.update.apply( req, arguments )
}

payload.delete = function() {
    var req = new ARMRequest()
    return req.delete.apply( req, arguments )
}

payload.objects = objects
payload.ARMObject = ARMObject
