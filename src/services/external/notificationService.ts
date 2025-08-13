import { Client } from '@/models/client';

// This is a placeholder for a real email/whatsapp notification service.
export async function sendNotification(client: Client, message: string) {
  console.log(`-->> SENDING NOTIFICATION <<--`);
  console.log(`     To: ${client.name} (${client.contact})`);
  console.log(`     Message: ${message}`);
  // Simulate sending delay
  await new Promise(resolve => setTimeout(resolve, 300));
  console.log(`-->> NOTIFICATION SENT <<--`);
}
