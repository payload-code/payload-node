var payload = require('../payload');
var ARMObject = require('./object');
var exc = require('../exceptions');
var utils = require('../utils');
var axios = require('axios');
var Buffer = require('buffer').Buffer

class ARMRequest {
    constructor(object, opts){
        this.object = object
        this._filters  = {}
        this._fields   = []
        this._group_by = []
        this._opts = opts||{}
    }

    _request(method, params) {
        var self = this
        params = params || {}

        if ( params.path )
            var path = params.path
        else if ( self.object.__spec__.endpoint )
            var path = self.object.__spec__.endpoint
        else
            var path = '/'+self.object.__spec__.object+'s'

        var url = payload.api_url + path
        var headers = {}

        if (params.id)
            url += '/' + params.id

        params.params = params.params || {}
        for ( var k in self._filters ) {
            if ( !(k in params.params) )
                params.params[k] = self._filters[k]
        }

        if ( self._fields.length ) {
            utils.object_update( params.params, utils.nested_qstring_keys(
                {'fields': self._fields.map(String)}) )
        }

        if ( self._group_by.length ) {
            utils.object_update( params.params, utils.nested_qstring_keys(
                {'group_by': self._group_by.map(String)}) )
        }

        if ( self.object.default_params ) {
            var default_params = utils.nested_qstring_keys(
                self.object.default_params)
            for ( var key in default_params )
                if ( !(key in params.params) )
                    params.params[key] = self.object.default_params[key]
        }

        if ( params.data ) {
            if ( this.object.__spec__.field_map )
                utils.map_fields( this.object.__spec__.polymorphic.type,
                    this.object.__spec__.field_map, params.data)
        }

        if ( typeof window !== 'undefined' && params.data ) {
            var found_file = false
            var form_data = new FormData()

            var _data = utils.nested_qstring_keys(utils.clone(params.data))
            for ( var k in _data ) {
                var v = _data[k]
                if ( !found_file && v )
                    found_file = v.constructor == File
                form_data.append(k, v)
            }

            if ( found_file ) {
                params.data = form_data
                headers['Content-Type'] = 'multipart/form-data'
            }
        }

        if ( payload.api_key || payload.auth_pass ) {
            if ( payload.api_key
            && payload.api_key.includes('secret_key')
            && typeof window !== 'undefined')
                throw '[Payload] Cannot use secret key in the browser, switch to the client key.'
            headers['Authorization'] = 'Basic '+
                Buffer.from((payload.api_key||'')+':'+(payload.auth_pass||''), 'binary')
                    .toString('base64')
        }

        return new Promise(function(resolve, reject) {
            return axios({
                method: method,
                url: url,
                params: params.params,
                data: params.data,
                headers: utils.object_update(headers, self.constructor.default_headers || {} ),
                validateStatus: false
            }).then(function(response) {
                try {
                    var http_code = response.status

                    var obj = response.data;
                    if ( typeof obj != 'object' ) {
                        if (http_code == 500)
                            throw new exc.InternalServerError()
                        else
                            throw new exc.UnknownResponse()
                    }

                    if (!obj.object)
                        throw new exc.UnknownResponse(
                            'Response missing "object" attribute')

                    if (http_code == 200) {
                        if (obj.object == 'list')
                            resolve(obj.values.map(function(o) {
                                var object = utils.get_object_cls(o)
                                if (object)
                                    return new object(o)
                                else
                                    return o
                            }))
                        else {
                            var object = utils.get_object_cls(obj)
                            if (object)
                                obj = new object(obj)
                            resolve(obj)
                        }
                    } else {
                        for (var error in exc) {
                            if (exc[error].http_code != http_code)
                                continue;
                            if (exc[error].name && exc[error].name != obj.error_type)
                                continue;
                            throw new exc[error](obj.error_description, obj)
                        }

                        throw new exc.PayloadError(obj.error_description, obj)
                    }

                } catch (e) {
                    reject(e)
                }
            })
        })
    }

    create(obj) {
        var self = this

        if ( Array.isArray(obj) ) {
            if ( !obj.length )
                throw 'List must not be empty'

            obj = obj.map(function(o) {
                if ( !self.object || o instanceof ARMObject ) {
                    if ( !(o instanceof ARMObject) )
                        throw 'Bulk create requires ARMObject object types'
                    if ( !self.object )
                        self.object = o.constructor
                    else if ( !(o instanceof self.object ) )
                        throw 'Bulk create requires all objects to be of the same type'
                    o = o.data()
                }
                return utils.object_update(utils.object_update({}, self.object.__spec__.polymorphic || {}), o)
            })

            obj = { 'object': 'list',  'values': obj }
        } else if ( !self.object ) {
            if ( !(obj instanceof ARMObject) )
                throw 'Bulk create requires ARMObject object types'
            self.object = obj.constructor
        } else {
            obj = utils.object_update(utils.object_update({}, self.object.__spec__.polymorphic || {}), obj)
        }

        obj = utils.object2data(obj)
        return this._request('post', {
            data: obj
        })
    }

    update(obj) {
        var self = this

        if ( Array.isArray(obj) ) {
            if ( !obj.length )
                throw 'List must not be empty'

            obj = obj.map(function(o) {
                var upd = o[1]
                o = o[0]
                if ( !self.object || o instanceof ARMObject ) {
                    if ( !(o instanceof ARMObject) )
                        throw 'Bulk create requires ARMObject object types'
                    if ( !self.object )
                        self.object = o.constructor
                    else if ( !(o instanceof self.object ) )
                        throw 'Bulk create requires all objects to be of the same type'
                }
                if ( !o.id )
                    throw "id cannot be empty"
                return utils.object_update({id: o.id}, upd)
            })

            return this._request('put', {data: {"object": "list", "values": obj}})
        }

        return this._request('put', {
            params: { mode: 'query' },
            data: obj
        })
    }

    delete(objects) {
        var self = this

        if ( Array.isArray(objects) ) {
            if ( !objects.length )
                throw 'List must not be empty'

            var id_filter = objects.map(function(o) {
                if ( !self.object || o instanceof ARMObject ) {
                    if ( !(o instanceof ARMObject) )
                        throw 'Bulk delete requires ARMObject object types'
                    if ( !self.object )
                        self.object = o.constructor
                    else if ( !(o instanceof self.object ) )
                        throw 'Bulk delete requires all objects to be of the same type'
                }
                if ( !o.id )
                    throw "id cannot be empty"
                return o.id
            }).join('|')

            return this._request('delete',
                { params: { id: id_filter, mode: 'query' } })
        } else if (objects instanceof ARMObject) {
            this.object = objects.constructor
            return this._request('delete',{ id: objects.id })
        } else if ( objects === undefined && this.object && Object.keys(this._filters).length )
            return this._request('delete',{ params: { mode: 'query' } })
        else
            throw 'Bulk delete requires ARMObject object types'
    }

    select() {
        var args = Array.prototype.slice.call(arguments);
        this._fields = this._fields.concat(args)
        return this
    }

    get(id) {
        if ( !id )
            throw "id cannot be empty"
        return this._request('get', {
            id: id,
        })
    }

    group_by() {
        var args = Array.prototype.slice.call(arguments);
        this._group_by = this._group_by.concat(args)
        return this
    }

    filter_by() {
        var args = Array.prototype.slice.call(arguments)
        var filters = this._filters
        args.map(f=>utils.object_update(filters,f))
        return this
    }

    all() {
        return this._request('get')
    }

    then() {
        var request = this._request('get')
        return request.then.apply(request, arguments)
    }

}

module.exports = ARMRequest
