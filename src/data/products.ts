type Destination = { status: 'coming-soon'; url?: never } | { status: 'available'; url: string };

export type Product = {
  id: 'ganbarou' | 'jiayou';
  name: string;
} & Destination;

function destination(value: string | undefined): Destination {
  if (!value?.trim()) return { status: 'coming-soon' };
  const url = new URL(value.trim());
  if (url.protocol !== 'https:' || url.username || url.password) {
    throw new Error('Product links must be HTTPS URLs without credentials.');
  }
  return { status: 'available', url: url.href };
}

export const products: Product[] = [
  { id: 'ganbarou', name: 'Ganbarou', ...destination(import.meta.env.GANBAROU_URL) },
  { id: 'jiayou', name: 'Jiayou', ...destination(import.meta.env.JIAYOU_URL) }
];
