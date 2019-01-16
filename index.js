"use strict";
const buffer = new ArrayBuffer(65536);
const mem = new Int32Array(buffer);
const code = process.argv[2]; // node index.js "code";

let ptr = 0;

for (let i = 0; i < code.length; i++) {
  const c = code.charAt(i);
  if (c === ">") {
    ptr++;
  } else if (c === "<") {
    ptr--;
  } else if (c === "+") {
    mem[ptr]++;
  } else if (c === "-") {
    mem[ptr]--;
  } else if (c === ".") {
    process.stdout.write(String.fromCharCode(mem[ptr]));
  } else if (c === ",") {
    const input = require("fs").readFileSync("/dev/stdin", "utf8");
    mem[ptr] = input.charAt(0);
  } else if (c === "[") {
    if (mem[ptr] === 0) {
      while (code.charAt(i) !== "]") i++;
    }
  } else if (c === "]") {
    if (mem[ptr] !== 0) {
      while (code.charAt(i) !== "[") i--;
    }
  }
}
