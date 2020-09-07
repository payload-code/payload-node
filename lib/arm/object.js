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

        if (obj && obj.id && (obj.id in _object_index)) {
            var inst = _object_index[obj.id]
            inst._set_data(obj)
            return inst
        }

        // if using polyfill, all properties must be known before initializing
        this._proxy = null
        this._data = null

        this._proxy = new Proxy(this, {
            get: function(target, key, receiver) {
                if (key == 'constructor')
                    return target.constructor

                if ((target.constructor.__spec__.field_map||[]).indexOf(key) != -1) {
                    var type = target.constructor.__spec__.polymorphic.type
                    return target._data[type][key]
                }

                if (key in target._data)
                    return target._data[key]

                return Reflect.get(target, key, receiver)
            }
        })

        this._set_data(obj)

        return this._proxy
    }

    _set_data(data) {
        this._data = utils.data2object(data)
        if (this._data.id) {
            _object_index[this._data.id] = this._proxy
        }

        if ( this.constructor.__spec__.field_map )
            utils.map_fields( this.constructor.__spec__.polymorphic.type,
                this.constructor.__spec__.field_map, this._data)
    }

    data() {
        return utils.object2data(this._data)
    }

    json() {
        return JSON.stringify(this.data())
    }

    update(updates, opts) {
        if ( !this.id )
            throw 'id cannot be empty'
        return new ARMRequest(this.constructor, opts)
            ._request('put', {id: this.id, data: updates})
    }

    delete() {
        if ( !this.id )
            throw 'id cannot be empty'
        return new ARMRequest(this.constructor)
            ._request('delete',{id: this.id})
    }

}

ARMObject.get = function(id) {
    return new ARMRequest(this).get(id)
}

ARMObject.filter_by = function() {
    var args = Array.prototype.slice.call(arguments)
    var request = new ARMRequest(this)
    return request.filter_by.apply(request, args)
        .filter_by(this.__spec__.polymorphic || {})
}

ARMObject.create = function(obj, opts) {
    return new ARMRequest(this, opts).create(obj)
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
