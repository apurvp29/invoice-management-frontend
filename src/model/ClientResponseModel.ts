import { ClientModel } from './ClientModel';

export type ClientResponseModel = {
  message: string;
  code: number;
  data: ClientModel;
};
