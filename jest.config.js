module.exports = {
    roots: ['<rootDir>/tests/'],
    transform: {
        '^.+\\.ts?$': 'ts-jest'
    },
    testRegex: '/tests/.*\\.test\\.ts$',
    setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
    coverageReporters: ['html'],
};
