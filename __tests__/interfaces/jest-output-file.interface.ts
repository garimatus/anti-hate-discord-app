export interface JestOutputFile extends Record<string, any> {
  numTotalTests: number
  numPassedTests: number
  numFailedTests: number
  numPendingTests: number
  numTodoTests: number
  testResults: Array<{
    assertionResults: Array<{
      fullName: string
      status: 'passed' | 'failed' | 'pending' | 'todo'
    }>
  }>
}
