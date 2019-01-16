'use strict';
const buffer = new ArrayBuffer(65536);
const mem = new Int32Array(buffer);
const code = process.argv[2]; // node index.js "code";

let ptr = 0;
process.stdin.resume();
process.stdin.setEncoding('utf8');

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
      if (mem[ptr] === 0) {
        while (code.charAt(i) !== ']') i++;
      }
    } else if (c === ']') {
      if (mem[ptr] !== 0) {
        while (code.charAt(i) !== '[') i--;
      }
    }
  }
}

main();
