import { ApiSchema } from '../api';
export default function preprocess(requestInfo: ApiSchema, preprocessFunc): void {
    return preprocessFunc(requestInfo);
}