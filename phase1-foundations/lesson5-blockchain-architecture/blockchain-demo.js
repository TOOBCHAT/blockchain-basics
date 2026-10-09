/**
 * ==========================================================
 *  LESSON 5: Blockchain Architecture — Build a Mini Blockchain
 * ==========================================================
 *
 *  Run this file:  node blockchain-demo.js
 *
 *  We build a simplified blockchain combining ALL Phase 1 concepts:
 *   1. Block structure (header + body)
 *   2. Chain linking (previousHash)
 *   3. Merkle Root computation
 *   4. Proof of Work mining
 *   5. Chain validation (tamper detection)
 *   6. Fork simulation
 */

const crypto = require("crypto");
function sha256(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

function section(title) {
  console.log("\n" + "=".repeat(60));
  console.log(`  ${title}`);
  console.log("=".repeat(60));
}
// ─────────────────────────────────────────────────────────
//  TRANSACTION CLASS
// ─────────────────────────────────────────────────────────
class Transaction {
  constructor(from, to, amount) {
    this.from = from;
    this.to = to;
    this.amount = amount;
    this.timestamp = Date.now();
  }

  toString() {
    return `${this.from} → ${this.to}: ${this.amount} ETH`;
  }
}

// ─────────────────────────────────────────────────────────
//  BLOCK CLASS
// ─────────────────────────────────────────────────────────
class Block {
  constructor(index, transactions, previousHash = "") {
    // ---- HEADER ----
    this.index = index;
    this.timestamp = Date.now();
    this.previousHash = previousHash;
    this.merkleRoot = this.computeMerkleRoot(transactions);
    this.nonce = 0;
    this.hash = "";

    // ---- BODY ----
    this.transactions = transactions;
  }

  // Compute Merkle Root from transactions (Lesson 2!)
  computeMerkleRoot(transactions) {
    if (transactions.length === 0) return sha256("empty");

    let hashes = transactions.map((tx) => sha256(tx.toString()));

    while (hashes.length > 1) {
      const nextLevel = [];
      for (let i = 0; i < hashes.length; i += 2) {
        const left = hashes[i];
        const right = hashes[i + 1] || hashes[i]; // duplicate if odd
        nextLevel.push(sha256(left + right));
      }
      hashes = nextLevel;
    }

    return hashes[0];
  }

  // Compute block hash from header fields only
  computeHash() {
    const headerData =
      this.index +
      this.timestamp +
      this.previousHash +
      this.merkleRoot +
      this.nonce;
    return sha256(headerData);
  }

  // Mine the block — find a nonce that produces a valid hash (Lesson 1!)
  mine(difficulty) {
    const target = "0".repeat(difficulty);
    const startTime = Date.now();

    while (true) {
      this.hash = this.computeHash();
      if (this.hash.startsWith(target)) {
        const elapsed = Date.now() - startTime;
        console.log(
          `  ⛏️  Block #${this.index} mined in ${elapsed}ms (${this.nonce.toLocaleString()} attempts)`
        );
        console.log(`     Hash: ${this.hash}`);
        return;
      }
      this.nonce++;
    }
  }

  // Pretty print
  print() {
    console.log(`  ┌─────────────────────────────────────────┐`);
    console.log(`  │  BLOCK #${this.index}                              │`);
    console.log(`  ├──────────── HEADER ─────────────────────┤`);
    console.log(`  │  PrevHash:   ${this.previousHash.substring(0, 20)}...│`);
    console.log(`  │  MerkleRoot: ${this.merkleRoot.substring(0, 20)}...│`);
    console.log(`  │  Nonce:      ${String(this.nonce).padEnd(25)}│`);
    console.log(`  │  Hash:       ${this.hash.substring(0, 20)}...│`);
    console.log(`  ├──────────── BODY ───────────────────────┤`);
    this.transactions.forEach((tx) => {
      const txStr = tx.toString();
      console.log(`  │  ${txStr.substring(0, 39).padEnd(39)}│`);
    });
    console.log(`  └─────────────────────────────────────────┘`);
  }
}

// ─────────────────────────────────────────────────────────
//  BLOCKCHAIN CLASS                                        
// ─────────────────────────────────────────────────────────
class Blockchain {
  constructor(difficulty = 3) {
    this.difficulty = difficulty;
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    const genesis = new Block(0, [new Transaction("SYSTEM", "Genesis", 0)], "0".repeat(64));
    genesis.hash = genesis.computeHash();
    return genesis;
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(transactions) {
    const newBlock = new Block(
      this.chain.length,
      transactions,
      this.getLatestBlock().hash
    );
    console.log(`\n  Mining block #${newBlock.index} with ${transactions.length} transactions...`);
    newBlock.mine(this.difficulty);
    this.chain.push(newBlock);
    return newBlock;
  }

  // Validate the entire chain — check every link
  isValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];

      // Check 1: Does the stored hash match a fresh computation?
      if (current.hash !== current.computeHash()) {
        return { valid: false, error: `Block #${i}: hash has been tampered` };
      }

      // Check 2: Does previousHash actually point to the previous block?
      if (current.previousHash !== previous.hash) {
        return { valid: false, error: `Block #${i}: chain link broken (previousHash mismatch)` };
      }

      // Check 3: Does the hash meet the difficulty target?
      if (!current.hash.startsWith("0".repeat(this.difficulty))) {
        return { valid: false, error: `Block #${i}: hash doesn't meet difficulty` };
      }
    }
    return { valid: true, error: null };
  }
}

// ═════════════════════════════════════════════════════════
//  DEMO
// ═════════════════════════════════════════════════════════

section("1. Creating a Blockchain & Mining Blocks");

const blockchain = new Blockchain(3); // difficulty = 3 leading zeros
console.log("  Genesis block created.\n");

// Add Block 1
blockchain.addBlock([
  new Transaction("Alice", "Bob", 5),
  new Transaction("Bob", "Charlie", 2),
]);

// Add Block 2
blockchain.addBlock([
  new Transaction("Charlie", "Dave", 1),
  new Transaction("Eve", "Frank", 3),
  new Transaction("Grace", "Heidi", 0.5),
]);

// Add Block 3
blockchain.addBlock([
  new Transaction("Dave", "Alice", 4),
  new Transaction("Frank", "Bob", 1.5),
]);

// ─────────────────────────────────────────────────────────
section("2. The Complete Chain");

blockchain.chain.forEach((block) => {
  block.print();
  if (block.index < blockchain.chain.length - 1) {
    console.log("       │");
    console.log("       ▼  (previousHash links to next block)");
  }
  console.log();
});

// ─────────────────────────────────────────────────────────
section("3. Chain Validation");

const result1 = blockchain.isValid();
console.log(`  Is blockchain valid? ${result1.valid ? "✅ YES — all links intact" : "❌ NO"}`);

// ─────────────────────────────────────────────────────────
section("4. Tampering Attack — Changing a Transaction");

console.log('  Attacker changes Block #1 transaction:');
console.log('  "Alice → Bob: 5 ETH"  →  "Alice → Bob: 500 ETH"\n');

// Tamper with block 1's transaction
blockchain.chain[1].transactions[0] = new Transaction("Alice", "Bob", 500);
// Recalculate the merkle root (attacker tries to fix the block)
blockchain.chain[1].merkleRoot = blockchain.chain[1].computeMerkleRoot(
  blockchain.chain[1].transactions
);

const result2 = blockchain.isValid();
console.log(`  Is blockchain valid? ${result2.valid ? "✅ YES" : `❌ NO — ${result2.error}`}`);
console.log('\n  The attacker changed the transaction, which changed the');
console.log('  Merkle Root, which changed the block hash.');
console.log('  But the STORED hash still has the old value → mismatch!');
console.log('  Even if the attacker recomputes the hash, Block #2\'s');
console.log('  previousHash won\'t match → the chain is broken.');

// ─────────────────────────────────────────────────────────
section("5. Fork Simulation");

console.log("  Simulating a fork: two miners find Block #4 simultaneously\n");

// Restore chain (create a fresh one for fork demo)
const forkChain = new Blockchain(2); // lower difficulty for speed
forkChain.addBlock([new Transaction("Alice", "Bob", 1)]);
forkChain.addBlock([new Transaction("Bob", "Charlie", 2)]);

const parentBlock = forkChain.getLatestBlock();
console.log(`\n  Parent block hash: ${parentBlock.hash.substring(0, 20)}...`);
console.log("  Two miners racing to build on top of it:\n");

// Miner A's block
const minerATxs = [new Transaction("Dave", "Eve", 3)];
const blockA = new Block(forkChain.chain.length, minerATxs, parentBlock.hash);
console.log("  --- Miner A ---");
blockA.mine(2);

// Miner B's block (different transactions, same parent)
const minerBTxs = [new Transaction("Frank", "Grace", 4)];
const blockB = new Block(forkChain.chain.length, minerBTxs, parentBlock.hash);
console.log("\n  --- Miner B ---");
blockB.mine(2);

console.log(`\n  Both blocks are valid and point to the same parent!`);
console.log(`  Block A hash: ${blockA.hash.substring(0, 20)}...`);
console.log(`  Block B hash: ${blockB.hash.substring(0, 20)}...`);
console.log(`  Both have previousHash: ${parentBlock.hash.substring(0, 20)}...`);
console.log(`\n  ⚔️  FORK! The network is temporarily split.`);
console.log(`  Resolution: whichever chain gets the NEXT block first wins.`);
console.log(`  The other block becomes "orphaned" — its transactions`);
console.log(`  go back to the mempool to be included in a future block.`);

// ─────────────────────────────────────────────────────────
section("📝 PHASE 1.2 KEY TAKEAWAYS");

console.log(`
  BLOCK STRUCTURE:
  • Header: previousHash, merkleRoot, timestamp, nonce, hash
  • Body: list of signed transactions

  CHAIN INTEGRITY:
  • Each block's previousHash = hash of the block before it
  • Tamper with ANY block → all subsequent blocks break
  • Attacker must re-mine every block after the tampered one

  CONSENSUS:
  • PoW: Race to find a valid hash. Winner gets block reward.
  • PoS: Validators stake money. Random selection. Cheaters get slashed.
  
  FORKS:
  • Happen when two valid blocks appear simultaneously
  • Longest chain wins. Orphaned blocks are discarded.
  • This is why you wait for "confirmations"

  FINALITY:
  • PoW: ~60 min (6 confirmations) for practical finality
  • PoS: ~13 min for deterministic finality on Ethereum

  ────────────────────────────────────────────────────
  🎉 PHASE 1 ALMOST COMPLETE!
  
  Remaining: Phase 1.3 — Build a Mini Blockchain Project
  (We'll combine everything into one polished codebase)
  ────────────────────────────────────────────────────
`);
