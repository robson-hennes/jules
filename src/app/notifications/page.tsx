"use client";

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { NotificationTemplate } from '@/models/notificationTemplate';
import { Client } from '@/models/client';

export default function NotificationsPage() {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);

  async function fetchData() {
    try {
      setLoading(true);
      const [templatesResponse, clientsResponse] = await Promise.all([
        fetch('/api/notification-templates'),
        fetch('/api/clients')
      ]);
      if (!templatesResponse.ok) throw new Error('Failed to fetch templates');
      if (!clientsResponse.ok) throw new Error('Failed to fetch clients');

      const templatesData = await templatesResponse.json();
      const clientsData = await clientsResponse.json();

      setTemplates(templatesData);
      setClients(clientsData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar este template?')) {
      try {
        const response = await fetch(`/api/notification-templates/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete template');
        fetchData(); // Refresh list
      } catch (error) {
        console.error(error);
        alert('Falha ao deletar o template.');
      }
    }
  };

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate || selectedClients.length === 0) {
      alert('Por favor, selecione um template e ao menos um cliente.');
      return;
    }
    setIsSending(true);
    try {
      const response = await fetch('/api/send-notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplate,
          clientIds: selectedClients,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to send notifications');
      alert(result.message);
    } catch (error) {
      console.error(error);
      alert(`Falha ao enviar: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Notificações</h1>
            <Link href="/" className="text-blue-600 hover:underline">
                &larr; Voltar para Clientes
            </Link>
        </div>
      </header>
      <main className="container mx-auto p-4 space-y-8">
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-6">Enviar Notificação em Massa</h2>
          <form onSubmit={handleSend} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label htmlFor="template" className="block text-sm font-medium text-gray-700">Selecione o Template</label>
              <select id="template" value={selectedTemplate} onChange={e => setSelectedTemplate(e.target.value)} required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                <option value="" disabled>Escolha um template...</option>
                {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="clients" className="block text-sm font-medium text-gray-700">Selecione os Clientes</label>
              <select id="clients" multiple value={selectedClients}
                onChange={e => setSelectedClients(Array.from(e.target.selectedOptions, option => option.value))} required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm h-32">
                <option value="all">Todos os Clientes</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <button type="submit" disabled={isSending || loading}
              className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-300 h-fit">
              {isSending ? 'Enviando...' : 'Enviar Notificação'}
            </button>
          </form>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md">
           <div className="flex justify-between items-center mb-6">
             <h2 className="text-2xl font-semibold">Gerenciar Templates</h2>
             <Link href="/notifications/new" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Novo Template
             </Link>
           </div>
          {loading ? <p>Carregando templates...</p> : (
            <div className="space-y-4">
              {templates.length > 0 ? templates.map(template => (
                <div key={template.id} className="p-4 border rounded-lg flex justify-between items-center hover:bg-gray-50">
                  <div>
                    <h3 className="font-bold text-lg">{template.name}</h3>
                    <p className="text-sm text-gray-600 mt-1 truncate">{template.content}</p>
                  </div>
                  <div className="flex gap-4">
                    <Link href={`/notifications/edit/${template.id}`} className="text-indigo-600 hover:text-indigo-900 font-medium">
                      Editar
                    </Link>
                    <button onClick={() => handleDelete(template.id)} className="text-red-600 hover:text-red-900 font-medium">
                      Deletar
                    </button>
                  </div>
                </div>
              )) : (
                <p>Nenhum template encontrado. Crie um novo para começar.</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
