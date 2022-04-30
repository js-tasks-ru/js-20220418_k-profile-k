/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (string === undefined) return undefined;
  if (size === 0) return '';

  let newString = [];
  let currentAmount = 0;
  let currentSymbol = string[0];

  for (let symbol of string) {
    if (symbol === currentSymbol && currentAmount === size) continue;

    if (symbol !== currentSymbol) {
      currentAmount = 1;
    } else {
      currentAmount++;
    }

    currentSymbol = symbol;
    newString.push(currentSymbol);
  }

  return newString.join('');
}
