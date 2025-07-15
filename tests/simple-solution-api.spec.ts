import { expect, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { OrderDto } from './dto/order-dto'
import { LoginDto } from './dto/login-dto'
const baseURL = 'https://backend.tallinn-learning.ee/test-orders'
const loginURL = 'https://backend.tallinn-learning.ee/login/student'
const orderURL = 'https://backend.tallinn-learning.ee/orders'

test('get order with correct id should receive code 200', async ({ request }) => {
  // Build and send a GET request to the server
  const response = await request.get(baseURL + '/1')
  // Log the response status, body and headers
  console.log('response body:', await response.json())
  console.log('response headers:', response.headers())
  // Check if the response status is 200
  expect(response.status()).toBe(200)
})

test('get order with incorrect status should receive code 400', async ({ request }) => {
  // Build and send a GET request to the server
  const response = await request.get(baseURL + '/11')
  // Log the response status, body and headers
  console.log('response body:', await response.json())
  console.log('response headers:', response.headers())
  // Check if the response status is 400
  expect(response.status()).toBe(400)
})

test('student receive token and then create an order', async ({ request }) => {
  const loginData = LoginDto.createLoginWithCorrectData()
  const responseLoginBody = await request.post(loginURL, {
    data: loginData,
  })
  const jwt = await responseLoginBody.text()

  const requestOrderBody = new OrderDto('OPEN', 0, 'My Name', '5544334', 'No comment', 0)
  // Send a POST request to the server
  const response = await request.post(orderURL, {
    data: requestOrderBody,
    headers: {
      authorization: 'Bearer ' + jwt,
    },
  })
  // Log the response status and body
  const responseBody = await response.json()
  expect.soft(response.status()).toBe(StatusCodes.OK)
  //let's do some assertions to response body
  expect.soft(responseBody.status).toBe('OPEN')
  expect.soft(responseBody.customerName).toBe('My Name')
  expect.soft(responseBody.id).toBeDefined()

  const orderId = responseBody.id

  const getResponse = await request.get(`${orderURL}/${orderId}`, {
    headers: {
      authorization: 'Bearer ' + jwt,
    },
  })
  const getResponseJson = await getResponse.json()
  expect.soft(getResponse.status()).toBe(StatusCodes.OK)
  expect.soft(getResponseJson.id).toBeDefined()

  const deleteResponse = await request.delete(`${orderURL}/${orderId}`, {
    headers: {
      authorization: 'Bearer ' + jwt,
    },
  })
  const deleteResponseText = await deleteResponse.text()
  expect.soft(deleteResponse.status()).toBe(StatusCodes.OK)
  expect.soft(deleteResponseText).toBeTruthy()
})

test('post order with incorrect payload should receive code 400', async ({ request }) => {
  const requestBody = new OrderDto('BLOCKED', 0, 'My Name', '5245587', 'No comment', 0)
  // Send a POST request to the server
  const response = await request.post(baseURL, {
    data: requestBody,
  })
  // Log the response status and body
  console.log('response status:', response.status())
  console.log('response body:', await response.text())
  expect(response.status()).toBe(StatusCodes.BAD_REQUEST)
})
