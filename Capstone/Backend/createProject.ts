// FLOW 1.1: Create a new project
// The Figma of this part: 


//INPUTS:
let projectName = "Test Project";

///////////////////////////////////////////////////////////////////////////////////////////

import { Connection, Keypair, SystemProgram, PublicKey } from "@solana/web3.js"
import { Program, Wallet, AnchorProvider, Address } from "@project-serum/anchor"
import { ASSOCIATED_TOKEN_PROGRAM_ID as associatedTokenProgram, TOKEN_PROGRAM_ID as tokenProgram, getOrCreateAssociatedTokenAccount } from "@solana/spl-token"
import { Bookchain, IDL } from "./programs/bookchain";
import wallet from "./wallet_helpers/wallet/Wallet1.json"

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// Create a devnet connection
const connection = new Connection("https://api.devnet.solana.com");

// Create our anchor provider
const provider = new AnchorProvider(connection, new Wallet(keypair), { commitment: "confirmed"});

// Create our program
const program = new Program<Bookchain>(IDL, "HwnJp9Gkz8uBX5e3GC2B1cbp95iVy5CCjFUZ4DTFrsFW" as Address, provider);

(async () => {
    const mint = new PublicKey("FXSZjZ2TXkKWSXRGgV3UJ15Cf36mpZEjTybcBmW6RgoG");

    const ata = await getOrCreateAssociatedTokenAccount(provider.connection, keypair, mint, keypair.publicKey);
    let initializerAta = ata.address;

    const project = [Buffer.from("project"), keypair.publicKey.toBuffer()];
    const [projectKey, _bump] = PublicKey.findProgramAddressSync(project, program.programId);
    const projectVault =  [Buffer.from("vault"), projectKey.toBuffer()]
    const [projectVaultKey, _anotherbump] = PublicKey.findProgramAddressSync(projectVault, program.programId);

    try {
        const txhash = await program.methods
        .projectInit(
            _bump,
            _anotherbump,
            projectName,
        )
        .accounts({
            projectVault: projectVaultKey,
            project: projectKey,
            initializer: keypair.publicKey,
            initializerAta: initializerAta,
            token: mint,
            tokenProgram: tokenProgram,
            associatedTokenProgram: associatedTokenProgram,
            systemProgram: SystemProgram.programId,
          })
          .signers([
            keypair
          ]).rpc();
        console.log(`Success! Check out your TX here: 
        https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
        console.log(`Project Key: ${projectKey.toBase58()}`);
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();