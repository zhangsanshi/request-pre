import { ApiSchema } from '../api';
export default function postprocess(requestInfo: ApiSchema, postprocessFunc): any {
    return postprocessFunc(requestInfo);
}