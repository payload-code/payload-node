import Armrest from '@armrest/client'
import * as objects from './objects'
import * as exceptions from './exceptions'

const URL = 'https://api.payload.com'
const DEFAULT_API_VERSION = 1

class PayloadArmrest extends Armrest {
  Session(apiKey, options = {}) {
    const opts = options ?? {}
    const apiVersion = opts.apiVersion ?? DEFAULT_API_VERSION

    const defaultHeaders = {
      'X-API-Version': apiVersion,
    }

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
