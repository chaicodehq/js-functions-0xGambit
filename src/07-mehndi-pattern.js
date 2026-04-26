/**
 * 🎨 Mehndi Pattern Maker - Recursion
 *
 * Mehndi artist hai tu! Intricate patterns banane hain using RECURSION.
 * Yahan loops use karna MANA hai — sirf function khud ko call karega
 * (recursive calls). Har function mein base case aur recursive case hoga.
 *
 * Functions:
 *
 *   1. repeatChar(char, n)
 *      - Repeat char n times using recursion (NO loops, NO .repeat())
 *      - Base case: n <= 0 => return ""
 *      - Recursive: char + repeatChar(char, n - 1)
 *      - Agar char not a string or empty, return ""
 *
 *   2. sumNestedArray(arr)
 *      - Sum all numbers in an arbitrarily nested array
 *      - e.g., [1, [2, [3, 4]], 5] => 15
 *      - Skip non-number values
 *      - Base case: empty array => 0
 *      - Agar input not array, return 0
 *
 *   3. flattenArray(arr)
 *      - Flatten an arbitrarily nested array into a single flat array
 *      - e.g., [1, [2, [3, 4]], 5] => [1, 2, 3, 4, 5]
 *      - Agar input not array, return []
 *
 *   4. isPalindrome(str)
 *      - Check if string is palindrome using recursion
 *      - Case-insensitive comparison
 *      - Base case: string length <= 1 => true
 *      - Compare first and last chars, recurse on middle
 *      - Agar input not string, return false
 *
 *   5. generatePattern(n)
 *      - Generate symmetric mehndi border pattern
 *      - n = 1 => ["*"]
 *      - n = 2 => ["*", "**", "*"]
 *      - n = 3 => ["*", "**", "***", "**", "*"]
 *      - Pattern goes from 1 star up to n stars, then back down to 1
 *      - Use recursion to build the ascending part, then mirror it
 *      - Agar n <= 0, return []
 *      - Agar n is not a positive integer, return []
 *
 * Hint: Every recursive function needs a BASE CASE (when to stop) and a
 *   RECURSIVE CASE (calling itself with a smaller/simpler input).
 *
 * @example
 *   repeatChar("*", 4)        // => "****"
 *   sumNestedArray([1, [2, [3]]]) // => 6
 *   flattenArray([1, [2, [3]]]) // => [1, 2, 3]
 *   isPalindrome("madam")     // => true
 *   generatePattern(3)        // => ["*", "**", "***", "**", "*"]
 */
export function repeatChar(char, n) {
  if(typeof char !== 'string' || char === '') return ''

  if(n <= 0) return ''
  return char + repeatChar(char, n-1)
}

export function sumNestedArray(arr) {
  
  if(!Array.isArray(arr) || arr.length === 0) return 0

  if(typeof arr[arr.length - 1] === 'number') return arr.pop() + sumNestedArray(arr)

  else if(typeof arr[arr.length - 1] !== 'number' && !Array.isArray(arr[arr.length-1])){
    arr.pop()
    return sumNestedArray(arr)
  }
  
  else {
    const lastEleSum = sumNestedArray(arr[arr.length - 1]) 
    arr.pop()
    return lastEleSum + sumNestedArray(arr)
  }
}

export function flattenArray(arr) {
  // Base case: If not an array or empty
  if (!Array.isArray(arr) || arr.length === 0) return [];

  const [first, ...rest] = arr;

  // Recursive case: If first is an array, flatten it; else wrap in array
  const flatFirst = Array.isArray(first) ? flattenArray(first) : [first];

  // Combine with the flattened rest
  return [...flatFirst, ...flattenArray(rest)];
} 

export function isPalindrome(str) {
  if (typeof str !== 'string') return false;
  
  // Clean the string (case-insensitive)
  const cleanStr = str.toLowerCase();

  // Base case: 0 or 1 characters left means it's a palindrome
  if (cleanStr.length <= 1) return true;

  // Compare first and last
  if (cleanStr[0] !== cleanStr[cleanStr.length - 1]) return false;

  // Recurse on the middle section
  return isPalindrome(cleanStr.slice(1, -1));
}

export function generatePattern(n) {
  if (!Number.isInteger(n) || n <= 0) return [];

  // Helper to build the ascending and descending parts
  function build(current) {
    // Base Case: We hit the center of the pattern
    if (current === n) {
      return [repeatChar("*", n)];
    }

    const row = repeatChar("*", current);
    
    // Recursive Case: 
    // [Row] + [Everything in the middle] + [Row again for symmetry]
    return [row, ...build(current + 1), row];
  }

  return build(1);
}
