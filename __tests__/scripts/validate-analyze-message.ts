import fs from 'node:fs'
import type { JestOutputFile } from '../interfaces'

const { pathname: resultsFilePath }: { pathname: string } = new URL(
  '../analyze-message-results.json',
  import.meta.url
)

if (!fs.existsSync(resultsFilePath)) {
  console.error('❌ No test result file found')
  process.exit(1)
}

const data: JestOutputFile | undefined = JSON.parse(
  fs.readFileSync(resultsFilePath, 'utf-8')
)

if (!data) {
  console.error('❌ Failed to parse test results')
  process.exit(1)
}

const ANALYZE_MESSAGE_SUCCESS_RATIO: number | undefined = Number(
  process.env.ANALYZE_MESSAGE_SUCCESS_RATIO
)
const successRatio: number =
  ANALYZE_MESSAGE_SUCCESS_RATIO > 0 && ANALYZE_MESSAGE_SUCCESS_RATIO <= 1
    ? ANALYZE_MESSAGE_SUCCESS_RATIO
    : 0.95
const total: number = data.numTotalTests ?? 0
const passed: number = data.numPassedTests ?? 0

if (total === 0) {
  console.error('❌ No tests found')
  process.exit(1)
}

const ratio: number = passed / total
const ratioPercent: number = ratio * 100

console.log(`📋 Passed ${passed}/${total} tests (${ratioPercent.toFixed(2)}%)`)

if (ratio < successRatio) {
  console.error(
    `❌ Failed: Pass percentage ${ratioPercent.toFixed(2)}% is below threshold of ${(successRatio * 100).toFixed(2)}%`
  )
  process.exit(1)
}

console.log(`✅ Tests passed threshold (${(successRatio * 100).toFixed(2)}%)`)
process.exit(0)
