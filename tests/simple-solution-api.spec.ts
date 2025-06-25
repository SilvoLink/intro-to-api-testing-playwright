import { expect, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { OrderDto } from './dto/order-dto'
const baseURL = 'https://backend.tallinn-learning.ee/test-orders'

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

test('post order with correct data should receive code 200', async ({ request }) => {
  const requestBody = new OrderDto('OPEN', 0, 'My Name', '5245587', 'No comment', 0)
  // Send a POST request to the server
  const response = await request.post(baseURL, {
    data: requestBody,
  })
  // Log the response status and body
  console.log('response status:', response.status())
  console.log('response body:', await response.json())
  const responseBody = await response.json()
  expect(response.status()).toBe(StatusCodes.OK)
  //let's do some assertions to response body
  expect(responseBody.status).toBe('OPEN')
  expect(responseBody.customerName).toBe('My Name')
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
