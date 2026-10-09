const { Blockchain, Transaction } = require("./blockchain");

console.log("🚀 Testing your Mini Blockchain implementation...\n");

const myCoin = new Blockchain(2); // Set low difficulty for fast testing

// Test 1: Adding transactions
console.log("Step 1: Adding transactions...");
myCoin.addTransaction(new Transaction("address1", "address2", 100));
myCoin.addTransaction(new Transaction("address2", "address1", 50));

// Test 2: Mining the block
console.log("\nStep 2: Mining pending transactions...");
myCoin.minePendingTransactions("miner-address");

// Verify balances
console.log(`Balance of address1: ${myCoin.getBalanceOfAddress("address1")}`);
console.log(`Balance of address2: ${myCoin.getBalanceOfAddress("address2")}`);
console.log(`Balance of miner:    ${myCoin.getBalanceOfAddress("miner-address")}`);

// Test 3: Mining another block
console.log("\nStep 3: Mining second block (to claim reward)...");
myCoin.minePendingTransactions("miner-address");
console.log(`Balance of miner:    ${myCoin.getBalanceOfAddress("miner-address")}`);

// Test 4: Chain validity
console.log(`\nIs blockchain valid? ${myCoin.isChainValid() ? "✅ Yes" : "❌ No"}`);

// Test 5: Tamper detection
console.log("\nStep 4: Attempting to tamper with transactions...");
myCoin.chain[1].transactions[0].amount = 1000; // Tamper!

console.log(`Is blockchain valid after tampering? ${myCoin.isChainValid() ? "✅ Yes (Oops, validation failed!)" : "❌ No (Success! Tampering detected)"}`);
