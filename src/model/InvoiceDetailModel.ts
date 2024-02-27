export type InvoiceDetailModel = {
  message: string;
  code: number;
  data: {
    invoiceNumber: string;
    invoiceDate: string;
    invoiceDueDate: string;
    businessName: string;
    businessEmail: string;
    clientName: string;
    clientIndustryName: string;
    clientEmail: string;
    itemsInvoice: {
      invoiceItemsId: string;
      itemName: string;
      quantity: number;
      rate: number;
    }[];
    totalAmount: number;
  };
};
