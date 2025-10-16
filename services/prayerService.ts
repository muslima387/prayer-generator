
import { PrayerCategory } from '../types';
import { PRAYER_TEMPLATES } from '../constants';

export const generatePrayer = (name: string, category: PrayerCategory): string => {
  const templates = PRAYER_TEMPLATES[category];
  if (!templates || templates.length === 0) {
    return `اللهم احفظ ${name} بحفظك.`;
  }
  const randomIndex = Math.floor(Math.random() * templates.length);
  const template = templates[randomIndex];
  return template.replace(/{{name}}/g, name);
};
