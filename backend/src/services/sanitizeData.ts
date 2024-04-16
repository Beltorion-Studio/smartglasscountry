import sanitizeHtml from 'sanitize-html';

export function sanitizeData(data: { [key: string]: string }) {
  const sanitizedData: { [key: string]: string } = {};
  for (const key in data) {
    sanitizedData[key] = sanitizeHtml(data[key]);
  }
  return sanitizedData;
}
