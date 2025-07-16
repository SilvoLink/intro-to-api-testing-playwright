import { expect, test } from '@playwright/test'
import { LoginDto } from './dto/login-dto'
import { OrderDto } from './dto/order-dto'
import { StatusCodes } from 'http-status-codes'

let jwt: string
let orderId: number

const loginURL = 'https://backend.tallinn-learning.ee/login/student'
const orderURL = 'https://backend.tallinn-learning.ee/orders'

test.describe.configure({ mode: 'serial' })
test('student authenticates and then creates an order', async ({ request }) => {
  const loginData = LoginDto.createLoginWithCorrectData()
  const loginResponse = await request.post(loginURL, {
    data: loginData,
  })
  jwt = await loginResponse.text()
  expect.soft(jwt).toBeDefined()
  const orderRequest = new OrderDto('OPEN', 0, 'My Name', '5544334', 'No comment')
  const orderResponse = await request.post(orderURL, {
    data: orderRequest,
    headers: {
      authorization: `Bearer ${jwt}`,
    },
  })
  const responseBody = await orderResponse.json()
  expect.soft(orderResponse.status()).toBe(StatusCodes.OK)
  expect.soft(responseBody.status).toBe('OPEN')
  expect.soft(responseBody.customerName).toBe('My Name')
  expect.soft(responseBody.id).toBeDefined()
  orderId = await responseBody.id
})

test('student uses token and searches for the order', async ({ request }) => {
  const getResponse = await request.get(`${orderURL}/${orderId}`, {
    headers: {
      authorization: `Bearer ${jwt}`,
    },
  })
  const getResponseJson = await getResponse.json()
  expect.soft(getResponse.status()).toBe(StatusCodes.OK)
  expect.soft(getResponseJson.id).toBeDefined()
})

test('student uses token and deletes the order', async ({ request }) => {
  const deleteResponse = await request.delete(`${orderURL}/${orderId}`, {
    headers: {
      authorization: `Bearer ${jwt}`,
    },
  })
  const deleteResponseText = await deleteResponse.text()
  expect.soft(deleteResponse.status()).toBe(StatusCodes.OK)
  expect.soft(deleteResponseText).toBeTruthy()
})
