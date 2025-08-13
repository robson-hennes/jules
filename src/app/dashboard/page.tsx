"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { InvoiceStatus } from '@/models/invoice';

interface DashboardData {
  totalClients: number;
  totalInvoiceValue: number;
  totalPaidValue: number;
  totalOutstandingValue: number;
  invoiceCountByStatus: { [key in InvoiceStatus]?: number };
}

const StatCard = ({ title, value, isCurrency = false }: { title: string; value: number; isCurrency?: boolean }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-sm font-medium text-gray-500 truncate">{title}</h3>
    <p className="mt-1 text-3xl font-semibold text-gray-900">
      {isCurrency ? `R$ ${value.toFixed(2)}` : value}
    </p>
  </div>
);

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch('/api/dashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const dashboardData = await response.json();
        setData(dashboardData);
      } catch (error) {
        console.error(error);
        // You could set an error state here to show a message
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Financeiro</h1>
            <div>
                <Link href="/" className="text-blue-600 hover:underline">
                    &larr; Voltar para Clientes
                </Link>
            </div>
        </div>
      </header>
      <main className="container mx-auto p-4">
        {loading ? (
          <p>Carregando dados do dashboard...</p>
        ) : data ? (
          <div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard title="Total de Clientes" value={data.totalClients} />
              <StatCard title="Valor Total em Boletos" value={data.totalInvoiceValue} isCurrency />
              <StatCard title="Total Recebido (Pago)" value={data.totalPaidValue} isCurrency />
              <StatCard title="Valor Pendente" value={data.totalOutstandingValue} isCurrency />
            </div>
            <div className="mt-8 bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Resumo de Boletos por Status</h3>
              <ul className="mt-4 space-y-2">
                {data.invoiceCountByStatus && Object.entries(data.invoiceCountByStatus).map(([status, count]) => (
                  <li key={status} className="flex justify-between text-sm">
                    <span className="font-medium capitalize">{status}</span>
                    <span className="font-semibold">{count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p>Não foi possível carregar os dados.</p>
        )}
      </main>
    </div>
  );
}
