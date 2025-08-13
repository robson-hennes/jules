import { NextResponse } from 'next/server';
import { getTemplates, saveTemplates } from '@/services/api/notificationTemplateService';
import { NotificationTemplate } from '@/models/notificationTemplate';
import { randomUUID } from 'crypto';

export async function GET() {
  const templates = await getTemplates();
  return NextResponse.json(templates);
}

export async function POST(request: Request) {
  const { name, content } = await request.json();

  if (!name || !content) {
    return NextResponse.json({ message: 'Missing required fields: name and content' }, { status: 400 });
  }

  const templates = await getTemplates();

  const newTemplate: NotificationTemplate = {
    id: randomUUID(),
    name,
    content,
  };

  templates.push(newTemplate);
  await saveTemplates(templates);

  return NextResponse.json(newTemplate, { status: 201 });
}
