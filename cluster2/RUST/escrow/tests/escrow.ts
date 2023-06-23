import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Escrow } from "../target/types/escrow";
import { PublicKey, Commitment, Keypair, SystemProgram } from "@solana/web3.js"
import { ASSOCIATED_TOKEN_PROGRAM_ID as associatedTokenProgram, TOKEN_PROGRAM_ID as tokenProgram, createMint, createAccount, mintTo, getOrCreateAssociatedTokenAccount, getAccount, Account, getAssociatedTokenAddress } from "@solana/spl-token"
import { randomBytes } from "crypto"
import { assert } from "chai"

describe("escrow", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.getProvider();

  anchor.AnchorProvider.env().opts.commitment = "finalized";

  const program = anchor.workspace.Escrow as Program<Escrow>;

  // Set up our keys
  const [maker, taker] = [new Keypair(), new Keypair()];

  // Random seed
  const seed = new anchor.BN(randomBytes(8));

  // PDAs
  const auth = PublicKey.findProgramAddressSync([Buffer.from("auth")], program.programId)[0];
  const escrow = PublicKey.findProgramAddressSync([Buffer.from("escrow"), maker.publicKey.toBytes(), seed.toBuffer().reverse()], program.programId)[0];
  const vault = PublicKey.findProgramAddressSync([Buffer.from("vault"), escrow.toBuffer()], program.programId)[0];

  // Mints
  let maker_token: PublicKey;
  let taker_token: PublicKey;

  // ATAs
  let maker_ata: PublicKey; // Maker + maker token
  let taker_ata: PublicKey; // Taker + taker token
  let maker_receive_ata: PublicKey; // Maker + taker token
  let taker_receive_ata: PublicKey; // Taker + maker

  it("Airdrop", async () => {
    await Promise.all([maker, taker].map(async (k) => {
      return await anchor.getProvider().connection.requestAirdrop(k.publicKey, 100 * anchor.web3.LAMPORTS_PER_SOL)
    })).then(confirmTxs);
  });

  it("Mint maker/taker tokens", async () => {
    // Create mints and ATAs
    let [ m, t ] = await Promise.all([maker, taker].map(async(a) => { return await newMintToAta(anchor.getProvider().connection, a) }))
    maker_token = m.mint;
    taker_token = t.mint;
    maker_ata = m.ata;
    taker_ata = t.ata;
    // Create take ATAs
    maker_receive_ata = await getAssociatedTokenAddress(taker_token, maker.publicKey, false, tokenProgram);
    taker_receive_ata = await getAssociatedTokenAddress(maker_token, taker.publicKey, false, tokenProgram);
  })

let expires = 2;

it("Make an escrow", async () => {
  const signature = await program.methods
  .initialize(
    seed,
    new anchor.BN(10 * 1e6),
    new anchor.BN(20 * 1e6),
    new anchor.BN(expires)
  )
  .accounts({
    maker: maker.publicKey,
    makerAta: maker_ata,
    makerToken: maker_token,
    takerToken: taker_token,
    auth,
    escrow,
    vault,
    tokenProgram,
    associatedTokenProgram,
    systemProgram: SystemProgram.programId
  })
  .signers(
    [
      maker
    ]
  )
  .rpc()
  console.log("TX: ", signature);
  await(confirmTx);
});

it("Remake an existing escrow", async () => {
  let error = null;
  try {
    const signature = await program.methods
    .initialize(
      seed,
      new anchor.BN(10 * 1e6),
      new anchor.BN(20 * 1e6),
      new anchor.BN(expires)
    )
    .accounts({
      maker: maker.publicKey,
      makerAta: maker_ata,
      makerToken: maker_token,
      takerToken: taker_token,
      auth,
      escrow,
      vault,
      tokenProgram,
      associatedTokenProgram,
      systemProgram: SystemProgram.programId
    })
    .signers(
      [
        maker
      ]
    )
    .rpc()
    console.log("TX: ", signature);
    await(confirmTx);
  } catch(e: any) {
    error = e;
  }
  assert(error.logs[3].startsWith("Allocate: account Address") && error.logs[3].endsWith("already in use"));
});

it("Refund an escrow", async () => {
  const signature = await program.methods
  .refund()
  .accounts({
    maker: maker.publicKey,
    makerAta: maker_ata,
    makerToken: maker_token,
    auth,
    escrow,
    vault,
    tokenProgram,
    associatedTokenProgram,
    systemProgram: SystemProgram.programId
  })
  .signers(
    [
      maker
    ]
  )
  .rpc()
  console.log("TX: ", signature);
  await(confirmTx);
});

it("Remake an escrow", async () => {
  const signature = await program.methods
  .initialize(
    seed,
    new anchor.BN(10 * 1e6),
    new anchor.BN(20 * 1e6),
    new anchor.BN(expires)
  )
  .accounts({
    maker: maker.publicKey,
    makerAta: maker_ata,
    makerToken: maker_token,
    takerToken: taker_token,
    auth,
    escrow,
    vault,
    tokenProgram,
    associatedTokenProgram,
    systemProgram: SystemProgram.programId
  })
  .signers(
    [
      maker
    ]
  )
  .rpc()
  console.log("Vault TA:", vault.toBase58());
  console.log("Escrow account:", escrow.toBase58());
  console.log("TX: ", signature);
  await(confirmTx);
});

it("Update an escrow", async () => {
  const signature = await program.methods
  .update(
    new anchor.BN(12 * 1e6),
    new anchor.BN(expires)
  )
  .accounts({
    maker: maker.publicKey,
    newTakerToken: taker_token,
    escrow,
    systemProgram: SystemProgram.programId
  })
  .signers(
    [maker]
  )
  .rpc()
  console.log("Vault TA:", vault.toBase58());
  console.log("Escrow account:", escrow.toBase58());
  console.log("TX: ", signature);
  await(confirmTx);
});

it("Take an escrow", async () => {
  try {
    const signature = await program.methods
    .take()
    .accounts({
      taker: taker.publicKey,
      takerAta: taker_ata,
      takerReceiveAta: taker_receive_ata,
      takerToken: taker_token,
      maker: maker.publicKey,
      makerReceiveAta: maker_receive_ata,
      makerToken: maker_token,
      auth,
      escrow,
      vault,
      tokenProgram,
      associatedTokenProgram,
      systemProgram: SystemProgram.programId
    })
    .signers(
      [
        taker
      ]
    )
    .rpc()
    console.log("Vault TA:", vault.toBase58());
    console.log("Escrow account:", escrow.toBase58());
    console.log("TX: ", signature);
    await(confirmTx);
  } catch(e) {
    console.error(e);
    console.log(e);
    throw(e)
  }
});
});



// Helpers

const confirmTx = async (signature: string) => {
const latestBlockhash = await anchor.getProvider().connection.getLatestBlockhash();
await anchor.getProvider().connection.confirmTransaction(
  {
    signature,
    ...latestBlockhash,
  },
  "finalized"
)
}

const confirmTxs = async (signatures: string[]) => {
await Promise.all(signatures.map(confirmTx))
}

const newMintToAta = async (connection, minter: Keypair): Promise<{ mint: PublicKey, ata: PublicKey }> => { 
const mint = await createMint(connection, minter, minter.publicKey, null, 6)
// await getAccount(connection, mint, commitment)
const ata = await createAccount(connection, minter, mint, minter.publicKey)
const signature = await mintTo(connection, minter, mint, ata, minter, 21e8)
await confirmTx(signature)
return {
  mint,
  ata
}
}
