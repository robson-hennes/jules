import { NextResponse } from 'next/server';
import { getInvoices, saveInvoices } from '@/services/api/invoiceService';
import { Invoice } from '@/models/invoice';
import { randomUUID } from 'crypto';

type RouteParams = {
  params: {
    id: string;
  }
}

// Get all invoices for a specific client
export async function GET(request: Request, { params }: RouteParams) {
  const { id } = params;
  const allInvoices = await getInvoices();
  const clientInvoices = allInvoices.filter(inv => inv.clientId === id);
  return NextResponse.json(clientInvoices);
}

// Create a new invoice for a client
export async function POST(request: Request, { params }: RouteParams) {
  const { id } = params;
  const { amount, dueDate } = await request.json();

  if (!amount || !dueDate) {
    return NextResponse.json({ message: 'Missing required fields: amount and dueDate' }, { status: 400 });
  }

  const allInvoices = await getInvoices();

  const newInvoice: Invoice = {
    id: randomUUID(),
    clientId: id,
    amount: parseFloat(amount),
    dueDate,
    status: 'scheduled', // All new invoices start as 'scheduled'
    createdAt: new Date().toISOString(),
  };

  allInvoices.push(newInvoice);
  await saveInvoices(allInvoices);

  // In a real application, you might trigger the billing and notification here
  // or have a separate cron job that processes scheduled invoices.
  // For now, we just save it as 'scheduled'.

  return NextResponse.json(newInvoice, { status: 201 });
}
