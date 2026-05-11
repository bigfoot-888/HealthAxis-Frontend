module.exports = {
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '@/lib/axios': '<rootDir>/__mocks__/axios.js',
        'react-pdf': '<rootDir>/__mocks__/react-pdf.js',
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@appointments/(.*)$': '<rootDir>/src/features/appointments/$1',
        '^@patients/(.*)$': '<rootDir>/src/features/patients/$1',
        '^@users/(.*)$': '<rootDir>/src/features/users/$1',
        '^@diagnoses/(.*)$': '<rootDir>/src/features/clinical-records/diagnoses/$1',
        '^@treatments/(.*)$': '<rootDir>/src/features/clinical-records/treatments/$1',
        '^@auth/(.*)$': '<rootDir>/src/features/auth/$1',
    },
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
};
