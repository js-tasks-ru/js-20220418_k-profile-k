/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  return [...arr].sort((item1, item2) =>
    param === 'asc'
      ? item1.localeCompare(item2, 'ru', { caseFirst: 'upper' })
      : item2.localeCompare(item1, 'ru', { caseFirst: 'upper' })
  );
}
