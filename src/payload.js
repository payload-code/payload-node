import Armrest from '@armrest/client'
import * as objects from './objects'
import * as exceptions from './exceptions'

const URL = 'https://api.payload.com'

class PayloadArmrest extends Armrest {
  Session(apiKey, options = {}) {
    const opts = options ?? {}
    const defaultHeaders = {}

    if (opts.apiVersion) defaultHeaders['X-API-Version'] = opts.apiVersion

    const session = super.Session(apiKey, {
      defaultHeaders,
    })

    return session
  }
}

const payload = new PayloadArmrest(URL)
payload.register(objects)
payload.register(exceptions)

export default payload
