"use client";

import { useState, useEffect } from 'react';
import { Client } from '@/models/client';
import { useRouter } from 'next/navigation';

interface ClientFormProps {
  client?: Client;
  onSave: (client: Omit<Client, 'id'> | Client) => Promise<void>;
  isSaving: boolean;
}

export default function ClientForm({ client, onSave, isSaving }: ClientFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    address: '',
    document: '',
  });
  const router = useRouter();

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        contact: client.contact,
        address: client.address,
        document: client.document,
      });
    }
  }, [client]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(client ? { ...client, ...formData } : formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nome Completo
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
          Contato (E-mail ou Telefone)
        </label>
        <input
          type="text"
          name="contact"
          id="contact"
          value={formData.contact}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Endereço
        </label>
        <input
          type="text"
          name="address"
          id="address"
          value={formData.address}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="document" className="block text-sm font-medium text-gray-700">
          Documento (CPF/CNPJ)
        </label>
        <input
          type="text"
          name="document"
          id="document"
          value={formData.document}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Salvando...' : 'Salvar Cliente'}
        </button>
      </div>
    </form>
  );
}
