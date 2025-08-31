import { isEmpty } from "./objects.js";

/**
 * Decode date_from/date_to into { from, to }
 * @param {Object} query 
 * @param {string[]} keys - [fromKey, toKey]
 * @returns {{ from: string, to: string }}
 */
export function decodeDateRange(query = {}, keys = ["date_from","date_to"]) {
  const [fromKey, toKey] = keys;
  return {
    from: query[fromKey] || "",
    to: query[toKey] || "",
  };
}

/**
 * Encode { from, to } into query object with given keys
 * @param {{ from?: string, to?: string }} range 
 * @param {string[]} keys - [fromKey, toKey]
 * @returns {Object}
 */
export function encodeDateRange(range = {}, keys = ["date_from","date_to"]) {
  const [fromKey, toKey] = keys;
  return {
    [fromKey]: isEmpty(range.from) ? "" : range.from,
    [toKey]: isEmpty(range.to) ? "" : range.to,
  };
}
