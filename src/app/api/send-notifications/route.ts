import { NextResponse } from 'next/server';
import { getTemplates } from '@/services/api/notificationTemplateService';
import { getClients } from '@/services/api/clientService';
import { sendNotification } from '@/services/external/notificationService';
import { Client } from '@/models/client';

export async function POST(request: Request) {
  try {
    const { templateId, clientIds } = await request.json();

    if (!templateId || !clientIds || !Array.isArray(clientIds)) {
      return NextResponse.json({ message: 'Missing required fields: templateId and clientIds (must be an array)' }, { status: 400 });
    }

    const [templates, allClients] = await Promise.all([
      getTemplates(),
      getClients()
    ]);

    const template = templates.find(t => t.id === templateId);
    if (!template) {
      return NextResponse.json({ message: 'Template not found' }, { status: 404 });
    }

    let clientsToSend: Client[] = [];
    if (clientIds.includes('all')) {
      clientsToSend = allClients;
    } else {
      clientsToSend = allClients.filter(c => clientIds.includes(c.id));
    }

    if (clientsToSend.length === 0) {
      return NextResponse.json({ message: 'No clients selected or found' }, { status: 400 });
    }

    // Process all notifications
    const sendingPromises = clientsToSend.map(client => {
      const personalizedMessage = template.content.replace(/{{name}}/g, client.name);
      return sendNotification(client, personalizedMessage);
    });

    await Promise.all(sendingPromises);

    return NextResponse.json({ message: `${clientsToSend.length} notifications sent successfully.` });

  } catch (error) {
    console.error("Failed to send notifications:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
