import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token"

import wallet from "../Wallet/wba-wallet.json"

//Connect our WBA Wallet
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection to devnet SOL tokens
const connection = new Connection("https://api.devnet.solana.com", {commitment: "confirmed"});

(async () => {

const mint = new PublicKey("E6gV5iGu3NjJ58qdRYr6AshB1zhXhx3Yq29bXLjy9oLt")

// Get the token account of the wallet address, and if it does not exist, create it
const ata = await getOrCreateAssociatedTokenAccount(
    connection,
    keypair,
    mint,
    keypair.publicKey
  );

  console.log(`This is your ATA: ${ata.address}!`)

  // Mint new token to your wallet
  let tx = await mintTo(
    connection,
    keypair,
    mint,
    ata.address,
    keypair.publicKey,
    100000000,
    []
  );

  console.log(`Succesfully Minted!. Transaction Here: https://explorer.solana.com/tx/${tx}?cluster=devnet`)
})();
  