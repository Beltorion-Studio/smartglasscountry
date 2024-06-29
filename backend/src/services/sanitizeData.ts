import sanitizeHtml from 'sanitize-html';

/*
export function sanitizeData(data: { [key: string]: string }) {
  const sanitizedData: { [key: string]: string } = {};
  for (const key in data) {
    sanitizedData[key] = sanitizeHtml(data[key]);
  }
  return sanitizedData;
}
*/
function sanitizeValue<T>(value: T): T {
  if (typeof value === 'string') {
    // Assume sanitizeHtml returns a string as well
    return sanitizeHtml(value) as unknown as T;
  }
  if (Array.isArray(value)) {
    // Recursively sanitize each element of the array
    return value.map((item) => sanitizeValue(item)) as unknown as T;
  }
  if (typeof value === 'object' && value !== null) {
    // Recursively sanitize each property of the object
    return sanitizeData(value) as T;
  }
  return value;
}

function sanitizeData<T extends object>(data: T): T {
  const sanitizedData: any = {};
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      sanitizedData[key] = sanitizeValue(data[key]);
    }
  }
  return sanitizedData as T;
}

export default sanitizeData;
