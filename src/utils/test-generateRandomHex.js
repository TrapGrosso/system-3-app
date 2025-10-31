import { generateRandomHex } from './generateRandomHex.js';

// Test 1: Generate both colors from scratch
console.log('Test 1: Generate both colors from scratch');
const result1 = generateRandomHex();
console.log(result1);
console.log('Text color:', result1.text_color);
