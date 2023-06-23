import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "../Wallet/wba-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("<mint address>");

// Recipient address
const to = new PublicKey("<receiver address>");

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
            1000
        )
        
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();