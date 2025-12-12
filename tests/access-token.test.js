import payload from '../src/payload'

describe('Test Access Token', () => {
  test('create client token', async () => {
    const clientToken = await payload.ClientToken.create()

    expect(clientToken.status).toBe('active')
    expect(clientToken.type).toBe('client')
    expect(clientToken.environ).toBe('test')
  })
})

