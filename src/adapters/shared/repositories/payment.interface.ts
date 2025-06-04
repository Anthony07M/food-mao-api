export interface CreatePayment {
  transactionAmount: number;
  dateOfExpiration: string;
  paymentMethodId: string;
  payer: {
    email: string | undefined;
    identification: {
      type: string | undefined;
      number: string | undefined;
    };
  };
}
