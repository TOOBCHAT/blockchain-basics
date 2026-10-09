/**
 * ==========================================================
 *  LESSON 2: Merkle Trees — Build One From Scratch
 * ==========================================================
 *
 *  Run this file:  node merkle-demo.js
 *
 *  We'll build:
 *   1. A Merkle Tree from transactions
 *   2. A Merkle Proof (prove a transaction exists)
 *   3. Verification (verify the proof without all data)
 *   4. Tamper detection (what happens if you change a tx?)
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
//  MERKLE TREE CLASS
// ─────────────────────────────────────────────────────────

class MerkleTree {
  constructor(transactions) {
    // Store original transactions
    this.transactions = transactions;

    // Step 1: Hash each transaction → these are our leaf nodes
    this.leaves = transactions.map((tx) => sha256(tx));

    // Step 2: Build the tree layer by layer
    this.layers = [this.leaves]; // layers[0] = leaf hashes
    this._buildTree();
  }

  _buildTree() {
    let currentLayer = this.leaves;

    while (currentLayer.length > 1) {
      const nextLayer = [];

      for (let i = 0; i < currentLayer.length; i += 2) {
        const left = currentLayer[i];
        // If odd number of nodes, duplicate the last one
        const right = currentLayer[i + 1] || currentLayer[i];

        // Combine and hash the pair
        const parentHash = sha256(left + right);
        nextLayer.push(parentHash);
      }

      this.layers.push(nextLayer);
      currentLayer = nextLayer;
    }
  }

  // The Merkle Root — the single hash at the top
  getRoot() {
    const topLayer = this.layers[this.layers.length - 1];
    return topLayer[0];
  }

  // Generate a Merkle Proof for a given transaction index
  // Returns an array of { hash, position } objects
  getProof(index) {
    const proof = [];
    let currentIndex = index;

    for (let layer = 0; layer < this.layers.length - 1; layer++) {
      const currentLayer = this.layers[layer];
      const isRightNode = currentIndex % 2 === 1;
      const siblingIndex = isRightNode ? currentIndex - 1 : currentIndex + 1;

      if (siblingIndex < currentLayer.length) {
        proof.push({
          hash: currentLayer[siblingIndex],
          position: isRightNode ? "left" : "right",
        });
      }

      // Move up to the parent index
      currentIndex = Math.floor(currentIndex / 2);
    }

    return proof;
  }

  // Verify a proof: given a transaction, its proof, and the expected root
  static verify(transaction, proof, expectedRoot) {
    let computedHash = sha256(transaction);

    for (const step of proof) {
      if (step.position === "left") {
        // Sibling is on the LEFT, so it comes first
        computedHash = sha256(step.hash + computedHash);
      } else {
        // Sibling is on the RIGHT, so we come first
        computedHash = sha256(computedHash + step.hash);
      }
    }

    return computedHash === expectedRoot;
  }

  // Pretty print the tree
  printTree() {
    console.log("\n  Tree structure (bottom to top):\n");
    this.layers.forEach((layer, i) => {
      const label =
        i === 0
          ? "Leaves (tx hashes)"
          : i === this.layers.length - 1
          ? "ROOT"
          : `Layer ${i}`;
      console.log(`  [${label}]`);
      layer.forEach((hash, j) => {
        console.log(`    ${j}: ${hash.substring(0, 16)}...`);
      });
      console.log();
    });
  }
}

// ─────────────────────────────────────────────────────────
//  DEMO 1: Build a Merkle Tree
// ─────────────────────────────────────────────────────────
section("1. Building a Merkle Tree from Transactions");

const transactions = [
  "Alice sends 5 ETH to Bob",
  "Bob sends 2 ETH to Charlie",
  "Charlie sends 1 ETH to Dave",
  "Dave sends 3 ETH to Eve",
];

console.log("  Transactions:");
transactions.forEach((tx, i) => console.log(`    ${i}: "${tx}"`));

const tree = new MerkleTree(transactions);
tree.printTree();

console.log(`  ✅ Merkle Root: ${tree.getRoot()}`);
console.log(
  "\n  👆 This single root hash represents ALL 4 transactions."
);
console.log("     It's stored in the block header.");

// ─────────────────────────────────────────────────────────
//  DEMO 2: Generate and Verify a Merkle Proof
// ─────────────────────────────────────────────────────────
section('2. Merkle Proof — Prove "Charlie sends 1 ETH to Dave" exists');

const txIndex = 2; // Charlie's transaction
const txToProve = transactions[txIndex];
const proof = tree.getProof(txIndex);
const root = tree.getRoot();

console.log(`  Transaction: "${txToProve}"`);
console.log(`  Transaction index: ${txIndex}`);
console.log(`\n  Proof (the sibling hashes needed):`);
proof.forEach((step, i) => {
  console.log(`    Step ${i + 1}: ${step.hash.substring(0, 16)}... (${step.position} sibling)`);
});

console.log(`\n  Proof size: ${proof.length} hashes`);
console.log(`  Total transactions: ${transactions.length}`);
console.log(
  `  Efficiency: Only need ${proof.length} hashes instead of ${transactions.length} transactions!`
);

// Now verify
const isValid = MerkleTree.verify(txToProve, proof, root);
console.log(`\n  Verification result: ${isValid ? "✅ VALID — Transaction is in the block!" : "❌ INVALID"}`);

console.log(`
  👆 HOW THIS WORKED:
  1. We hashed Charlie's transaction
  2. Combined it with its sibling hash (Dave's tx hash)
  3. Combined that result with the other sibling
  4. Got a root hash that MATCHES the block's Merkle Root
  
  We proved the transaction exists using only ${proof.length} extra hashes!
  For a block with 1,000,000 transactions, we'd need only ~20 hashes.`);

// ─────────────────────────────────────────────────────────
//  DEMO 3: Tamper Detection
// ─────────────────────────────────────────────────────────
section("3. Tamper Detection — What if someone changes a transaction?");

console.log('  Original tx: "Alice sends 5 ETH to Bob"');
console.log('  Tampered tx: "Alice sends 500 ETH to Bob"\n');

// Try to verify a tampered transaction with the original proof
const tamperedTx = "Alice sends 500 ETH to Bob";
const aliceProof = tree.getProof(0);
const tamperedResult = MerkleTree.verify(tamperedTx, aliceProof, root);

console.log(
  `  Verify tampered tx: ${tamperedResult ? "✅ VALID" : "❌ INVALID — Tampering detected!"}`
);

// Build what the root WOULD be with the tampered transaction
const tamperedTransactions = [...transactions];
tamperedTransactions[0] = tamperedTx;
const tamperedTree = new MerkleTree(tamperedTransactions);

console.log(`\n  Original Merkle Root:  ${root.substring(0, 32)}...`);
console.log(`  Tampered Merkle Root:  ${tamperedTree.getRoot().substring(0, 32)}...`);
console.log(`  Match? ${root === tamperedTree.getRoot() ? "YES" : "❌ NO — Completely different!"}`);

console.log(`
  👆 Changing "5 ETH" to "500 ETH" in ONE transaction
     produced a COMPLETELY different Merkle Root.
     Everyone in the network would instantly see the mismatch.`);

// ─────────────────────────────────────────────────────────
//  DEMO 4: Scaling — How Merkle Trees Handle Large Blocks
// ─────────────────────────────────────────────────────────
section("4. Scaling — Proof Size vs Transaction Count");

console.log("  Tx Count  │  Tree Layers  │  Proof Size (hashes needed)");
console.log("  ──────────┼───────────────┼────────────────────────────");

[4, 16, 256, 1024, 65536, 1048576].forEach((count) => {
  const layers = Math.ceil(Math.log2(count));
  console.log(
    `  ${count.toLocaleString().padStart(9)} │  ${String(layers + 1).padStart(11)} │  ${layers} hashes`
  );
});

console.log(`
  👆 With 1 MILLION transactions, you only need 20 hashes to prove
     any single transaction exists. That's log₂(n) efficiency.
     
     This is why LIGHT CLIENTS (phone wallets) can work!
     They download block headers (which contain the Merkle Root)
     and request Merkle Proofs for their own transactions.
     No need to download the entire blockchain.`);

// ─────────────────────────────────────────────────────────
section("📝 KEY TAKEAWAYS");

console.log(`
  1. Merkle Trees hash transactions in pairs, up to a single ROOT
  2. The Merkle Root is stored in the block header
  3. Merkle Proofs let you verify a tx exists with just log₂(n) hashes
  4. Changing ANY transaction changes the root — tamper detection
  5. This enables LIGHT CLIENTS — wallets that don't need the full blockchain
  
  Real-world use:
  • Bitcoin: Every block header has a Merkle Root of its transactions
  • Ethereum: Uses a modified Merkle Patricia Trie (more complex, same idea)
  • Git: Uses Merkle trees for tracking file changes (you've been using them!)
  
  Next up: PUBLIC KEY CRYPTOGRAPHY — digital signatures, 
  how wallets work, and how you prove you own your crypto!
`);
