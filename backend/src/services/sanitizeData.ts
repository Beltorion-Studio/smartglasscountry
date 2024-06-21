import sanitizeHtml from 'sanitize-html';

export function sanitizeData(data: { [key: string]: string }) {
  const sanitizedData: { [key: string]: string } = {};
  for (const key in data) {
    sanitizedData[key] = sanitizeHtml(data[key]);
  }
  return sanitizedData;
}
/*
function sanitizeValue(value: any): any {
  if (typeof value === 'string') {
    return sanitizeHtml(value);
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (typeof value === 'object' && value !== null) {
    return sanitizeData(value);
  }
  return value;
}

export function sanitizeData2(data: { [key: string]: any }): { [key: string]: any } {
  const sanitizedData: { [key: string]: any } = {};
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      sanitizedData[key] = sanitizeValue(data[key]);
    }
  }
  return sanitizedData;
}
*/