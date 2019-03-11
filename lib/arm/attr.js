
class Attr {
    constructor(param, parent) {
        var self = this
        self.param = param
        self.parent = parent
        self.is_method = false

        if ( !self.parent || !self.parent.key )
            self.key = self.param
        else
            self.key = self.parent.key + '[' + self.param + ']'

        var proxy = new Proxy(function() {
            self.is_method = true
            return self
        }, {
            get: function(target, key, receiver) {
                if (key == 'constructor')
                    return self.constructor
                if (key in self)
                    return self[key]
                if (typeof key == 'string')
                    return new Attr(key, self)
                return Reflect.get(target, key, receiver);
            }
        })

        return proxy
    }

    toString() {
        if ( this.is_method )
            return this.param + '(' + this.parent.key + ')'
        return this.key
    }

    eq(val) {
        var ret = {}
        ret[String(this)] = val
        return ret
    }

    ne(val) {
        return this.eq('!'+val)
    }

    lt(val) {
        return this.eq('<'+val)
    }

    le(val) {
        return this.eq('<='+val)
    }

    gt(val) {
        return this.eq('>'+val)
    }

    ge(val) {
        return this.eq('>='+val)
    }

    contains(val) {
        return this.eq('?*'+val+'*')
    }
}

module.exports = Attr
