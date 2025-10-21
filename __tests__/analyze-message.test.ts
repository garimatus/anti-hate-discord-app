import { test, expect, beforeAll } from '@jest/globals'
import { initializeOllamaSession } from '../src/ollama'
import { analyzeMessage } from '../src/events/utils'
import testCases from './data/analyze-message.data.json'
import type { AnalyzeMessageTestCase } from './types'

beforeAll(async () =>
  expect(await initializeOllamaSession('tests-session')).toBeUndefined()
)

test.each(testCases as AnalyzeMessageTestCase[])(
  `"$speech": $expectedResult`,
  async ({ speech, expectedResult }: AnalyzeMessageTestCase) => {
    expect((await analyzeMessage(speech)).result).toBe(expectedResult)
  }
)
