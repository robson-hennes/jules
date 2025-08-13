import { promises as fs } from 'fs';
import path from 'path';
import { Client } from '@/models/client';

const jsonFilePath = path.join(process.cwd(), 'src', 'data', 'clients.json');

export async function getClients(): Promise<Client[]> {
  try {
    const fileContents = await fs.readFile(jsonFilePath, 'utf8');
    if (!fileContents) {
      return [];
    }
    return JSON.parse(fileContents);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return []; // File not found, which is fine, return empty array.
    }
    console.error("Error reading clients file:", error);
    throw error; // Rethrow other errors
  }
}

export async function saveClients(clients: Client[]) {
  await fs.writeFile(jsonFilePath, JSON.stringify(clients, null, 2));
}
