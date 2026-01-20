import payload from '../src/payload'
import Armrest from '@armrest/client'

describe('PayloadArmrest.Session', () => {
  describe('API Version Configuration', () => {
    test('does not set X-API-Version header when apiVersion not specified', () => {
      const session = payload.Session('test-key')
      expect(session.defaultHeaders['X-API-Version']).toBeUndefined()
    })

    test('sets X-API-Version to 1 when explicitly set', () => {
      const session = payload.Session('test-key', { apiVersion: 1 })
      expect(session.defaultHeaders['X-API-Version']).toBe(1)
    })

    test('sets X-API-Version to 2 when explicitly set', () => {
      const session = payload.Session('test-key', { apiVersion: 2 })
      expect(session.defaultHeaders['X-API-Version']).toBe(2)
    })

    test('does not set header when apiVersion is null', () => {
      const session = payload.Session('test-key', { apiVersion: null })
      expect(session.defaultHeaders['X-API-Version']).toBeUndefined()
    })

    test('does not set header when apiVersion is undefined', () => {
      const session = payload.Session('test-key', { apiVersion: undefined })
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
        apiVersion: 2,
        someOtherProp: 'value',
      })
      expect(session.defaultHeaders['X-API-Version']).toBe(2)
      expect(session.defaultHeaders).not.toHaveProperty('someOtherProp')
      expect(session).not.toHaveProperty('someOtherProp')
    })
  })

  describe('Integration with armrest-node', () => {
    test('calls super.Session with correct arguments', () => {
      const spy = jest.spyOn(Armrest.prototype, 'Session')
      const apiKey = 'test-key-123'
      const options = { apiVersion: 2 }

      payload.Session(apiKey, options)

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(apiKey, {
        defaultHeaders: {
          'X-API-Version': 2,
        },
      })

      spy.mockRestore()
    })

    test('session inherits correct API URL from PayloadArmrest instance', () => {
      const sessionV1 = payload.Session('test-key', { apiVersion: 1 })
      const sessionV2 = payload.Session('test-key', { apiVersion: 2 })

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

      const session = payload.Session('test-key', { apiVersion: 2 })
      expect(session.apiUrl).toBe(testApiUrl)

      payload.apiUrl = originalApiUrl
    })

    test('session has correct apiKey', () => {
      const apiKey = 'my-secret-key'
      const session = payload.Session(apiKey, { apiVersion: 1 })
      expect(session.apiKey).toBe(apiKey)
    })

    test('sessions are isolated with different apiVersions', () => {
      const sessionV1 = payload.Session('test-key', { apiVersion: 1 })
      const sessionV2 = payload.Session('test-key', { apiVersion: 2 })

      expect(sessionV1.defaultHeaders['X-API-Version']).toBe(1)
      expect(sessionV2.defaultHeaders['X-API-Version']).toBe(2)
      expect(sessionV1).not.toBe(sessionV2)
    })
  })
})

