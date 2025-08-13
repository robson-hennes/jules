"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ClientForm from '@/components/ClientForm';
import { Client } from '@/models/client';
import Link from 'next/link';

export default function NewClientPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveClient = async (clientData: Omit<Client, 'id'>) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        throw new Error('Failed to create client');
      }

      alert('Cliente criado com sucesso!');
      router.push('/');
      router.refresh(); // To ensure the client list is updated
    } catch (error) {
      console.error(error);
      alert('Falha ao criar o cliente.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="text-blue-600 hover:underline mb-4 block">&larr; Voltar para a Lista</Link>
          <h1 className="text-3xl font-bold text-gray-900">Adicionar Novo Cliente</h1>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-2xl mx-auto">
          <ClientForm onSave={handleSaveClient} isSaving={isSaving} />
        </div>
      </main>
    </div>
  );
}
