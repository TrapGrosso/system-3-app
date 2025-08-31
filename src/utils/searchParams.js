import { isEmpty } from "./objects.js";

/**
 * Build a URLSearchParams object from given params.
 * @param {Object} params 
 * @param {Object} options 
 * @param {boolean} options.omitEmpty - if true, skips keys with empty values
 * @returns {URLSearchParams}
 */
export function buildSearchParams(params = {}, { omitEmpty = true } = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (omitEmpty && isEmpty(value)) return;
    searchParams.append(key, value);
  });
  return searchParams;
}

/**
 * Convenience to directly get a string
 */
export function toQueryString(params = {}, opts) {
  return buildSearchParams(params, opts).toString();
}
