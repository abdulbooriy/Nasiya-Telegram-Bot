/**
 * Zapas Tarixi (PrepaidRecord) tiplari
 */

export interface IPrepaidRecord {
  _id: string;
  amount: number; // Ortiqcha to'langan summa
  date: Date; // Qachon olingan
  paymentMethod?: string; // To'lov usuli (som_cash, som_card, dollar_cash, dollar_card_visa)
  createdBy: string; // Kim qo'shgan (manager ID)
  customer: string; // Mijoz ID
  contract: string; // Shartnoma ID
  contractId?: string; // Shartnoma customId
  notes?: string; // Aniq va tushunarli izoh/ma'lumot
  relatedPaymentId?: string; // Qaysi to'lovdan olingan
  createdAt: string; // ISO format
  updatedAt: string; // ISO format
}

export interface IPrepaidRecordsResponse {
  success: boolean;
  data: IPrepaidRecord[];
  count: number;
}

export interface IPrepaidSummary {
  totalAmount: number;
  recordCount: number;
  lastRecord?: IPrepaidRecord;
}
