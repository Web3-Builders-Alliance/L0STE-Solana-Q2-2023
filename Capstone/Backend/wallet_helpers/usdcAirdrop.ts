import { Connection, Keypair, PublicKey, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token"
import { createCreateMetadataAccountV3Instruction, DataV2 } from "@metaplex-foundation/mpl-token-metadata";
import { Metaplex, keypairIdentity, bundlrStorage, toMetaplexFile } from "@metaplex-foundation/js";
import { readFile } from "fs/promises"

import wallet from "./wallet/dev-wallet.json"

//Connect our WBA Wallet
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection to devnet SOL tokens
const connection = new Connection("https://api.devnet.solana.com", {commitment: "max"});

//Metadata for the token
const name = "USDC - Bookchain Test";
const symbol = "USDCBC";
const sellerFeeBasisPoints = 1000;

//Initializing Metaplex
const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(keypair))
    .use(bundlrStorage({
        address: 'https://devnet.bundlr.network',
        providerUrl: "https://api.devnet.solana.com",
        timeout: 60000,
    }));


(async () => {
  try {

    console.log(`This is your connected Wallet: ${keypair}`)
    
    // Create new token mint
    const mint = await createMint(
        connection, 
        keypair, 
        keypair.publicKey, 
        keypair.publicKey, 
        0
    );

    console.log(`The unique identifier of the token is: ${mint.toBase58()}`); 

    ////// METADATA //////

    // Add the Token Metadata Program
    const token_metadata_program_id = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')

    // Create PDA for token metadata
    const metadata_seeds = [
      Buffer.from('metadata'),
      token_metadata_program_id.toBuffer(),
      mint.toBuffer(),
    ];
    const [metadata_pda, _bump] = PublicKey.findProgramAddressSync(metadata_seeds, token_metadata_program_id);

    let metadatatx = new Transaction().add(
      createCreateMetadataAccountV3Instruction({
          metadata: metadata_pda,
          mint: mint,
          mintAuthority: keypair.publicKey,
          payer: keypair.publicKey,
          updateAuthority: keypair.publicKey,
      }, {
          createMetadataAccountArgsV3: {
              data: {
                  name: name,
                  symbol: symbol,
                  uri: "",
                  sellerFeeBasisPoints: sellerFeeBasisPoints,
                  creators: [
                      {address: keypair.publicKey, verified: true, share: 100 }
                  ],
                  collection: null,
                  uses: null,
              },
              isMutable: true,
              collectionDetails: null,
          }
      })
    ) 

    let txconfirmation = await sendAndConfirmTransaction(connection, metadatatx, [keypair])
    console.log(`Metadata Succesfully Uploaded!. Transaction Here: https://explorer.solana.com/tx/${txconfirmation}?cluster=devnet`)

    ////////////

    // Get the token account of the wallet address, and if it does not exist, create it
    const userTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      keypair.publicKey
    );

    // Mint new token to your wallet
    let tx = await mintTo(
      connection,
      keypair,
      mint,
      userTokenAccount.address,
      keypair.publicKey,
      1000000,
      []
    );

    console.log(`Succesfully Minted!. Transaction Here: https://explorer.solana.com/tx/${tx}?cluster=devnet`)

  } catch(e) {
    console.error(`Oops, something went wrong: ${e}`)
  }
})();
  