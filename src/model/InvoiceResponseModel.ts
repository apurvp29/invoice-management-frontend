export type InvoiceResponseModel = {
  message: string;
  code: number;
  data: {
    invoiceId: string;
    invoiceNumber: string;
    invoiceDate: string;
    dueDate: string;
    billedTo: string;
    billedBy: string;
    discount: number;
    createdAt: string;
    updatedAt: string;
  };
};
