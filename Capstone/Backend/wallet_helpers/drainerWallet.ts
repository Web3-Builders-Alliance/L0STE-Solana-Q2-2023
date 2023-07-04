import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } from "@solana/web3.js"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";
import wallet from "./wallet/mockup.json" 

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Transfer the USDC to the new wallet
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

(async () => {

    const balance = 2*LAMPORTS_PER_SOL;
    const to = new PublicKey("2uqpz6ZbWQKrYAjNRtU933VRa9TzRVoREEsaH9wDkzKs");

    // Create a test transaction to calculate fees
    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: keypair.publicKey,
            toPubkey: to,
            lamports: balance,
        })
    );
    transaction.recentBlockhash = (await connection.getLatestBlockhash('confirmed')).blockhash;
    transaction.feePayer = keypair.publicKey;

    // Calculate exact fee rate to transfer entire SOL amount out of account minus fees
    const fee = (await connection.getFeeForMessage(transaction.compileMessage(), 'confirmed')).value || 0;

    // Remove our transfer instruction to replace it
    transaction.instructions.pop();
    
    // Now add the instruction back with correct amount of lamports
    transaction.add(
        SystemProgram.transfer({
            fromPubkey: keypair.publicKey,
            toPubkey: to,
            lamports: balance-fee,
        })
    );
    
    // Sign transaction, broadcast, and confirm
    const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [keypair]
    );
    console.log(`Succesfully Tranfered! Check out your TX here: 
    https://explorer.solana.com/tx/${signature}?cluster=devnet`);

})();