import { expect, test } from '@playwright/test'
import { LoginDto } from './dto/login-dto'
import { OrderDto } from './dto/order-dto'
import { StatusCodes } from 'http-status-codes'

const loginURL = 'https://backend.tallinn-learning.ee/login/student'
const orderURL = 'https://backend.tallinn-learning.ee/orders'

let jwt: string
let orderId: number

test.describe.configure({ mode: 'serial' })
test.describe('API authorization', () => {
  test.beforeAll(async ({ request }) => {
    const loginData = LoginDto.createLoginWithCorrectData()
    const responseLoginBody = await request.post(loginURL, {
      data: loginData,
    })
    const jwt = await responseLoginBody.text()
    expect.soft(jwt).toBeDefined()
  })
  test('student uses token and then creates an order', async ({ request }) => {
    const requestOrderBody = new OrderDto('OPEN', 0, 'My Name', '5544334', 'No comment', 0)
    const response = await request.post(orderURL, {
      data: requestOrderBody,
      headers: {
        authorization: 'Bearer' + jwt,
      },
    })
    const responseBody = await response.json()
    expect.soft(response.status()).toBe(StatusCodes.OK)
    expect.soft(responseBody.status).toBe('OPEN')
    expect.soft(responseBody.customerName).toBe('My Name')
    expect.soft(responseBody.id).toBeDefined()
    const orderId = await responseBody.id
    console.log('Order ID is ', orderId)
  })

  test('student uses token and then searches for order', async ({ request }) => {
    const getResponse = await request.get(`${orderURL}/${orderId}`, {
      headers: {
        authorization: 'Bearer' + jwt,
      },
    })
    const getResponseJson = await getResponse.json()
    expect.soft(getResponse.status()).toBe(StatusCodes.OK)
    expect.soft(getResponseJson.id).toBeDefined()
  })

  test('student uses token and then deletes an order', async ({ request }) => {
    const deleteResponse = await request.delete(`${orderURL}/${orderId}`, {
      headers: {
        authorization: 'Bearer' + jwt,
      },
    })
    const deleteResponseText = await deleteResponse.text()
    expect.soft(deleteResponse.status()).toBe(StatusCodes.OK)
    expect.soft(deleteResponseText).toBeTruthy()
  })
})
