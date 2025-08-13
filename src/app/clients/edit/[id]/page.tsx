"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ClientForm from '@/components/ClientForm';
import { Client } from '@/models/client';
import { Invoice } from '@/models/invoice';
import Link from 'next/link';

export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [client, setClient] = useState<Client | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // State for the new invoice form
  const [newInvoiceAmount, setNewInvoiceAmount] = useState('');
  const [newInvoiceDueDate, setNewInvoiceDueDate] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);

  const fetchClientAndInvoices = async () => {
    if (!id) return;
    try {
      setLoading(true);
      // Fetch client data
      const clientResponse = await fetch(`/api/clients/${id}`);
      if (!clientResponse.ok) throw new Error('Client not found');
      const clientData = await clientResponse.json();
      setClient(clientData);

      // Fetch invoices for the client
      const invoicesResponse = await fetch(`/api/clients/${id}/invoices`);
      if (!invoicesResponse.ok) throw new Error('Failed to fetch invoices');
      const invoicesData = await invoicesResponse.json();
      setInvoices(invoicesData);

    } catch (error) {
      console.error(error);
      alert('Falha ao carregar os dados.');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientAndInvoices();
  }, [id, router]);

  const handleUpdateClient = async (clientData: Client) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/clients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData),
      });
      if (!response.ok) throw new Error('Failed to update client');
      alert('Cliente atualizado com sucesso!');
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Falha ao atualizar o cliente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleScheduleInvoice = async (e: FormEvent) => {
    e.preventDefault();
    if (!newInvoiceAmount || !newInvoiceDueDate) {
      alert('Por favor, preencha o valor e a data de vencimento.');
      return;
    }
    setIsScheduling(true);
    try {
      const response = await fetch(`/api/clients/${id}/invoices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: newInvoiceAmount, dueDate: newInvoiceDueDate }),
      });
      if (!response.ok) throw new Error('Failed to schedule invoice');

      alert('Boleto agendado com sucesso!');
      setNewInvoiceAmount('');
      setNewInvoiceDueDate('');
      // Refresh the invoice list
      fetchClientAndInvoices();
    } catch (error) {
      console.error(error);
      alert('Falha ao agendar o boleto.');
    } finally {
      setIsScheduling(false);
    }
  };

  const statusStyles: { [key: string]: string } = {
    scheduled: 'bg-yellow-100 text-yellow-800',
    sent: 'bg-blue-100 text-blue-800',
    paid: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="text-blue-600 hover:underline mb-4 block">&larr; Voltar para a Lista</Link>
          <h1 className="text-3xl font-bold text-gray-900">Detalhes do Cliente</h1>
        </div>
      </header>
      <main className="container mx-auto p-4 space-y-8">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Dados do Cliente</h2>
          {loading ? <p>Carregando...</p> : client ? (
            <ClientForm client={client} onSave={handleUpdateClient} isSaving={isSaving} />
          ) : <p>Cliente não encontrado.</p>}
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Boletos</h2>

          {/* Schedule New Invoice Form */}
          <form onSubmit={handleScheduleInvoice} className="mb-8 p-4 border rounded-lg bg-gray-50 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Valor (R$)</label>
              <input type="number" name="amount" id="amount" value={newInvoiceAmount} onChange={e => setNewInvoiceAmount(e.target.value)} required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Data de Vencimento</label>
              <input type="date" name="dueDate" id="dueDate" value={newInvoiceDueDate} onChange={e => setNewInvoiceDueDate(e.target.value)} required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <button type="submit" disabled={isScheduling}
              className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-300 h-fit">
              {isScheduling ? 'Agendando...' : 'Agendar Novo Boleto'}
            </button>
          </form>

          {/* Invoices List */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vencimento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.length > 0 ? invoices.map(invoice => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">R$ {invoice.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[invoice.status] || 'bg-gray-100 text-gray-800'}`}>
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500">Nenhum boleto encontrado para este cliente.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
