export function isEmpty(val) {
  return val === undefined || val === null || val === "";
}

export function cleanObject(obj, { dropEmpty = true } = {}) {
  const result = {};
  Object.entries(obj || {}).forEach(([key, value]) => {
    if (dropEmpty && isEmpty(value)) return;
    result[key] = value;
  });
  return result;
}
