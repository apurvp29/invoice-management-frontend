export type ClientResponseModel = {
  message: string;
  code: number;
  data: {
    clientId: string;
    name: string;
    industryName: string;
    logo: string;
    pan: string;
    tan: string;
    gst: string;
    vat: string;
    clientType: string;
    email: string;
    phone: string;
    nickName: string;
    createdAt: string;
    updatedAt: string;
  };
};
