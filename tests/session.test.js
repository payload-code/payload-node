import payload from '../src/payload'
import Armrest from '@armrest/client'

describe('PayloadArmrest.Session', () => {
  describe('API Version Configuration', () => {
    test('does not set X-API-Version header when apiVersion not specified', () => {
      const session = payload.Session('test-key')
      expect(session.defaultHeaders['X-API-Version']).toBeUndefined()
    })

    describe('Falsy values (should not set header)', () => {
      test.each([
        [null, 'null'],
        [undefined, 'undefined'],
        ['', 'empty string'],
        [0, 'zero'],
        [false, 'false'],
      ])('does not set header when apiVersion is %s', (value, description) => {
        const session = payload.Session('test-key', { apiVersion: value })
        expect(session.defaultHeaders['X-API-Version']).toBeUndefined()
      })
    })

    describe('Values passed through (backend will throw error if invalid format)', () => {
      test.each([
        ['v1', 'valid string format'],
        ['v2', 'valid string format'],
        ['v2.0', 'valid string format with minor version'],
        ['v2.1-beta', 'valid string format with minor version and suffix'],
        [2, 'number'],
        [1, 'number'],
        ['invalid', 'invalid string format'],
        ['2', 'numeric string without v prefix'],
      ])('passes through apiVersion: %s (%s)', (value, description) => {
        const session = payload.Session('test-key', { apiVersion: value })
        expect(session.defaultHeaders['X-API-Version']).toBe(value)
      })
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

