import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";
import wallet from "./wallet/dev-wallet.json" 

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Generate a new keypair
let kp = Keypair.generate()
let publicKey = kp.publicKey.toBase58()
console.log(`You've generated a new Solana wallet: ${publicKey}

To save your wallet, copy and paste the following into a JSON file:

[${kp.secretKey}]`)

//Transfer the USDC to the new wallet
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("FXSZjZ2TXkKWSXRGgV3UJ15Cf36mpZEjTybcBmW6RgoG");

// Recipient address
const to = new PublicKey(publicKey);

(async () => {
    try {
        const from_ata = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey,
        );

        const to_ata = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            to,
        );

        const tx = transfer(
            connection,
            keypair,
            from_ata.address,
            to_ata.address,
            keypair.publicKey,
            1
        )
    
        console.log(`Succesfully Transferred!. Transaction Here: https://explorer.solana.com/tx/${tx}?cluster=devnet`)
        
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }

    try {
        // We're going to claim 2 devnet SOL tokens
        const txhash = await connection.requestAirdrop(kp.publicKey, 2 * LAMPORTS_PER_SOL);
        console.log(`Success! Check out your TX here: 
        https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();