"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NotificationTemplate } from '@/models/notificationTemplate';

interface TemplateFormProps {
  template?: NotificationTemplate;
  onSave: (template: Omit<NotificationTemplate, 'id'> | NotificationTemplate) => Promise<void>;
  isSaving: boolean;
}

export default function TemplateForm({ template, onSave, isSaving }: TemplateFormProps) {
  const [formData, setFormData] = useState({ name: '', content: '' });
  const router = useRouter();

  useEffect(() => {
    if (template) {
      setFormData({ name: template.name, content: template.content });
    }
  }, [template]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(template ? { ...template, ...formData } : formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nome do Template
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Conteúdo da Mensagem
        </label>
        <textarea
          name="content"
          id="content"
          value={formData.content}
          onChange={handleChange}
          required
          rows={6}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
        <p className="mt-2 text-xs text-gray-500">
          Você pode usar placeholders como `{{name}}` que serão substituídos pelo nome do cliente.
        </p>
      </div>
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.push('/notifications')}
          className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isSaving ? 'Salvando...' : 'Salvar Template'}
        </button>
      </div>
    </form>
  );
}
