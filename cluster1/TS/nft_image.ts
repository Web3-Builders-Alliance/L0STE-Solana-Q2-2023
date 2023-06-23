import { Metaplex, keypairIdentity, bundlrStorage, toMetaplexFile } from "@metaplex-foundation/js";
import { Connection, Keypair } from "@solana/web3.js";
import { readFile } from "fs/promises"

import wallet from "../wallet/wba-wallet.json"

//Connect our WBA Wallet
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection to devnet SOL tokens
const connection = new Connection("https://api.devnet.solana.com", {commitment: "confirmed"});

//Initializing Metaplex
const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(keypair))
    .use(bundlrStorage({
        address: 'https://devnet.bundlr.network',
        providerUrl: "https://api.devnet.solana.com",
        timeout: 60000,
    }));

(async () => {

    const img = await readFile("./images/generug.png");
    const metaplexImg = toMetaplexFile(img,"generug.png");
    const imgUri = await metaplex.storage().upload(metaplexImg)

    console.log(imgUri)

})();