import { expect, test } from '@playwright/test'
import { LoginDto } from '../dto/login-dto'
import { StatusCodes } from 'http-status-codes'
const baseURL = 'https://backend.tallinn-learning.ee/login/student'

test('login to a student with incorrect credentials', async ({ request }) => {
  const loginData = new LoginDto('string123', 'string123')
  // Send a POST request to the server
  const response = await request.post(baseURL, {
    data: loginData,
  })
  console.log('response status:', response.status())
  expect.soft(response.status()).toBe(StatusCodes.UNAUTHORIZED)
})

test('login to a student with correct credentials', async ({ request }) => {
  //const loginData = new LoginDto('testautomvl', 'whs4s5qbYbfT2n')
  const loginData = LoginDto.createLoginWithCorrectData()
  const response = await request.post(baseURL, {
    data: loginData,
  })
  const responseBody = await response.text()
  console.log('response text:', responseBody)
  console.log('response status:', response.status())
  expect.soft(response.status()).toBe(StatusCodes.OK)
  expect.soft(responseBody).toBeDefined()
})