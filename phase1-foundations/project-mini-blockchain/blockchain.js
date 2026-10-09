const crypto = require("crypto");

// Helper function to calculate SHA-256 hash
function calculateSHA256(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

class Transaction {
  /**
   * @param {string} fromAddress
   * @param {string} toAddress
   * @param {number} amount
   */
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
    this.timestamp = Date.now();
  }

  /**
   * Calculate the hash of this transaction.
   * This is what we will sign.
   */
  calculateHash() {
    return calculateSHA256(this.fromAddress + this.toAddress + this.amount + this.timestamp);
  }
}

class Block {
  /**
   * @param {number} index
   * @param {Transaction[]} transactions
   * @param {string} previousHash
   */
  constructor(index, transactions, previousHash = "") {
    this.index = index;
    this.timestamp = Date.now();
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.nonce = 0;

    // Calculate Merkle Root
    this.merkleRoot = this.calculateMerkleRoot();

    // Calculate the block's initial hash
    this.hash = this.calculateHash();
  }

  /**
   * Calculate the block hash based on the header fields:
   * index, timestamp, previousHash, merkleRoot, and nonce.
   */
  calculateHash() {

    return calculateSHA256(
      this.index + this.timestamp + this.previousHash + this.merkleRoot + this.nonce
    );
  }

  /**
   * Calculate the Merkle Root of all transactions in this block.
   */
  calculateMerkleRoot() {
    if (this.transactions.length === 0) {
      return calculateSHA256("empty_block");
    }

    let hashes = this.transactions.map((tx) => tx.calculateHash());

    while (hashes.length > 1) {
      const nextLevel = [];
      for (let i = 0; i < hashes.length; i += 2) {
        const left = hashes[i];
        const right = hashes[i + 1] || hashes[i]; // duplicate if odd
        nextLevel.push(calculateSHA256(left + right));
      }
      hashes = nextLevel;
    }

    return hashes[0];
  }

  /**
   * Mine the block by finding a hash that starts with a certain number of zeros.
   * @param {number} difficulty
   */
  mineBlock(difficulty) {
    const target = "0".repeat(difficulty);

    while (!this.hash.startsWith(target)) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log(`Block mined: ${this.hash}`);
  }
}

class Blockchain {
  constructor(difficulty = 2) {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = difficulty;
    this.pendingTransactions = [];
    this.miningReward = 100; // Reward for mining a block
  }

  createGenesisBlock() {
    const genesisBlock = new Block(0, [new Transaction("SYSTEM", "Genesis", 0)], "0");
    return genesisBlock;
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  /**
   * Add a new transaction to the pool of pending transactions.
   * @param {Transaction} transaction
   */
  addTransaction(transaction) {
    if (transaction.amount <= 0) {
      throw new Error("Transaction amount must be greater than 0");
    }
    if (transaction.fromAddress === transaction.toAddress) {
      throw new Error("Cannot send transactions to yourself");
    }
    this.pendingTransactions.push(transaction);
  }

  /**
   * Mine the pending transactions, reward the miner, and add the block to the chain.
   * @param {string} miningRewardAddress
   */
  minePendingTransactions(miningRewardAddress) {
    const block = new Block(
      this.chain.length,
      this.pendingTransactions,
      this.getLatestBlock().hash
    );
    block.mineBlock(this.difficulty);

    this.chain.push(block);

    this.pendingTransactions = [
      new Transaction("SYSTEM", miningRewardAddress, this.miningReward)
    ];
  }

  /**
   * Get the balance of an address by scanning all transactions in the chain.
   * @param {string} address
   */
  getBalanceOfAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const tx of block.transactions) {
        if (tx.fromAddress === address) {
          balance -= tx.amount;
        }
        if (tx.toAddress === address) {
          balance += tx.amount;
        }
      }
    }

    return balance;
  }

  /**
   * Validate the integrity of the blockchain.
   */
  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Verify current block's hash is correct
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      // Verify current block points to previous block's hash correctly
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }

      // Verify the hash meets the difficulty target
      if (!currentBlock.hash.startsWith("0".repeat(this.difficulty))) {
        return false;
      }

      // Verify the Merkle Root matches the transactions inside the block
      if (currentBlock.merkleRoot !== currentBlock.calculateMerkleRoot()) {
        return false;
      }
    }
    return true;
  }
}

module.exports = { Blockchain, Block, Transaction };
