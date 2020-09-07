
function _matches( obj, obj2 ){
    var found = 0
    for ( var k in obj )
        found += (obj[k] == obj2[k]) || -found
    return found != 0
}

function get_object_cls(obj) {
    var cls = null
    var objects = require('./objects')
    for (var clsname in objects) {
        var object = objects[clsname]
        if (obj['object'] != object.__spec__.object)
            continue
        if ( cls == null || _matches( object.__spec__.polymorphic || {}, obj ) )
            cls = object
    }
    return cls
}

function data2object(item) {
    var objects = require('./objects')
    var recurse = function recurse(item) {
        if ( Array.isArray( item ) )
            var _iter = item
        else if ( Object.values(objects).includes(item.constructor) )
            var _iter = Object.keys( item._data )
        else
            var _iter = Object.keys( item )

        for (var i=0; i<_iter.length; i++) {
            var key = Array.isArray( item )?i:_iter[i]
            var val = item[key]
            if ( val && typeof val == 'object' )
                item[key] = recurse(val)
            if ( val && typeof val == 'object' && val.object && !Object.values(objects).includes(val.constructor) ) {
                var object = get_object_cls(val)
                if ( object )
                    item[key] = new object(val)
            }
        }

        return item
    }

    return recurse(item)
}

function object2data(item) {
    var recurse = function recurse(item) {
        if ( Array.isArray( item ) )
            var _iter = item
        else
            var _iter = Object.keys( item )

        for (var i=0; i<_iter.length; i++) {
            var key = Array.isArray( item )?i:_iter[i]
            var val = item[key]

            if ( val && typeof val.data == 'function' )
                item[key] = val.data()
            else if ( val && typeof val == 'object' )
                item[key] = recurse(val)
        }

        return item
    }

    return recurse(item)

}

function nested_qstring_keys( obj ) {
    var collapseKey = function( obj, keylist, cur_obj ) {
        if ( cur_obj === undefined ) return
        if ( cur_obj.constructor == Array ) {
            var keys = {}
            for ( var i = 0; i < cur_obj.length; i++ )
                keys[i] = null
        }
        else
            var keys = cur_obj

        for ( var key in keys ) {
            if (cur_obj[key] === undefined) continue
            if ((cur_obj[key] === null)
            ||  (cur_obj[key].constructor != Object
            &&   cur_obj[key].constructor != Array )) {
                var new_key = keylist[0]
                new_key += '[' + keylist.slice(1).concat( key ).join('][')+']'
                obj[new_key] = cur_obj[key]
                continue
            }

            collapseKey( obj, keylist.concat( key ), cur_obj[key] )
        }
    }

    for ( var key in obj ) {
        if ( obj[key] === null ) continue

        if ( obj[key] !== undefined
        &&   obj[key].constructor != Object
        &&   obj[key].constructor != Array  )
            continue

        collapseKey( obj, [key], obj[key] )
        delete obj[key]

    }

    return obj
}

function object_update( obj1, obj2 ) {
    for ( var k in obj2 )
        obj1[k] = obj2[k]
    return obj1
}

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

function map_fields(nested, fields, obj) {
    fields.forEach(function(key) {
        if ( obj[key] === undefined ) return
        if ( !obj[nested] )
            obj[nested] = {}
        obj[nested][key] = obj[key]
        delete obj[key]
    }.bind(this))
}

module.exports = {
    get_object_cls: get_object_cls,
    nested_qstring_keys: nested_qstring_keys,
    object_update: object_update,
    data2object: data2object,
    object2data: object2data,
    clone: clone,
    map_fields: map_fields
}
