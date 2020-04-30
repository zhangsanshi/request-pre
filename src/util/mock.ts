import { ApiSchema } from '../api';
export default function addMock(requestInfo: ApiSchema): Promise<any> | void {
    const { config, mock } = requestInfo;
    const mockStatus = config && config.mock;
    const mockInfo = mockStatus && mock && mock[mockStatus];
    if (mockInfo) {
        return new Promise((res, rej): void => {
            const action = mockInfo.success ? res : rej;
            action(typeof mockInfo.data === 'function' ? mockInfo.data(config) : mockInfo.data);
        });
    }
}