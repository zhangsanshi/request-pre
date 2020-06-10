import { ApiSchema } from '../api';
export default function postprocess(requestInfo: ApiSchema, postprocessFunc): void {
    return postprocessFunc(requestInfo);
}