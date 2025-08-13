import { NextResponse } from 'next/server';
import { getClients, saveClients } from '@/services/api/clientService';
import { Client } from '@/models/client';

type RouteParams = {
  params: {
    id: string;
  }
}

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = params;
  const clients = await getClients();
  const client = clients.find(c => c.id === id);

  if (!client) {
    return NextResponse.json({ message: 'Client not found' }, { status: 404 });
  }

  return NextResponse.json(client);
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = params;
  const updatedData = await request.json();
  const clients = await getClients();

  const clientIndex = clients.findIndex(c => c.id === id);

  if (clientIndex === -1) {
    return NextResponse.json({ message: 'Client not found' }, { status: 404 });
  }

  // Preserve the original ID and merge data
  const updatedClient: Client = {
    ...clients[clientIndex],
    ...updatedData,
    id: id,
  };

  clients[clientIndex] = updatedClient;
  await saveClients(clients);

  return NextResponse.json(updatedClient);
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = params;
  let clients = await getClients();
  const initialLength = clients.length;

  clients = clients.filter(c => c.id !== id);

  if (clients.length === initialLength) {
    return NextResponse.json({ message: 'Client not found' }, { status: 404 });
  }

  await saveClients(clients);

  return new NextResponse(null, { status: 204 }); // No Content
}
