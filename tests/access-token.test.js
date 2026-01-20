import payload from '../src/payload'

describe.each([
  ['V1 API', payload, () => payload.Session(payload.apiKey, { apiVersion: 'v1' })],
  ['V2 API', payload, () => payload.Session(payload.apiKey, { apiVersion: 'v2' })],
])('Test Access Token (%s)', (version, _, getSession) => {
  let pl

  beforeAll(() => {
    pl = getSession()
  })

  test('create client token', async () => {
    const clientToken = await pl.ClientToken.create()

    expect(clientToken.status).toBe('active')
    expect(clientToken.type).toBe('client')
    expect(clientToken.environ).toBe('test')
  })
})

