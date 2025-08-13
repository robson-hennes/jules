import { NextResponse } from 'next/server';
import { getClients } from '@/services/api/clientService';
import { getInvoices } from '@/services/api/invoiceService';
import { Invoice, InvoiceStatus } from '@/models/invoice';

export async function GET() {
  try {
    const [clients, invoices] = await Promise.all([
      getClients(),
      getInvoices()
    ]);

    const totalClients = clients.length;

    let totalInvoiceValue = 0;
    let totalPaidValue = 0;
    const invoiceCountByStatus: { [key in InvoiceStatus]?: number } = {};

    for (const invoice of invoices) {
      totalInvoiceValue += invoice.amount;

      // Initialize status count if not present
      if (!invoiceCountByStatus[invoice.status]) {
        invoiceCountByStatus[invoice.status] = 0;
      }
      invoiceCountByStatus[invoice.status]!++;

      if (invoice.status === 'paid') {
        totalPaidValue += invoice.amount;
      }
    }

    const totalOutstandingValue = totalInvoiceValue - totalPaidValue;

    const dashboardData = {
      totalClients,
      totalInvoiceValue,
      totalPaidValue,
      totalOutstandingValue,
      invoiceCountByStatus,
    };

    return NextResponse.json(dashboardData);

  } catch (error) {
    console.error("Failed to generate dashboard data:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
