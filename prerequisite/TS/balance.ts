import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js"
import wallet from "../wallet/wba-wallet.json"
import burner from "../wallet/dev-wallet.json"

const walletkeypair = Keypair.fromSecretKey(new Uint8Array(wallet));
const burnerkeypair = Keypair.fromSecretKey(new Uint8Array(burner));
const connection = new Connection("https://api.devnet.solana.com");

(async () => {

    console.log("PublicKey:", walletkeypair.publicKey.toBase58())
    let balance = await connection.getBalance(walletkeypair.publicKey)
    console.log("Current balance is", balance / LAMPORTS_PER_SOL)

    console.log("PublicKey:", burnerkeypair.publicKey.toBase58())
    balance = await connection.getBalance(burnerkeypair.publicKey)
    console.log("Current balance is", balance / LAMPORTS_PER_SOL)

})();