// lib/adminLocale.ts
export async function loadMessages(locale: string) {
  const { default: messages } = await import(`../messages/${locale}.json`);
  return messages;
}