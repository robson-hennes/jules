import { NextResponse } from 'next/server';
import { getTemplates, saveTemplates } from '@/services/api/notificationTemplateService';
import { NotificationTemplate } from '@/models/notificationTemplate';

type RouteParams = {
  params: {
    id: string;
  }
}

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = params;
  const templates = await getTemplates();
  const template = templates.find(t => t.id === id);

  if (!template) {
    return NextResponse.json({ message: 'Template not found' }, { status: 404 });
  }

  return NextResponse.json(template);
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = params;
  const { name, content } = await request.json();

  if (!name || !content) {
    return NextResponse.json({ message: 'Missing required fields: name and content' }, { status: 400 });
  }

  const templates = await getTemplates();
  const templateIndex = templates.findIndex(t => t.id === id);

  if (templateIndex === -1) {
    return NextResponse.json({ message: 'Template not found' }, { status: 404 });
  }

  const updatedTemplate: NotificationTemplate = {
    ...templates[templateIndex],
    name,
    content,
  };

  templates[templateIndex] = updatedTemplate;
  await saveTemplates(templates);

  return NextResponse.json(updatedTemplate);
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = params;
  let templates = await getTemplates();
  const initialLength = templates.length;

  templates = templates.filter(t => t.id !== id);

  if (templates.length === initialLength) {
    return NextResponse.json({ message: 'Template not found' }, { status: 404 });
  }

  await saveTemplates(templates);

  return new NextResponse(null, { status: 204 }); // No Content
}
