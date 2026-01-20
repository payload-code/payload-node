import payload from '../src/payload'
import Armrest from '@armrest/client'

describe('PayloadArmrest.Session', () => {
  describe('API Version Configuration', () => {
    test('does not set X-API-Version header when apiVersion not specified', () => {
      const session = payload.Session('test-key')
      expect(session.defaultHeaders['X-API-Version']).toBeUndefined()
    })

    describe('Valid API Version Formats', () => {
      test.each([
        ['v1'],
        ['v2'],
        ['v1.0'],
        ['v2.0'],
        ['v2.1'],
        ['v2.5'],
        ['v10'],
        ['v10.0'],
        ['v10.5'],
        ['v99'],
        ['v99.99'],
      ])('accepts valid format: %s', (version) => {
        const session = payload.Session('test-key', { apiVersion: version })
        expect(session.defaultHeaders['X-API-Version']).toBe(version)
      })
    })

    describe('Invalid API Version Formats', () => {
      test.each([
        ['2', 'missing v prefix'],
        ['version2', 'invalid prefix'],
        ['v', 'no version number'],
        ['v.', 'no version number after dot'],
        ['v2.', 'trailing dot'],
        ['.2', 'no v prefix, starts with dot'],
        ['v2.2.2', 'too many version parts'],
        ['v-2', 'invalid character'],
        ['v2.0.1', 'too many version parts'],
        ['V2', 'uppercase v'],
        ['v 2', 'space in version'],
        ['v2.0.0', 'too many version parts'],
        ['v2a', 'letter after number'],
        ['v2.0a', 'letter after minor version'],
      ])('rejects invalid format: %s (%s)', (version, description) => {
        const session = payload.Session('test-key', { apiVersion: version })
        expect(session.defaultHeaders['X-API-Version']).toBeUndefined()
      })
    })

    test('does not set header when apiVersion is null', () => {
      const session = payload.Session('test-key', { apiVersion: null })
      expect(session.defaultHeaders['X-API-Version']).toBeUndefined()
    })

    test('does not set header when apiVersion is undefined', () => {
      const session = payload.Session('test-key', { apiVersion: undefined })
      expect(session.defaultHeaders['X-API-Version']).toBeUndefined()
    })

    test('does not set header when apiVersion is a number', () => {
      const session = payload.Session('test-key', { apiVersion: 2 })
      expect(session.defaultHeaders['X-API-Version']).toBeUndefined()
    })

    test('does not set header when apiVersion is empty string', () => {
      const session = payload.Session('test-key', { apiVersion: '' })
      expect(session.defaultHeaders['X-API-Version']).toBeUndefined()
    })

    test('does not set header with empty options object', () => {
      const session = payload.Session('test-key', {})
      expect(session.defaultHeaders['X-API-Version']).toBeUndefined()
    })

    test('does not set header when options is null', () => {
      const session = payload.Session('test-key', null)
      expect(session.defaultHeaders['X-API-Version']).toBeUndefined()
    })

    test('ignores extra properties in options', () => {
      const session = payload.Session('test-key', {
        apiVersion: 'v2',
        someOtherProp: 'value',
      })
      expect(session.defaultHeaders['X-API-Version']).toBe('v2')
      expect(session.defaultHeaders).not.toHaveProperty('someOtherProp')
      expect(session).not.toHaveProperty('someOtherProp')
    })
  })

  describe('Integration with armrest-node', () => {
    test('calls super.Session with correct arguments', () => {
      const spy = jest.spyOn(Armrest.prototype, 'Session')
      const apiKey = 'test-key-123'
      const options = { apiVersion: 'v2' }

      payload.Session(apiKey, options)

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(apiKey, {
        defaultHeaders: {
          'X-API-Version': 'v2',
        },
      })

      spy.mockRestore()
    })

    test('session inherits correct API URL from PayloadArmrest instance', () => {
      const sessionV1 = payload.Session('test-key', { apiVersion: 'v1' })
      const sessionV2 = payload.Session('test-key', { apiVersion: 'v2' })

      // Both sessions should use the same API URL from the PayloadArmrest instance
      expect(sessionV1.apiUrl).toBe(payload.apiUrl)
      expect(sessionV2.apiUrl).toBe(payload.apiUrl)
      expect(sessionV1.apiUrl).toBe(sessionV2.apiUrl)
    })

    test('session API URL matches PayloadArmrest apiUrl property', () => {
      const originalApiUrl = payload.apiUrl
      const testApiUrl = 'https://test-api.example.com'

      // Temporarily set a different API URL
      payload.apiUrl = testApiUrl

      const session = payload.Session('test-key', { apiVersion: 'v2' })
      expect(session.apiUrl).toBe(testApiUrl)

      payload.apiUrl = originalApiUrl
    })

    test('session has correct apiKey', () => {
      const apiKey = 'my-secret-key'
      const session = payload.Session(apiKey, { apiVersion: 'v1' })
      expect(session.apiKey).toBe(apiKey)
    })

    test('sessions are isolated with different apiVersions', () => {
      const sessionV1 = payload.Session('test-key', { apiVersion: 'v1' })
      const sessionV2 = payload.Session('test-key', { apiVersion: 'v2' })

      expect(sessionV1.defaultHeaders['X-API-Version']).toBe('v1')
      expect(sessionV2.defaultHeaders['X-API-Version']).toBe('v2')
      expect(sessionV1).not.toBe(sessionV2)
    })
  })
})

