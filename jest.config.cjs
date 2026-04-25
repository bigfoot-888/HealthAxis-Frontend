module.exports = {
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1', 
    },
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
};
