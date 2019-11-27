'use strict';
const buffer = new ArrayBuffer(65536);
const mem = new Int32Array(buffer);
const code = process.argv[2]; // node index.js "code";

let ptr = 0;
process.stdin.resume();
process.stdin.setEncoding('utf8');

const stack = [];

async function main() {
  for (let i = 0; i < code.length; i++) {
    const c = code.charAt(i);
    if (c === '>') {
      ptr++;
    } else if (c === '<') {
      ptr--;
    } else if (c === '+') {
      mem[ptr]++;
    } else if (c === '-') {
      mem[ptr]--;
    } else if (c === '.') {
      process.stdout.write(String.fromCharCode(mem[ptr]));
    } else if (c === ',') {
      await new Promise((resolve, reject) => {
        let inputString = '';
        process.stdin.on('data', chunk => {
          inputString += chunk;
        });
        process.stdin.on('end', () => {
          mem[ptr] = inputString.codePointAt(0);
          resolve();
        });
      });
    } else if (c === '[') {
      let j = i;
      while (mem[ptr] === 0) {
        if (code.charAt(j) === '[') {
          stack.push(true);
        } else if (code.charAt(j) === ']') {
          stack.pop();
        }
        if (stack.length === 0) break;
        j++;
      }
      i = j;
    } else if (c === ']') {
      let j = i;
      while (mem[ptr] !== 0) {
        if (code.charAt(j) === ']') {
          stack.push(true);
        } else if (code.charAt(j) === '[') {
          stack.pop();
        }
        if (stack.length === 0) break;
        j--;
      }
      i = j;
    }
  }
}

main();
