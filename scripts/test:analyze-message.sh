node --env-file $ENV_FILE --experimental-vm-modules node_modules/jest/bin/jest.js\
    __tests__/analyze-message.test.ts\
    --json --outputFile=__tests__/analyze-message-results.json;
node --import=tsx __tests__/scripts/validate-analyze-message.ts