import { Commitment, Connection, Keypair, PublicKey, Transaction, sendAndConfirmTransaction } from "@solana/web3.js"
import wallet from "../Wallet/wba-wallet.json"
import { createCreateMetadataAccountV2Instruction, createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Define our Mint address
const mint = new PublicKey("fUKezTJ1PT4kuZLG3hEzctoiH6UP4X1YT5CMZPPiDGb")

// Add the Token Metadata Program
const token_metadata_program_id = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')

// Create PDA for token metadata
const metadata_seeds = [
    Buffer.from('metadata'),
    token_metadata_program_id.toBuffer(),
    mint.toBuffer(),
];
const [metadata_pda, _bump] = PublicKey.findProgramAddressSync(metadata_seeds, token_metadata_program_id);

(async () => {
    try {
        let tx = new Transaction().add(
            createCreateMetadataAccountV3Instruction({
                metadata: metadata_pda,
                mint: mint,
                mintAuthority: keypair.publicKey,
                payer: keypair.publicKey,
                updateAuthority: keypair.publicKey,
            }, {
                createMetadataAccountArgsV3: {
                    data: {
                        name: "L0STE - Test Token #1",
                        symbol: "TST",
                        uri: "https://arweave.net/euAlBrhc3NQJ5Q-oJnP10vsQFjTV7E9CgHZcVm8cogo",
                        sellerFeeBasisPoints: 1000,
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

        let txconfirmation = await sendAndConfirmTransaction(connection, tx, [keypair])
        console.log(`Succesfully Minted!. Transaction Here: https://explorer.solana.com/tx/${txconfirmation}?cluster=devnet`)

    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();