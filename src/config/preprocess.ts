import { ApiSchema } from '../api';
export default function preprocess(requestInfo: ApiSchema, preprocessFunc): any {
    return preprocessFunc(requestInfo);
}