export type BusinessResponseModel = {
  message: string;
  code: number;
  data: Record<string, any> | Record<string, any[]>;
};
