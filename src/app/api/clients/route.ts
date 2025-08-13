import { NextResponse } from 'next/server';
import { Client } from '@/models/client';
import { randomUUID } from 'crypto';
import { getClients, saveClients } from '@/services/api/clientService';

export async function GET() {
  const clients = await getClients();
  return NextResponse.json(clients);
}

export async function POST(request: Request) {
  const { name, contact, address, document } = await request.json();

  if (!name || !contact || !address || !document) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  const clients = await getClients();

  const newClient: Client = {
    id: randomUUID(),
    name,
    contact,
    address,
    document,
  };

  clients.push(newClient);
  await saveClients(clients);

  return NextResponse.json(newClient, { status: 201 });
}
