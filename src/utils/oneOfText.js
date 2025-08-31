import { isEmpty } from "./objects.js";

/**
 * Decode a one-of-text filter from query into { field, value }.
 * Picks the first key in keys that has a truthy value.
 * @param {Object} query 
 * @param {string[]} keys 
 * @returns {{ field: string, value: string }}
 */
export function decodeOneOfText(query = {}, keys = []) {
  for (const k of keys) {
    const val = query[k];
    if (!isEmpty(val)) {
      return { field: k, value: val };
    }
  }
  return { field: "", value: "" };
}

/**
 * Encode a one-of-text filter into a query object with only the selected key set.
 * @param {string} field 
 * @param {string} value 
 * @param {string[]} keys 
 * @returns {Object}
 */
export function encodeOneOfText(field, value, keys = []) {
  const result = {};
  keys.forEach((k) => {
    result[k] = "";
  });
  if (field && !isEmpty(value)) {
    result[field] = value;
  }
  return result;
}
