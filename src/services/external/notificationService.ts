import { Client } from '@/models/client';
import { Invoice } from '@/models/invoice';

// This is a placeholder for a real email/whatsapp notification service.
export async function sendInvoiceNotification(client: Client, invoice: Invoice, transactionId: string) {
  console.log(`-->> SENDING NOTIFICATION <<--`);
  console.log(`     To: ${client.name} (${client.contact})`);
  console.log(`     Message: Your invoice for R$${invoice.amount.toFixed(2)} is due on ${new Date(invoice.dueDate).toLocaleDateString()}.`);
  console.log(`     Billing Transaction: ${transactionId}`);
  // Simulate sending delay
  await new Promise(resolve => setTimeout(resolve, 300));
  console.log(`-->> NOTIFICATION SENT <<--`);
}
