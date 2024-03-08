export type InvoiceDetailModel = {
  message: string;
  code: number;
  data: {
    invoiceNumber: string;
    invoiceDate: string;
    invoiceDueDate: string;
    businessName: string;
    businessEmail: string;
    businessGST: string,
    businessPan: string,
    clientGST: string,
    clientPAN: string,
    clientName: string;
    clientIndustryName: string;
    clientEmail: string;
    itemsInvoice: {
      invoiceItemsId: string;
      itemName: string;
      quantity: number;
      rate: number;
    }[];
    taxInvoice: {
      invoiceTaxId: string,
      taxName: string,
      taxPercentage: number
    }[];
    totalAmount: number;
  };
};
