import { Connection, Keypair, SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { Program, Wallet, AnchorProvider, Address, BN } from "@project-serum/anchor"
import { WbaVault, IDL } from "./programs/wba_vault";

import wallet from "../Wallet/wba-wallet.json"
import { TOKEN_PROGRAM_ID, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//
const vaultstate = new PublicKey("2K5wUfzfatRbqxudkufbWnz3G2dqjzfURN2JCKXSwwQr")

//
const mint = new PublicKey("ANpngyhN1Xzcu7LrqgkZesfr2Ycjdqi8Mio9GnnhxKuT")

// Create a devnet connection
const connection = new Connection("https://api.devnet.solana.com", {commitment: "confirmed"});

// Create our anchor provider
const provider = new AnchorProvider(connection, new Wallet(keypair), { commitment: "confirmed"});

// Create our program
const program = new Program<WbaVault>(IDL, "D51uEDHLbWAxNfodfQDv7qkp8WZtxrhi3uganGbNos7o" as Address, provider);

// Create the PDA for our enrollment account
const vault_auth_seed = [Buffer.from("auth"), vaultstate.toBuffer()];
const vault_auth = PublicKey.findProgramAddressSync(vault_auth_seed, program.programId)[0];

// Create the PDA for our enrollment account
const vault_seed = [Buffer.from("vault"), vault_auth.toBuffer()];
const vault = PublicKey.findProgramAddressSync(vault_seed, program.programId)[0];

// Execute our enrollment transaction
(async () => {
    try {
        const ownerAta = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey
          );    

          const vaultAta = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            vault_auth,
            true,
          );     

        const txhash = await program.methods
        .depositSpl(
            new BN(10_000_000) 
        )
        .accounts({
            owner: keypair.publicKey,
            vaultState: vaultstate,
            vaultAuth: vault_auth,
            systemProgram: SystemProgram.programId,
            ownerAta: ownerAta.address,
            vaultAta: vaultAta.address,
            tokenMint: mint,
            tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([
            keypair
        ]).rpc();
        console.log(`Success! Check out your TX here: 
        https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();