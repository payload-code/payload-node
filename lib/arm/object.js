var payload = require('../payload');
var utils = require('../utils')
var _object_index = {}

class ARMObject {

    constructor(obj) {
        if ( this.constructor.__spec__.polymorphic ) {
            var dup = utils.object_update({},
                    this.constructor.__spec__.polymorphic || {})
            obj = utils.object_update(dup, obj)
        }

        this._set_data(obj)

        return new Proxy(this, {
            get: function(target, key, receiver) {
                if (key == 'constructor')
                    return target.constructor
                if (key in target._data)
                    return target._data[key]
                return Reflect.get(target, key, receiver)
            }
        })
    }

    _set_data(data) {
        this._data = utils.data2object(data)
        if (this.id)
            _object_index[this.id] = this
    }

    data(self) {
        return utils.object2data(this._data)
    }

    json(self) {
        return JSON.stringify(this.data())
    }

    update(updates) {
        if ( !this.id )
            throw 'id cannot be empty'
        return new ARMRequest(this.constructor)
            ._request('put', {id: this.id, data: updates})
    }

    delete() {
        if ( !this.id )
            throw 'id cannot be empty'
        return new ARMRequest(this.constructor)
            ._request('delete',{id: this.id})
    }

}

ARMObject.get = function(id, update, params) {
    return new ARMRequest(this).get(id)
}

ARMObject.filter_by = function() {
    var args = Array.prototype.slice.call(arguments)
    var request = new ARMRequest(this)
    return request.filter_by.apply(request, args)
        .filter_by(this.__spec__.polymorphic || {})
}

ARMObject.create = function(obj) {
    return new ARMRequest(this).create(obj)
}

ARMObject.select = function() {
    var args = Array.prototype.slice.call(arguments)
    var request = new ARMRequest(this)
    return request.select.apply(request, args)
        .filter_by(this.__spec__.polymorphic || {})
}

ARMObject.update_all = function(objects) {
    return new ARMRequest(this).update(objects)
}

ARMObject.delete_all = function(objects) {
    return new ARMRequest(this).delete(objects)
}

module.exports = ARMObject

var ARMRequest = require('./request')
