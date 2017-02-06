export function isObject(value): boolean {
  const type = typeof value;
  return value !== null && (type === 'object' || type === 'function');
}

export function omit(source: {}, ...fields: string[]): {} {
  let result = {};

  if (isObject(source)) {
    result = Object.assign(result, source);
    fields.forEach(field => delete result[field]);
  }

  return result;
}

