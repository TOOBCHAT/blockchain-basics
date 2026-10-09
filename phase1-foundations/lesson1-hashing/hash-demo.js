/**
 * ==========================================================
 *  LESSON 1: Hash Functions — See Them In Action
 * ==========================================================
 *
 *  Run this file:  node hash-demo.js
 *
 *  We'll explore:
 *   1. Basic hashing with SHA-256
 *   2. Deterministic property
 *   3. Avalanche effect
 *   4. Fixed output size
 *   5. Pre-image resistance (why PoW is hard)
 *   6. SHA-256 vs Keccak-256
 */

const crypto = require("crypto");

// Helper: hash a string with SHA-256
function sha256(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

// Helper: hash with Keccak-256 (what Ethereum uses)
// Node.js doesn't have "keccak256" natively, but has "sha3-256"
// Note: Ethereum's "keccak256" is technically a pre-standardization
// version of SHA-3. For this demo, we'll use sha3-256 which is very close.
function keccak256(input) {
  return crypto.createHash("sha3-256").update(input).digest("hex");
}

// Pretty print helper
function section(title) {
  console.log("\n" + "=".repeat(60));
  console.log(`  ${title}`);
  console.log("=".repeat(60));
}

// ─────────────────────────────────────────────────────────
//  1. BASIC HASHING
// ─────────────────────────────────────────────────────────
section("1. Basic Hashing with SHA-256");

const message = "Hello, Web3!";
const hash = sha256(message);

console.log(`Input:  "${message}"`);
console.log(`Output: ${hash}`);
console.log(`Output length: ${hash.length} hex characters = ${hash.length * 4} bits`);
console.log();
console.log("👆 No matter what you input, the output is ALWAYS 64 hex chars (256 bits)");

// ─────────────────────────────────────────────────────────
//  2. DETERMINISTIC — Same input = Same output, ALWAYS
// ─────────────────────────────────────────────────────────
section("2. Deterministic Property");

const hash1 = sha256("Hello, Web3!");
const hash2 = sha256("Hello, Web3!");
const hash3 = sha256("Hello, Web3!");

console.log(`Hash 1: ${hash1}`);
console.log(`Hash 2: ${hash2}`);
console.log(`Hash 3: ${hash3}`);
console.log(`All identical? ${hash1 === hash2 && hash2 === hash3 ? "✅ YES" : "❌ NO"}`);
console.log();
console.log("👆 This is why every node in the network can independently");
console.log("   verify a block's hash — they all compute the SAME result.");

// ─────────────────────────────────────────────────────────
//  3. AVALANCHE EFFECT — Tiny change = Totally different hash
// ─────────────────────────────────────────────────────────
section("3. Avalanche Effect");

const inputs = [
  "Hello, Web3!",
  "Hello, Web3?",   // Changed ! to ?
  "hello, Web3!",   // Changed H to h
  "Hello, Web3! ",  // Added a trailing space
];

console.log("Watch how a TINY change produces a COMPLETELY different hash:\n");
inputs.forEach((input) => {
  console.log(`  "${input}"`);
  console.log(`  → ${sha256(input)}\n`);
});
console.log("👆 Even adding a SPACE changes the entire hash.");
console.log("   This is why miners can't 'get close' to a valid hash —");
console.log("   there's no gradient, no warm/cold. It's random-looking.");

// ─────────────────────────────────────────────────────────
//  4. FIXED OUTPUT SIZE — Any input length, same output
// ─────────────────────────────────────────────────────────
section("4. Fixed Output Size");

const tiny = "a";
const medium = "The quick brown fox jumps over the lazy dog";
const large = "x".repeat(10000); // 10,000 characters

console.log(`Input: "a" (${tiny.length} char)`);
console.log(`Hash:  ${sha256(tiny)}\n`);

console.log(`Input: "${medium}" (${medium.length} chars)`);
console.log(`Hash:  ${sha256(medium)}\n`);

console.log(`Input: "x" repeated 10,000 times (${large.length} chars)`);
console.log(`Hash:  ${sha256(large)}\n`);

console.log("👆 1 character or 10,000 characters — output is ALWAYS 64 hex chars.");

// ─────────────────────────────────────────────────────────
//  5. PRE-IMAGE RESISTANCE — Why Proof of Work is HARD
// ─────────────────────────────────────────────────────────
section("5. Pre-image Resistance & Proof of Work Simulation");

console.log('Challenge: Find a nonce where SHA-256("Web3 Block Data" + nonce)');
console.log('           starts with "0000" (4 leading zeros)\n');

const blockData = "Web3 Block Data";
const difficulty = 4; // Number of leading zeros required
const target = "0".repeat(difficulty);
let nonce = 0;
const startTime = Date.now();

while (true) {
  const attempt = sha256(blockData + nonce);
  if (attempt.startsWith(target)) {
    const elapsed = Date.now() - startTime;
    console.log(`✅ FOUND after ${nonce.toLocaleString()} attempts (${elapsed}ms)`);
    console.log(`   Nonce:  ${nonce}`);
    console.log(`   Hash:   ${attempt}`);
    console.log(`   Starts with "${"0".repeat(difficulty)}"? YES!\n`);
    console.log("👆 THIS is Proof of Work. There's no shortcut.");
    console.log("   You MUST try nonces one by one until you get lucky.");
    console.log(`   With ${difficulty} leading zeros, it took ~${nonce.toLocaleString()} tries.`);
    console.log(`   With 5 zeros? ~16x more. With 6? ~256x more.`);
    console.log("   Bitcoin adjusts difficulty so this takes ~10 minutes on average");
    console.log("   across ALL miners in the world combined.");
    break;
  }
  nonce++;
}

// ─────────────────────────────────────────────────────────
//  6. SHA-256 vs KECCAK-256 (Bitcoin vs Ethereum)
// ─────────────────────────────────────────────────────────
section("6. SHA-256 (Bitcoin) vs Keccak-256 (Ethereum)");

const testInput = "Same input, different algorithms";

console.log(`Input: "${testInput}"\n`);
console.log(`SHA-256 (Bitcoin):    ${sha256(testInput)}`);
console.log(`Keccak-256 (Ethereum): ${keccak256(testInput)}`);
console.log();
console.log("👆 Same input, completely different outputs.");
console.log("   Both are equally secure. Ethereum chose Keccak because");
console.log("   it was designed independently (no NSA involvement) and");
console.log("   won a public competition.");

// ─────────────────────────────────────────────────────────
//  SUMMARY
// ─────────────────────────────────────────────────────────
section("📝 KEY TAKEAWAYS");

console.log(`
  1. DETERMINISTIC   — Same input always gives same output
  2. AVALANCHE       — Tiny change in input = huge change in output
  3. FIXED SIZE      — Output is always 256 bits, regardless of input size
  4. ONE-WAY         — Can't reverse a hash to find the input
  5. COLLISION-PROOF  — Near-impossible to find two inputs with same hash
  
  In blockchains:
  • Block hashes link blocks together (tamper-evidence)
  • Merkle trees use hashes to summarize transactions
  • PoW = finding a nonce that produces a hash with leading zeros
  • Addresses are derived from hashed public keys
  
  Next up: MERKLE TREES — how blockchains use hashing to 
  efficiently verify transactions without downloading everything!
`);
