import { isEmpty } from "./objects.js";

/**
 * Count active filters in a query object.
 * 
 * @param {Object} query - The query params object
 * @param {Object} options 
 * @param {string[]} options.ignore - keys to ignore (default pagination & sorting)
 * @param {Object} options.defaults - map of default values not to be counted
 * @returns {number}
 */
export function countActiveFilters(query = {}, { ignore, defaults } = {}) {
  const defaultIgnore = ["page", "page_size", "sort_by", "sort_dir"];
  const ignoreKeys = new Set([...(ignore || []), ...defaultIgnore]);

  const defaultsMap = defaults || {};

  let count = 0;
  Object.entries(query).forEach(([key, value]) => {
    if (ignoreKeys.has(key)) return;
    if (isEmpty(value)) return;
    if (defaultsMap[key] !== undefined && defaultsMap[key] === value) return;
    count++;
  });

  return count;
}
