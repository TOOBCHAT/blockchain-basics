# 🌊 Solana Mastery Roadmap — Revised (Client-First, Rust-Last)

## Your Profile
| Area | Level |
|------|-------|
| DSA (C++) | ✅ Striver sheet done |
| JavaScript / Node / Express | ✅ Solid |
| React | ✅ Can read & write |
| TypeScript | 🟡 Basic — levels up in Phase 3 |
| Blockchain Foundations | ✅ Phase 1 done |
| Solana Architecture | ⬜ Phase 2 (next) |
| Rust | ❌ Saved for Phase 7 (intentionally) |

---

## Why This Order Works

```
Know React/JS well?  →  Start on the client side
                     →  Build real dApps immediately (wallets, launchpads, dashboards)
                     →  Understand what programs expose
                     →  THEN learn to write programs in Rust
                     →  Rust learning has full context → sticks better
```

---

## The Revised Phase Map

```
Phase 1             Phase 2         Phase 3              Phase 4
Foundations    →    Solana Arch     Client-Side          DeFi, NFT &
(Done/Review)       & Ecosystem  →  Deep Dive        →   dApp Building
                    ~1 week         ~3 weeks             ~2.5 weeks

Phase 5             Phase 6         Phase 7              Phase 8
Anchor IDL          Full-Stack      Rust Core            Native Solana
Consumer +     →    Portfolio   →   (Now with       →    Programs
dApp Patterns       (no Rust)       context!)
~2 weeks            ~3 weeks        ~3 weeks              ~2 weeks

Phase 9
Anchor Framework
+ Advanced Programs
+ Production dApps
+ Final Portfolio
~4-5 weeks
```

---

## Phase 1 — Cryptography & Blockchain Foundations
> **Status**: Completed / Under Review | **Goal**: Solidify cryptographic primitives before applying them to Solana

### Core Topics
- **Hashing (Lesson 1)**: Cryptographic hash functions (SHA-256), collision resistance, pre-image resistance.
- **Merkle Trees (Lesson 2)**: Merkle roots, Merkle proofs, verification, and scalability in storing state.
- **Asymmetric Cryptography (Lesson 3)**: Public/private keypairs, signing transactions, verification (Secp256k1 vs Ed25519).
- **Nonces & Mining (Lesson 4)**: Proof of Work mechanics, preventing double-spend, replay attacks.
- **Blockchain Architecture (Lesson 5)**: Blocks, chain of headers, distributed ledger consensus.
- **Mini-Blockchain Project**: Implementation of a basic blockchain in Node.js/JS.

---

## Phase 2 — Solana Architecture & Ecosystem
> **Duration**: ~1 week | **~4-5 hrs/day**

### Core Topics
- Proof of History (PoH) — Solana's cryptographic clock
- The Account Model — everything is an account (programs, data, wallets)
- Programs vs Accounts mental model (vs EVM's contract storage)
- Validators, Slots, Epochs, Leaders — how consensus works
- Anatomy of a Solana transaction: fee payer, instructions, signers
- Rent & storage fees — how SOL is used
- Compute Units (CUs) — Solana's "gas"
- SPL Token Program — what it is and why every token uses it
- Associated Token Accounts (ATAs) — why they exist
- Solana ecosystem map: Phantom, Jupiter, Raydium, Metaplex, Jito, Helius, Tensor

### Wallet Deep Dive (Theory)
- How Solana wallets work (Ed25519 keypairs)
- HD wallet derivation paths for Solana (BIP44: m/44'/501'/...)
- Types of wallets: hot wallets, hardware wallets, multisig (Squads)
- How wallet extensions inject into the browser (the `window.solana` era → wallet standard)

### Deliverables
- [ ] Set up Solana CLI + Phantom wallet + Backpack wallet
- [ ] Airdrop SOL on devnet, inspect tx on Solana Explorer & Solscan
- [ ] Diagram: lifecycle of a Solana transaction (draw it yourself)
- [ ] Diagram: Account model vs EVM storage model comparison
- [ ] Explore 5 real mainnet transactions and explain each instruction

---

## Phase 3 — Solana Client-Side Deep Dive ⚡
> **Duration**: ~3 weeks | **Your React/JS skills SHINE here**

### Week 1 — Core SDK + Wallet Adapter Mastery

#### @solana/web3.js v2 (Solana Kit)
- `Connection` — connecting to clusters (devnet, mainnet, custom RPC)
- `Keypair`, `PublicKey` — generating and managing keys
- `Transaction`, `VersionedTransaction` — building transactions from scratch
- `SystemProgram` — transfer SOL, create accounts
- `sendAndConfirmTransaction` — the full send flow
- Understanding `blockhash`, `lastValidBlockHeight`, confirmation levels

#### Wallet Adapter — Complete Deep Dive
- `@solana/wallet-adapter-react` + `@solana/wallet-adapter-react-ui`
- Setting up `WalletProvider`, `ConnectionProvider`
- `useWallet()` — `publicKey`, `signTransaction`, `signMessage`, `signAllTransactions`
- `useConnection()` — accessing the cluster connection
- `useAnchorWallet()` — when using Anchor client
- Supported wallets: Phantom, Backpack, Solflare, Ledger, Torus
- Wallet Standard — the new standard vs legacy adapter
- Multi-wallet support — letting users choose
- Auto-connect, disconnect, wallet change handling
- **Signing messages** — proving wallet ownership (auth use cases)
- **Signing transactions vs sending** — when the dApp signs vs wallet signs

#### 🔨 Projects
- [ ] **Multi-Wallet Connect Page** — connect any Solana wallet, show address, balance, disconnect
- [ ] **SOL Sender dApp** — input address + amount → send SOL with wallet signature → show confirmation

---

### Week 2 — Token Operations & Account Data

#### SPL Token Client Operations
- Fetching all token accounts for a wallet (`getTokenAccountsByOwner`)
- Reading token balances, decimals, mint info
- **Creating Associated Token Accounts (ATAs)** from client
- **Transferring SPL Tokens** — building the transfer instruction manually
- **Burning tokens** from client
- Token metadata — reading name, symbol, image from on-chain metadata
- Token list registries — resolving token mints to readable names

#### Reading On-Chain Data
- `getAccountInfo` — raw account data parsing
- `getParsedAccountInfo` — parsed data for known programs
- Buffer layout parsing with `@solana/buffer-layout`
- Account discriminators — how to identify account types

#### Real-Time Data
- WebSocket subscriptions: `onAccountChange`, `onProgramAccountChange`
- Listening for transaction confirmations
- Building a real-time balance tracker

#### 🔨 Projects
- [ ] **Token Portfolio Dashboard** — show ALL tokens in wallet with balances, icons, USD value (via price APIs)
- [ ] **Token Transfer Tool** — select token → enter recipient → send → live status updates

---

### Week 3 — Production Client Patterns + Solana Pay

#### Transaction Best Practices
- Error handling: preflight simulation, custom error parsing
- Transaction retry logic (Solana drops txns — this is REAL)
- Priority fees: `setComputeUnitPrice` — when and how much
- `setComputeUnitLimit` — optimizing compute budgets
- Versioned transactions vs legacy
- Lookup Tables (ALTs) — fitting more accounts in a transaction

#### Solana Pay
- QR code-based payments
- Transfer requests (simple SOL/token payments)
- Transaction requests (any arbitrary instruction via QR)
- Building a merchant payment page
- `@solana/pay` SDK

#### Solana Actions & Blinks
- What are Actions — executable links that return signable transactions
- What are Blinks — shareable URLs that unfurl into interactive UIs
- Building an Action server (Express endpoint)
- Creating blinks for tipping, minting, voting

#### Helius RPC & Enhanced APIs
- Why use Helius over public RPC
- Enhanced transaction API — human-readable tx history
- Digital Asset Standard (DAS) API — NFT queries
- Webhooks — get notified on-chain events without polling

#### 🔨 Projects
- [ ] **Solana Pay Checkout** — merchant QR payment page with live confirmation
- [ ] **Tip Blink** — a shareable URL that lets anyone tip you SOL
- [ ] **Transaction History Explorer** — paste any wallet → show parsed tx history via Helius

---

## Phase 4 — DeFi, NFT & dApp Interaction
> **Duration**: ~2.5 weeks | **Build on top of existing protocols**

### Week 1 — DeFi Client Integration

#### Jupiter (Token Swap Aggregator)
- Jupiter V6 API — fetch routes, get quotes
- Building swap transactions from quotes
- Slippage protection, price impact warnings
- Displaying routes (multi-hop visualization)
- Limit orders via Jupiter

#### AMM/DEX Interaction
- Reading Raydium pool data — TVL, APR, token pairs
- Orca Whirlpools — concentrated liquidity concepts
- Decoding pool accounts from on-chain data
- Adding/removing liquidity from client

#### Price Feeds & Oracles
- **Pyth Network** — real-time on-chain price feeds
- Reading Pyth price accounts
- Confidence intervals, price staleness checks
- Switchboard — alternative oracle

#### Lending/Borrowing
- Marginfi — reading positions, health factor
- Interacting with lending markets from client

#### 🔨 Projects
- [ ] **Jupiter Swap Interface** — custom UI: select tokens, get best route, execute swap, show results
- [ ] **DeFi Position Tracker** — aggregate wallet's LP positions, lending positions, staking positions

---

### Week 2 — NFT Ecosystem + Token Launchpad

#### NFT Client-Side (Metaplex UMI)
- `@metaplex-foundation/umi` framework
- Fetching NFT metadata, image, attributes
- Fetching all NFTs in a wallet via DAS API
- Collection verification, creator verification
- **Candy Machine** — minting from client using existing candy machines
- Mint phases: whitelist (allowlist), public mint
- **Compressed NFTs (cNFTs)** — 1000x cheaper, Bubblegum program
- Reading compressed NFT data via DAS

#### NFT Marketplaces from Client
- **Magic Eden API** — listings, floor prices, bids
- **Tensor API** — collection stats, bids, listings
- Building a portfolio value calculator

#### Token Launchpad (Client-Side)
- **Creating a new SPL Token** from the browser (yes, client-side!)
  - Mint account creation
  - Setting decimals, supply
  - Mint authority, freeze authority
  - Creating metadata (name, symbol, image via Metaplex Token Metadata)
- **Minting initial supply**
- **Token distribution** — batch airdrop tool
- **Revoke authorities** — making a token immutable/trustworthy
- Understanding token standards: Token Program vs Token-2022 (Token Extensions)
- **Token-2022 features**: transfer fees, interest-bearing tokens, confidential transfers

#### Airdrop Tools
- Building a batch token sender (CSV upload → airdrop to list)
- Merkle-based airdrop verification (client-side proof generation)
- Compressed airdrops using ZK compression

#### 🔨 Projects
- [ ] **Token Launchpad dApp** — create token → set metadata → mint supply → distribute → revoke authority. Full UI.
- [ ] **NFT Gallery dApp** — connect wallet → see all NFTs with metadata, floor price, rarity → collection view
- [ ] **Airdrop Tool** — upload CSV of addresses → batch send tokens with progress bar

---

### Week 2.5 (Buffer) — Extra dApp Patterns

#### On-Chain Messaging / Social
- Using Solana for message signing (proof of identity)
- Reading/writing memo instructions (`MemoProgram`)
- Building a guestbook / message board using memo data

#### Governance / DAO Interaction
- SPL Governance program (reading proposals, voting from client)
- Realms DAO — interacting with existing DAOs

#### 🔨 Projects
- [ ] **On-Chain Guestbook** — sign a message with wallet, store via memo, display all messages

---

## Phase 5 — Anchor IDL Consumer + dApp Architecture Patterns
> **Duration**: ~2 weeks | **Bridge between client and on-chain**

### Week 1 — Consuming Anchor Programs

#### Anchor Client Deep Dive
- What is an IDL? — Anchor's ABI equivalent (JSON schema of a program)
- `@coral-xyz/anchor` client library setup
- `Program` class — instantiate from IDL + program ID
- Calling instruction handlers from TypeScript
- Fetching and decoding program accounts using IDL types
- Event listeners — subscribing to program events
- PDAs from client side — deriving addresses, understanding seeds
- Understanding what CPIs look like from the client's perspective
- Reading open-source program IDLs: Marinade, Drift, Squads, Orca

#### 🔨 Projects
- [ ] **Voting dApp Frontend** — build UI for an existing on-chain voting program (find one on devnet)
- [ ] **Staking Dashboard** — interact with a staking program via IDL

---

### Week 2 — dApp Architecture & Patterns

#### Full dApp Architecture
- Folder structure for production Solana dApps
- State management: React Context vs Zustand for on-chain state
- Custom hooks pattern for Solana:
  - `useSolBalance`, `useTokenAccounts`, `useProgram`, `usePDA`
- Caching on-chain data (SWR / React Query + Solana)
- Optimistic updates — update UI before tx confirms
- Transaction toast system — pending → confirmed → finalized

#### Auth Patterns
- **Sign-In With Solana (SIWS)** — wallet-based authentication
- Building an auth flow: connect → sign message → verify on backend → JWT
- Express backend for SIWS verification

#### Indexing & Databases
- When to use on-chain vs off-chain data
- Helius webhooks — sync on-chain events to your DB
- Building a simple indexer: listen to program events → store in MongoDB/Postgres

#### 🔨 Projects
- [ ] **Authenticated dApp** — wallet connect → sign-in → protected routes → user profile stored off-chain
- [ ] **Event Indexer** — listen to a program's events via Helius webhook → store in DB → display in UI

---

## Phase 6 — Full-Stack Portfolio (Pre-Rust)
> **Duration**: ~3 weeks | **Ship real, impressive, DEPLOYED projects**

### Project A: **DeFi Analytics Dashboard** (~1.5 weeks)
- Aggregates wallet positions across Solana DeFi protocols
- Real-time token prices via Pyth oracle
- Swap widget (Jupiter integration)
- P&L tracking using transaction history
- Portfolio chart (historical value)
- **Stack**: React + TypeScript + Helius + Jupiter + Pyth + Wallet Adapter
- **Deploy**: Vercel + mainnet RPC

### Project B: **Token Launchpad Platform** (~1.5 weeks)
- Create token → configure metadata → set supply
- Token-2022 support (transfer fees, extensions)
- Distribute via airdrop (batch send)
- Mint authority management (revoke for trust)
- Shareable token page with stats
- **Stack**: React + TypeScript + SPL Token + Metaplex + Wallet Adapter
- **Deploy**: Vercel + mainnet RPC

### Quality Bar (Both Projects)
- [ ] TypeScript strict mode throughout
- [ ] Custom React hooks — clean, reusable, tested
- [ ] Error boundary + transaction toast system
- [ ] Loading skeletons, not spinners
- [ ] Mobile responsive (mandatory)
- [ ] Dark mode with premium aesthetics
- [ ] Deployed on Vercel with production RPC
- [ ] GitHub: clean README, architecture diagram, demo video/GIF
- [ ] Solana Pay integration on at least one project

---

## Phase 7 — Rust Core (Now With Full Context)
> **Duration**: ~3 weeks | **You now know WHAT programs need to do**

### Week 1 — Rust Fundamentals
- Ownership, Borrowing, Lifetimes (your DSA background helps)
- Structs, Enums, Pattern Matching
- `Result<T, E>` and `Option<T>` — no exceptions in Rust
- Traits & Generics
- Error handling patterns

### Week 2 — Intermediate Rust
- Iterators & Closures
- Collections: `Vec`, `HashMap`, `HashSet`
- Modules, Crates, Cargo workspaces
- `impl` blocks and method syntax
- Serialization with `borsh` (Solana's format) & `serde`
- Writing tests (`#[test]`, `#[cfg(test)]`)

### Week 3 — Rust Applied to Solana Context
- `#[derive(...)]` macros (Anchor uses these heavily)
- Understanding proc macros at a high level
- Memory layout and `repr(C)` (relevant for account data)
- Writing CLI programs in Rust
- Reading real Solana program code

### 🔨 Projects
- [ ] CLI calculator in Rust
- [ ] Key-value store with persistence
- [ ] Borsh serialize/deserialize a Solana-style account struct
- [ ] CLI tool that reads Solana account data and decodes it

---

## Phase 8 — Native Solana Programs
> **Duration**: ~2 weeks | **Understand what Anchor hides**

### Core Concepts
- `entrypoint!`, `process_instruction` — raw program structure
- Manual account validation (is_signer, is_writable, owner checks)
- Reading & writing account data with `borsh`
- **PDAs from program side** — `Pubkey::create_program_address`, `find_program_address`
- **CPIs** — calling SPL Token program, System program from your program
- Deploying to devnet: `solana program deploy`
- Upgrade authority and program management

### Security (Native)
- Missing signer checks → anyone can call your instruction
- Missing owner checks → wrong program's accounts passed in
- Integer overflow/underflow
- Account reallocation attacks

### 🔨 Projects
- [ ] **Counter Program** — store a number on-chain, increment/decrement
- [ ] **Vault Program** — deposit/withdraw SOL with authority checks
- [ ] **Escrow Program** — two-party token swap (native, no Anchor)

---

## Phase 9 — Anchor Framework + Advanced Programs + Final Portfolio
> **Duration**: ~4-5 weeks | **Industry-level on-chain development**

### Week 1-2 — Anchor Mastery

#### Anchor Core
- Project structure: `programs/`, `tests/`, `app/`, `migrations/`
- `#[program]` — defining instruction handlers
- `#[derive(Accounts)]` — account validation structs
- `#[account]` — defining data accounts
- Constraints: `mut`, `init`, `has_one`, `constraint`, `close`
- PDAs with Anchor: `seeds`, `bump`
- CPIs with Anchor — clean composability
- Custom errors with `#[error_code]`
- Events with `emit!`
- Testing: `anchor-bankrun` + `mocha`
- IDL generation — connecting back to your Phase 5 client skills

### Week 2-3 — Building Real Programs

#### Token & NFT Programs
- Creating mint accounts from program
- Minting tokens from program (mint authority = PDA)
- Token-2022 program interactions
- NFT minting program via Metaplex on-chain
- **Token Launchpad Program** — on-chain logic for:
  - Token creation with configurable params
  - Bonding curve pricing (like pump.fun)
  - Liquidity pool seeding
  - Fee collection

#### DeFi Programs
- **Staking Program** — stake tokens, earn rewards over time
- **Escrow Program (Anchor)** — secure two-party swaps
- **Simplified AMM** — liquidity pool with constant product formula
- **Vesting Program** — lock tokens, release on schedule

#### dApp Programs
- **Voting/Governance Program** — proposals, votes, execution
- **Crowdfunding Program** — create campaigns, fund, withdraw
- **On-Chain Messaging** — send encrypted messages between wallets

### Week 3-4 — Advanced Patterns & Security

#### Advanced
- Program upgrades and migration patterns
- Multisig via Squads protocol
- Merkle tree proofs in programs (whitelists, airdrops)
- Compute Unit optimization (CU budgets)
- Lookup Tables (ALTs) for complex transactions
- Clock sysvar, rent sysvar — using on-chain time/rent info
- Zero-copy deserialization (large accounts)

#### Security Audit Mindset
- All common Solana vulnerabilities:
  - Signer authorization bypass
  - Account ownership validation
  - PDA bump seed canonicalization
  - Arithmetic overflow
  - Reinitialization attacks
  - Closing account lamport drain
- Reading audit reports (OtterSec, Neodyme, Halborn)
- Writing your own security checklist

### Week 4-5 — Final Portfolio Projects

#### Project A: **Full-Stack Token Launchpad** (Program + Frontend)
- **On-chain**: Anchor program with:
  - Token creation with metadata
  - Bonding curve pricing mechanism
  - Buy/sell with automatic price adjustment
  - Liquidity graduation (auto-add to Raydium when threshold hit)
  - Fee collection for platform
- **Frontend**: React + TypeScript (your Phase 3-6 skills)
  - Create token flow with preview
  - Live price chart (bonding curve visualization)
  - Buy/sell interface with slippage
  - Token explorer with trending/new tokens
- **Quality**: Full test suite, deployed devnet + mainnet, audit checklist passed

#### Project B: **NFT Staking & Rewards Platform**
- **On-chain**: Anchor program with:
  - Stake any NFT from a verified collection
  - Earn SPL reward tokens over time
  - Unstake with accumulated rewards
  - Configurable reward rates per collection
- **Frontend**: 
  - Gallery of stakeable NFTs
  - Staking dashboard with earned rewards
  - Claim + compound actions
  - Collection leaderboard
- **Quality**: Same bar as Project A

#### Project C (Bonus): **DAO Governance dApp**
- **On-chain**: Proposal creation, token-weighted voting, timelock execution
- **Frontend**: Proposal list, vote UI, execution dashboard

---

## Complete Timeline

| Phase | Focus | Duration | Cumulative |
|-------|-------|----------|------------|
| Phase 1 | Cryptography & Blockchain Foundations | Reviewed | — |
| Phase 2 | Solana Architecture & Ecosystem | 1 week | Week 1 |
| Phase 3 | Client-Side Deep Dive (SDK + Wallet Adapter + Solana Pay) | 3 weeks | Week 4 |
| Phase 4 | DeFi/NFT/dApp Interaction + Token Launchpad | 2.5 weeks | Week 6.5 |
| Phase 5 | Anchor IDL Consumer + dApp Architecture | 2 weeks | Week 8.5 |
| Phase 6 | Full-Stack Portfolio (no Rust) | 3 weeks | Week 11.5 |
| Phase 7 | Rust Core | 3 weeks | Week 14.5 |
| Phase 8 | Native Solana Programs | 2 weeks | Week 16.5 |
| Phase 9 | Anchor + Advanced Programs + Final Portfolio | 4-5 weeks | **Week 20-21** |
| **Total** | | **~5 months** | |
