import { expect, test } from '@playwright/test'
import { LoginDto } from '../dto/login-dto'
import { StatusCodes } from 'http-status-codes'
const baseURL = 'https://backend.tallinn-learning.ee/login/student'

test('login to a student with incorrect credentials', async ({ request }) => {
  const loginData = LoginDto.createLoginWithIncorrectData()
  const response = await request.post(baseURL, {
    data: loginData,
  })
  console.log('response status:', response.status())
  expect.soft(response.status()).toBe(StatusCodes.UNAUTHORIZED)
})

test('login to a student with incorrect HTTP method', async ({ request }) => {
  const loginData = LoginDto.createLoginWithCorrectData()
  const response = await request.get(baseURL, {
    data: loginData,
  })
  const responseBody = await response.text()
  console.log('response text:', responseBody)
  console.log('response status:', response.status())
  expect.soft(response.status()).toBe(StatusCodes.METHOD_NOT_ALLOWED)
})

test('login to a student with incorrect body', async ({ request }) => {
  const response = await request.post(baseURL, {})
  const responseBody = await response.text()
  console.log('response text:', responseBody)
  console.log('response status:', response.status())
  expect.soft(response.status()).toBe(StatusCodes.BAD_REQUEST)
})

test('login to a student with correct credentials', async ({ request }) => {
  const loginData = LoginDto.createLoginWithCorrectData()
  const response = await request.post(baseURL, {
    data: loginData,
  })
  const jwt = await response.text()
  const jwtRegex = /^eyJhb[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/
  console.log('response text:', jwt)
  console.log('response status:', response.status())
  expect.soft(response.status()).toBe(StatusCodes.OK)
  expect.soft(jwt).toBeDefined()
  expect.soft(jwt).toMatch(jwtRegex)
})
