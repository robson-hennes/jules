import { promises as fs } from 'fs';
import path from 'path';
import { Invoice } from '@/models/invoice';

const jsonFilePath = path.join(process.cwd(), 'src', 'data', 'invoices.json');

export async function getInvoices(): Promise<Invoice[]> {
  try {
    const fileContents = await fs.readFile(jsonFilePath, 'utf8');
    if (!fileContents) {
      return [];
    }
    return JSON.parse(fileContents);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
    }
    console.error("Error reading invoices file:", error);
    throw error;
  }
}

export async function saveInvoices(invoices: Invoice[]) {
  await fs.writeFile(jsonFilePath, JSON.stringify(invoices, null, 2));
}
