/**
 * ==========================================================
 *  LESSON 3: Public Key Cryptography & Digital Signatures
 * ==========================================================
 *
 *  Run this file:  node wallet-demo.js
 *
 *  We'll explore:
 *   1. Generating a SECP256K1 Keypair (Same curve as Bitcoin/Ethereum)
 *   2. Deriving an Ethereum-style address from the Public Key
 *   3. Signing a transaction with the Private Key
 *   4. Verifying the signature with the Public Key
 *   5. Attempting to tamper with a signed transaction
 */

const crypto = require("crypto");

function section(title) {
  console.log("\n" + "=".repeat(60));
  console.log(`  ${title}`);
  console.log("=".repeat(60));
}

// ─────────────────────────────────────────────────────────
//  1. KEY GENERATION
// ─────────────────────────────────────────────────────────
section("1. Generating SECP256K1 Keypair");

// secp256k1 is the exact elliptic curve used by Bitcoin and Ethereum
const { privateKey, publicKey } = crypto.generateKeyPairSync("ec", {
  namedCurve: "secp256k1",
});

// Format keys as Hex strings for display
const privateKeyHex = privateKey.export({ type: "pkcs8", format: "der" }).toString("hex");
const publicKeyHex = publicKey.export({ type: "spki", format: "der" }).toString("hex");

console.log(`🔑 Private Key (Keep Secret!): \n   ${privateKeyHex.substring(0, 64)}...`);
console.log(`\n🔓 Public Key (Safe to Share): \n   ${publicKeyHex.substring(0, 64)}...`);

// ─────────────────────────────────────────────────────────
//  2. DERIVING AN ADDRESS
// ─────────────────────────────────────────────────────────
section("2. Deriving a Mock Ethereum Address");

// Ethereum derives addresses by:
// 1. Getting the uncompressed raw public key (excluding the prefix byte)
// 2. Hashing it with Keccak-256
// 3. Taking the last 20 bytes (40 hex characters) of the hash
const rawPublicKey = publicKey.export({ type: "spki", format: "der" });
const pubKeyHash = crypto.createHash("sha3-256").update(rawPublicKey).digest("hex");
const mockEthAddress = "0x" + pubKeyHash.substring(pubKeyHash.length - 40);

console.log(`👉 Raw Public Key Hash:  ${pubKeyHash}`);
console.log(`👉 Derived Wallet Address: ${mockEthAddress}`);

// ─────────────────────────────────────────────────────────
//  3. SIGNING A TRANSACTION
// ─────────────────────────────────────────────────────────
section("3. Signing a Transaction");

const transactionData = {
  from: mockEthAddress,
  to: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  amount: "1.5 ETH",
  nonce: 0 // Account transaction nonce to prevent replay attacks
};

const txString = JSON.stringify(transactionData);
console.log(`📝 Transaction Details:\n   ${txString}`);

// Sign the transaction using the Private Key
const sign = crypto.createSign("SHA256");
sign.update(txString);
const signature = sign.sign(privateKey, "hex");

console.log(`\n✍️ Generated Digital Signature:\n   ${signature.substring(0, 64)}...`);

// ─────────────────────────────────────────────────────────
//  4. VERIFICATION
// ─────────────────────────────────────────────────────────
section("4. Verifying the Signature (The Network's Job)");

// The network receives: The transaction, the signature, and the public key
const verify = crypto.createVerify("SHA256");
verify.update(txString);
const isSignatureValid = verify.verify(publicKey, signature, "hex");

console.log(`🔍 Is the transaction authentic and untampered? ${isSignatureValid ? "✅ YES" : "❌ NO"}`);

// ─────────────────────────────────────────────────────────
//  5. TAMPER DETECTION
// ─────────────────────────────────────────────────────────
section("5. Tampering with the Signed Transaction");

// What if an attacker intercepts the transaction and tries to change the amount?
const tamperedTxData = {
  ...transactionData,
  amount: "150 ETH" // Changed from 1.5 to 150 ETH!
};
const tamperedTxString = JSON.stringify(tamperedTxData);

console.log(`😈 Tampered Transaction Details:\n   ${tamperedTxString}`);

// The validator attempts to verify the original signature against the tampered transaction
const verifyTamper = crypto.createVerify("SHA256");
verifyTamper.update(tamperedTxString);
const isTamperedValid = verifyTamper.verify(publicKey, signature, "hex");

console.log(`\n🔍 Did the signature match the altered data? ${isTamperedValid ? "✅ YES" : "❌ NO (Signature Rejected!)"}`);
console.log("\n👆 The signature broke because the message was altered after signing!");
