import payload from '../src/payload'
import Armrest from '@armrest/client'

describe('PayloadArmrest.Session', () => {
  describe('API Version Configuration', () => {
    test('defaults to API v1 when apiVersion not specified', () => {
      const session = payload.Session('test-key')
      expect(session.defaultHeaders['X-API-Version']).toBe(1)
    })

    test('sets X-API-Version to 1 when explicitly set', () => {
      const session = payload.Session('test-key', { apiVersion: 1 })
      expect(session.defaultHeaders['X-API-Version']).toBe(1)
    })

    test('sets X-API-Version to 2 when explicitly set', () => {
      const session = payload.Session('test-key', { apiVersion: 2 })
      expect(session.defaultHeaders['X-API-Version']).toBe(2)
    })

    test('uses default when apiVersion is null', () => {
      const session = payload.Session('test-key', { apiVersion: null })
      expect(session.defaultHeaders['X-API-Version']).toBe(1)
    })

    test('uses default when apiVersion is undefined', () => {
      const session = payload.Session('test-key', { apiVersion: undefined })
      expect(session.defaultHeaders['X-API-Version']).toBe(1)
    })

    test('handles empty options object', () => {
      const session = payload.Session('test-key', {})
      expect(session.defaultHeaders['X-API-Version']).toBe(1)
    })

    test('handles null options gracefully', () => {
      const session = payload.Session('test-key', null)
      expect(session.defaultHeaders['X-API-Version']).toBe(1)
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
        apiUrl: `${payload.apiUrl}/v2`,
        defaultHeaders: {
          'X-API-Version': 2,
        },
      })

      spy.mockRestore()
    })

    test('always uses Payload API URL', () => {
      const session = payload.Session('test-key', { apiVersion: 1 })
      expect(session.apiUrl).toBe(payload.apiUrl)
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

