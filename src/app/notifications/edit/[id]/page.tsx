"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import TemplateForm from '@/components/TemplateForm';
import { NotificationTemplate } from '@/models/notificationTemplate';
import Link from 'next/link';

export default function EditTemplatePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [template, setTemplate] = useState<NotificationTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchTemplate = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/notification-templates/${id}`);
          if (!response.ok) throw new Error('Template not found');
          const data = await response.json();
          setTemplate(data);
        } catch (error) {
          console.error(error);
          alert('Falha ao carregar o template.');
          router.push('/notifications');
        } finally {
          setLoading(false);
        }
      };
      fetchTemplate();
    }
  }, [id, router]);

  const handleSave = async (templateData: NotificationTemplate) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/notification-templates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update template');
      }

      alert('Template atualizado com sucesso!');
      router.push('/notifications');
    } catch (error) {
      console.error(error);
      alert('Falha ao atualizar o template.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <Link href="/notifications" className="text-blue-600 hover:underline mb-4 block">&larr; Voltar para Templates</Link>
          <h1 className="text-3xl font-bold text-gray-900">Editar Template</h1>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-2xl mx-auto">
          {loading ? <p>Carregando...</p> : template ? (
            <TemplateForm template={template} onSave={handleSave} isSaving={isSaving} />
          ) : <p>Template não encontrado.</p>}
        </div>
      </main>
    </div>
  );
}
