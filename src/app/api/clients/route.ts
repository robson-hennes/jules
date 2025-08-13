import { NextResponse } from 'next/server';
import { Client } from '@/models/client';
import { randomUUID } from 'crypto';
import { getClients, saveClients } from '@/services/api/clientService';

export async function GET() {
  const clients = await getClients();
  return NextResponse.json(clients);
}

export async function POST(request: Request) {
  const newClientData = await request.json();

  if (!newClientData.name || !newClientData.contact || !newClientData.address || !newClientData.document) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  const clients = await getClients();

  const newClient: Client = {
    id: randomUUID(),
    name: newClientData.name,
    contact: newClientData.contact,
    address: newClientData.address,
    document: newClientData.document,
    ...newClientData
  };

  clients.push(newClient);
  await saveClients(clients);

  return NextResponse.json(newClient, { status: 201 });
}
