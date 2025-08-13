import { NextResponse } from 'next/server';
import { getInvoices, saveInvoices } from '@/services/api/invoiceService';

type RouteParams = {
  params: {
    id: string; // Client ID
    invoiceId: string;
  }
}

// Handler to update an invoice's status, specifically to 'paid'
export async function PATCH(request: Request, { params }: RouteParams) {
  const { id: clientId, invoiceId } = params;

  const allInvoices = await getInvoices();

  const invoiceIndex = allInvoices.findIndex(inv => inv.id === invoiceId && inv.clientId === clientId);

  if (invoiceIndex === -1) {
    return NextResponse.json({ message: 'Invoice not found for this client' }, { status: 404 });
  }

  // Update the status to 'paid'
  allInvoices[invoiceIndex].status = 'paid';

  await saveInvoices(allInvoices);

  return NextResponse.json(allInvoices[invoiceIndex]);
}
