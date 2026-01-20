import Armrest from '@armrest/client'
import * as objects from './objects'
import * as exceptions from './exceptions'

const URL = 'https://api.payload.com'
const API_VERSION_PATTERN = /^v\d+(?:\.\d+)?$/

class PayloadArmrest extends Armrest {
  Session(apiKey, options = {}) {
    const opts = options ?? {}
    const defaultHeaders = {}

    if (
      typeof opts.apiVersion === 'string' &&
      API_VERSION_PATTERN.test(opts.apiVersion)
    )
      defaultHeaders['X-API-Version'] = opts.apiVersion

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
