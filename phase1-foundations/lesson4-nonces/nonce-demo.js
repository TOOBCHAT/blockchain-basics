/**
 * ==========================================================
 *  LESSON 4: The Two Nonces — Mining vs Account
 * ==========================================================
 *
 *  Run this file:  node nonce-demo.js
 *
 *  We'll explore:
 *   1. Mining Nonce (PoW recap)
 *   2. Account/Transaction Nonce (replay attack prevention)
 *   3. Why replaying a transaction fails
 *   4. Why order matters
 */

const crypto = require("crypto");

function sha256(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function section(title) {
  console.log("\n" + "=".repeat(60));
  console.log(`  ${title}`);
  console.log("=".repeat(60));
}

// ─────────────────────────────────────────────────────────
//  1. MINING NONCE (Quick recap)
// ─────────────────────────────────────────────────────────
section("1. Mining Nonce (PoW — you already know this)");

console.log('  The mining nonce is a number you iterate to find');
console.log('  a block hash starting with "000..."');
console.log('  Used in: Bitcoin (still), Ethereum (before Sep 2022)');
console.log('  NOT used in: Ethereum today (Proof of Stake)');

// Quick demo
const blockData = "Block #100 Transactions";
let miningNonce = 0;
while (!sha256(blockData + miningNonce).startsWith("000")) {
  miningNonce++;
}
console.log(`\n  Found valid hash after ${miningNonce} tries:`);
console.log(`  Nonce: ${miningNonce}`);
console.log(`  Hash:  ${sha256(blockData + miningNonce)}`);

// ─────────────────────────────────────────────────────────
//  2. ACCOUNT NONCE — The Transaction Counter
// ─────────────────────────────────────────────────────────
section("2. Account Nonce — Your Transaction Counter");

// Simulate an Ethereum account
const account = {
  address: "0xSnehashis123...",
  balance: 10, // 10 ETH
  nonce: 0,    // No transactions sent yet
};

console.log(`  Account: ${account.address}`);
console.log(`  Balance: ${account.balance} ETH`);
console.log(`  Nonce:   ${account.nonce} (no transactions yet)\n`);

// Simulate sending transactions
const transactions = [
  { to: "Alice", amount: 1, nonce: 0 },
  { to: "Bob",   amount: 2, nonce: 1 },
  { to: "Charlie", amount: 0.5, nonce: 2 },
];

console.log("  Sending 3 transactions:\n");

for (const tx of transactions) {
  console.log(`  📤 Tx: "Send ${tx.amount} ETH to ${tx.to}" (nonce: ${tx.nonce})`);
  
  if (tx.nonce !== account.nonce) {
    console.log(`     ❌ REJECTED! Expected nonce ${account.nonce}, got ${tx.nonce}`);
  } else if (tx.amount > account.balance) {
    console.log(`     ❌ REJECTED! Insufficient balance`);
  } else {
    account.balance -= tx.amount;
    account.nonce++;
    console.log(`     ✅ EXECUTED! Balance: ${account.balance} ETH, Next nonce: ${account.nonce}`);
  }
  console.log();
}

// ─────────────────────────────────────────────────────────
//  3. REPLAY ATTACK PREVENTION
// ─────────────────────────────────────────────────────────
section("3. Replay Attack — Why It Fails With Nonces");

console.log("  Bob received 2 ETH. He tries to REPLAY the transaction\n");
console.log("  ---- Bob's Attack Attempt ----");

const replayedTx = { to: "Bob", amount: 2, nonce: 1 }; // Same nonce as before

console.log(`  📤 Replayed Tx: "Send ${replayedTx.amount} ETH to ${replayedTx.to}" (nonce: ${replayedTx.nonce})`);
console.log(`     Account's current nonce: ${account.nonce}`);

if (replayedTx.nonce !== account.nonce) {
  console.log(`     ❌ REJECTED! Network says: "Nonce ${replayedTx.nonce} already used."`);
  console.log(`     Expected nonce: ${account.nonce}`);
  console.log(`\n  🛡️ Replay attack FAILED. Snehashis's funds are safe.`);
} else {
  console.log(`     ✅ Would execute (but this won't happen)`);
}

// ─────────────────────────────────────────────────────────
//  4. OUT-OF-ORDER TRANSACTIONS
// ─────────────────────────────────────────────────────────
section("4. Transaction Ordering — Nonces Enforce Sequence");

console.log(`  Current account nonce: ${account.nonce}\n`);

// Try sending nonce 5 before nonce 3
const outOfOrderTxs = [
  { to: "Dave", amount: 1, nonce: 5, label: "Skipping ahead" },
  { to: "Eve",  amount: 1, nonce: 3, label: "Correct next nonce" },
  { to: "Frank", amount: 1, nonce: 4, label: "After nonce 3" },
];

for (const tx of outOfOrderTxs) {
  console.log(`  📤 Tx to ${tx.to} (nonce: ${tx.nonce}) — ${tx.label}`);
  
  if (tx.nonce !== account.nonce) {
    if (tx.nonce > account.nonce) {
      console.log(`     ⏳ QUEUED. Waiting for nonce ${account.nonce} first.`);
    } else {
      console.log(`     ❌ REJECTED. Nonce already used.`);
    }
  } else {
    account.balance -= tx.amount;
    account.nonce++;
    console.log(`     ✅ EXECUTED! Balance: ${account.balance} ETH, Next nonce: ${account.nonce}`);
  }
  console.log();
}

// ─────────────────────────────────────────────────────────
section("📝 KEY TAKEAWAYS — The Two Nonces");

console.log(`
  MINING NONCE (PoW):
  • A random number iterated to find a valid block hash
  • Used by miners/validators to produce new blocks
  • Relevant in Proof of Work (Bitcoin, old Ethereum)

  ACCOUNT NONCE (Transaction counter):
  • A counter on YOUR account: 0, 1, 2, 3...
  • Increments with every transaction you send
  • Prevents REPLAY ATTACKS (can't rebroadcast old transactions)
  • Enforces ORDER (nonce 5 can't execute before nonce 4)
  • Included in every transaction you sign

  SAME WORD, COMPLETELY DIFFERENT PURPOSE.
  When someone says "nonce" in Web3, ask: mining or account?

  ─────────────────────────────────────────────────────
  🎉 Phase 1.1 COMPLETE — Cryptographic Primitives!
  
  You now understand:
  ✅ Hash Functions (SHA-256, Keccak-256, properties)
  ✅ Merkle Trees (building, proofs, verification)
  ✅ Public Key Cryptography (keys, signatures, verification)
  ✅ The Two Nonces (mining vs account)
  
  Next: Phase 1.2 — Blockchain Architecture
  (How blocks, chains, consensus, and forks actually work)
  ─────────────────────────────────────────────────────
`);
