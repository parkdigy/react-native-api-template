import { MyRequest } from './MyRequest';
import { MyResponse } from './MyResponse';

export type MyController = (req: MyRequest, res: MyResponse) => void;
