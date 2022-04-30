/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const props = path.split(".");
  
  function findProperty(obj) {  
    let currentObj = obj;

    for (let prop of props) {
      if (currentObj === undefined) return undefined;
      currentObj = currentObj[prop];
    }

    return currentObj;
  }
  
  return findProperty;
}
