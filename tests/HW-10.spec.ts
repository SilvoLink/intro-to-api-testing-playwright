import { test, expect } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { riskCalculationsDto } from './dto/riskCalculations-dto'
const baseURL = 'https://backend.tallinn-learning.ee/api/loan-calc/decision'

test('loan application with correct income should receive 200', async ({ request }) => {
  const requestBody = new riskCalculationsDto(1000, 0, 17, true, 500, 6)
  const response = await request.post(baseURL, {
    data: requestBody,
  })
  expect(response.status()).toBe(StatusCodes.OK)
  const responseBody = await response.json()
  console.log(responseBody)
  expect.soft(responseBody.riskLevel).toBe('Medium Risk')
  expect.soft(responseBody.riskDecision).toBe('positive')
})

test('loan application with incorrect income should receive 400', async ({ request }) => {
  const requestBody = new riskCalculationsDto(-1, 0, 17, true, 500, 6)
  const response = await request.post(baseURL, {
    data: requestBody,
  })
  expect(response.status()).toBe(StatusCodes.BAD_REQUEST)
  const responseBody = await response.text()
  console.log(responseBody)
})

test('loan application with correct dept should receive 400', async ({ request }) => {
  const requestBody = new riskCalculationsDto(1000, 500, 17, true, 500, 6)
  const response = await request.post(baseURL, {
    data: requestBody,
  })
  expect(response.status()).toBe(StatusCodes.OK)
  const responseBody = await response.json()
  console.log(responseBody)
  expect.soft(responseBody.riskLevel).toBe('Medium Risk')
  expect.soft(responseBody.riskDecision).toBe('positive')
})

test('loan application with incorrect dept (-€1) should receive 400', async ({ request }) => {
  const requestBody = new riskCalculationsDto(0, -500, 17, true, 500, 6)
  const response = await request.post(baseURL, {
    data: requestBody,
  })
  expect(response.status()).toBe(StatusCodes.BAD_REQUEST)
  const responseBody = await response.text()
  console.log(responseBody)
})

test('loan application with big loan amount  should receive 400', async ({ request }) => {
  const requestBody = new riskCalculationsDto(1000, 0, 17, true, 10000, 6)
  const response = await request.post(baseURL, {
    data: requestBody,
  })
  expect(response.status()).toBe(StatusCodes.OK)
  const responseBody = await response.json()
  console.log(responseBody)
  expect.soft(responseBody.riskLevel).toBe('Very High Risk')
  expect.soft(responseBody.riskDecision).toBe('negative')
})

test('loan application with with high risk should receive 200', async ({ request }) => {
  const requestBody = new riskCalculationsDto(1000, 0, 17, true, 500, 3)
  const response = await request.post(baseURL, {
    data: requestBody,
  })
  expect(response.status()).toBe(StatusCodes.OK)
  const responseBody = await response.json()
  console.log(responseBody)
  expect.soft(responseBody.riskLevel).toBe('High Risk')
  expect.soft(responseBody.riskDecision).toBe('positive')
})

test('loan application with with medium risk should receive 200', async ({ request }) => {
  const requestBody = new riskCalculationsDto(1000, 0, 17, true, 500, 9)
  const response = await request.post(baseURL, {
    data: requestBody,
  })
  expect(response.status()).toBe(StatusCodes.OK)
  const responseBody = await response.json()
  console.log(responseBody)
  expect.soft(responseBody.riskLevel).toBe('Medium Risk')
  expect.soft(responseBody.riskDecision).toBe('positive')
})

test('loan application with with low risk should receive 200', async ({ request }) => {
  const requestBody = new riskCalculationsDto(1000, 0, 17, true, 500, 12)
  const response = await request.post(baseURL, {
    data: requestBody,
  })
  expect(response.status()).toBe(StatusCodes.OK)
  const responseBody = await response.json()
  console.log(responseBody)
  expect.soft(responseBody.riskLevel).toBe('Low Risk')
  expect.soft(responseBody.riskDecision).toBe('positive')
})

test('loan application with with loan period 0 should receive 400', async ({ request }) => {
  const requestBody = new riskCalculationsDto(1000, 0, 17, true, 500, 0)
  const response = await request.post(baseURL, {
    data: requestBody,
  })
  expect(response.status()).toBe(StatusCodes.BAD_REQUEST)
  const responseBody = await response.text()
  console.log(responseBody)
})
