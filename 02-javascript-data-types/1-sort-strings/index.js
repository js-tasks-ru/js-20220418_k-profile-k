/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  if (param !== 'asc' && param !== 'desc') {
    throw new SyntaxError(`Wrong parameter: "${param}". Method only allows "asc" and "desc".`);
  }

  return [...arr].sort((item1, item2) =>
    (param === 'asc' ? 1 : -1) * item1.localeCompare(item2, ['ru', 'en'], { caseFirst: 'upper' })
  );
}
