/*
 * @Description: 
 * @Author: 司马老贼
 * @Date: 2023-01-05 11:43:38
 * @LastEditTime: 2023-01-05 11:44:45
 * @LastEditors: 司马老贼
 */
/**
 * Checks if `value` is an empty object, collection, map, or set.
 *
 * Objects are considered empty if they have no own enumerable string keyed
 * properties.
 *
 * Array-like values such as `arguments` objects, arrays, buffers, strings, or
 * jQuery-like collections are considered empty if they have a `length` of `0`.
 * Similarly, maps and sets are considered empty if they have a `size` of `0`.
 *
 * @function isEmpty
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
 * @example
 *
 * _.isEmpty(null);
 * // => true
 *
 * _.isEmpty(true);
 * // => true
 *
 * _.isEmpty(1);
 * // => true
 *
 * _.isEmpty([1, 2, 3]);
 * // => false
 *
 * _.isEmpty({ 'a': 1 });
 * // => false
 */
export function isEmpty(value: any): boolean {
    if (value == null) {
      return true;
    }
  
    if (typeof value !== 'object') {
      return true;
    }
  
    return Object.keys(value).length === 0;
  }