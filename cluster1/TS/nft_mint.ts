import { Metaplex, keypairIdentity, bundlrStorage } from "@metaplex-foundation/js";
import { Connection, Keypair } from "@solana/web3.js";

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
    const { nft } = await metaplex.nfts().create(
        {
            uri: "https://arweave.net/7GANE-mltj3pVoF_2Xr6_mif0phG7WKNhPuFIFPvYIM",
            name: "L0STE-RUG",
            symbol: "RUG",
            creators: [{
                address: keypair.publicKey,
                authority: keypair,
                share: 100,
            }],
            sellerFeeBasisPoints: 100,
            isMutable: true,
            collection: null,

        }
    )
    console.log(`The unique identifier of your NFT is: ${nft.address}`);

})();