"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TemplateForm from '@/components/TemplateForm';
import { NotificationTemplate } from '@/models/notificationTemplate';
import Link from 'next/link';

export default function NewTemplatePage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (templateData: Omit<NotificationTemplate, 'id'>) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/notification-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateData),
      });

      if (!response.ok) {
        throw new Error('Failed to create template');
      }

      alert('Template criado com sucesso!');
      router.push('/notifications');
    } catch (error) {
      console.error(error);
      alert('Falha ao criar o template.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <Link href="/notifications" className="text-blue-600 hover:underline mb-4 block">&larr; Voltar para Templates</Link>
          <h1 className="text-3xl font-bold text-gray-900">Novo Template de Notificação</h1>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-2xl mx-auto">
          <TemplateForm onSave={handleSave} isSaving={isSaving} />
        </div>
      </main>
    </div>
  );
}
