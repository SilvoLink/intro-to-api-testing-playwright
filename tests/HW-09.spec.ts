import { expect, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'

test('correct api key should receive code 200', async ({ request }) => {
  // prepare request body
  const requestBody = {
    status: 'OPEN',
    courierId: 0,
    customerName: 'string',
    customerPhone: 'string',
    comment: 'string',
    id: 0,
  }

  const requestHeaders = {
    api_key: '1234567898765432',
  }
  // Send a PUT request to the server
  const response = await request.put('https://backend.tallinn-learning.ee/test-orders/1', {
    data: requestBody,
    headers: requestHeaders,
  })
  // Log the response status and body
  console.log('response status:', response.status())
  console.log('response body:', await response.json())
  expect(response.status()).toBe(StatusCodes.OK)
})

test('incorrect api key should receive code 401', async ({ request }) => {
  // prepare request body
  const requestBody = {
    status: 'OPEN',
    courierId: 0,
    customerName: 'string',
    customerPhone: 'string',
    comment: 'string',
    id: 0,
  }

  const requestHeaders = {
    api_key: '112233',
  }
  // Send a PUT request to the server
  const response = await request.put('https://backend.tallinn-learning.ee/test-orders/1', {
    data: requestBody,
    headers: requestHeaders,
  })
  // Log the response status and body
  console.log('response status:', response.status())
  console.log('response body:', await response.text())
  expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
})

test('delete order with correct ID should receive code 204', async ({ request }) => {
  const requestHeaders = {
    api_key: '1234567898765432',
  }
  // Send a DELETE request to the server
  const response = await request.delete('https://backend.tallinn-learning.ee/test-orders/1', {
    headers: requestHeaders,
  })
  // Log the response status and body
  console.log('response status:', response.status())
  expect(response.status()).toBe(StatusCodes.NO_CONTENT)
})

test('delete order with incorrect ID should receive code 400', async ({ request }) => {
  const requestHeaders = {
    api_key: '1234567898765432',
  }
  // Send a DELETE request to the server
  const response = await request.delete('https://backend.tallinn-learning.ee/test-orders/0', {
    headers: requestHeaders,
  })
  // Log the response status and body
  console.log('response status:', response.status())
  expect(response.status()).toBe(StatusCodes.BAD_REQUEST)
})

test('authenticated user should receive code 200', async ({ request }) => {
  // Send a GET request to the server
  const response = await request.get(
    'https://backend.tallinn-learning.ee/test-orders?username=My Name&password=12qw34er56ty',
  )
  // Log the response status and body
  console.log('response body:', await response.json())
  expect(response.status()).toBe(StatusCodes.OK)
})

test('authenticated user with empty password should receive code 500', async ({ request }) => {
  // Send a GET request to the server
  const response = await request.get(
    'https://backend.tallinn-learning.ee/test-orders?username=My Name&password=',
  )
  // Log the response status and body
  console.log('response body:', await response.json())
  expect(response.status()).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
})
