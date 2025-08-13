import { promises as fs } from 'fs';
import path from 'path';
import { NotificationTemplate } from '@/models/notificationTemplate';

const jsonFilePath = path.join(process.cwd(), 'src', 'data', 'notificationTemplates.json');

export async function getTemplates(): Promise<NotificationTemplate[]> {
  try {
    const fileContents = await fs.readFile(jsonFilePath, 'utf8');
    if (!fileContents) {
      return [];
    }
    return JSON.parse(fileContents);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
    }
    console.error("Error reading templates file:", error);
    throw error;
  }
}

export async function saveTemplates(templates: NotificationTemplate[]) {
  await fs.writeFile(jsonFilePath, JSON.stringify(templates, null, 2));
}
