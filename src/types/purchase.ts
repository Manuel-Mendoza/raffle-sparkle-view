export interface PurchaseData {
  tickets: number;
  total: number;
  userData: {
    name: string;
    phone: string;
    email: string;
  } | null;
  paymentProof: string | null;
  paymentMethod: string;
}
