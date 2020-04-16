import { resolvePath } from '../../src/util/utils';
const caseBase = function(caseInfo): void {
    test(`resolvePath(${caseInfo.input}, ${JSON.stringify(caseInfo.config, null, 4)})`, (): void => {
        expect(resolvePath(caseInfo.input, caseInfo.config)).toBe(caseInfo.output);
    });
};
caseBase({
    input: '/a/b',
    output: '/a/b',
    config: null,
});

caseBase({
    input: '/a/b',
    output: '/a/b',
    config: {
        id: 1,
    },
});
caseBase({
    input: '/a/b/{id}',
    output: '/a/b/1',
    config: {
        id: 1,
    },
});
caseBase({
    input: '/a/{id}/b',
    output: '/a/1/b',
    config: {
        id: 1,
    },
});
caseBase({
    input: '/{id}/a/b',
    output: '/1/a/b',
    config: {
        id: 1,
    },
});
caseBase({
    input: '{id}/a/b',
    output: '1/a/b',
    config: {
        id: 1,
    },
});
caseBase({
    input: '{id}a/b',
    output: '1a/b',
    config: {
        id: 1,
    },
});
caseBase({
    input: '/a/b/{id}',
    output: '/a/b/{id}',
    config: null
});
caseBase({
    input: '/{id}/a/b',
    output: '/{id}/a/b',
    config: {
        id1: 1,
    },
});