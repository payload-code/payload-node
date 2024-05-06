import Armrest from '@armrest/client'
import * as objects from './objects'
import * as exceptions from './exceptions'

const URL = 'https://api.payload.com'

const payload = new Armrest(URL).register(objects).register(exceptions)

export default payload
