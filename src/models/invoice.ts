export type InvoiceStatus = 'scheduled' | 'sent' | 'paid' | 'cancelled';

export interface Invoice {
  id: string;
  clientId: string; // To link to the client
  amount: number;
  dueDate: string; // ISO date string
  status: InvoiceStatus;
  createdAt: string; // ISO date string
}
