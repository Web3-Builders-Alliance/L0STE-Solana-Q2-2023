// FLOW 1.1: Create a new project  projectName as input

//INPUTS:
let projectName = "WBA0";

///////////////////////////////////////////////////////////////////////////////////////////

import { Connection, Keypair, SystemProgram, PublicKey } from "@solana/web3.js"
import { Program, Wallet, AnchorProvider, Address, BN } from "@project-serum/anchor"
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
const program = new Program<Bookchain>(IDL, "BT6d1BHTPJ6fQSXMZzvtQTjdsxbfj5pJu2o5kWEJERQs" as Address, provider);

(async () => {

    let res = await program.account.project.all([
        {
            memcmp: {
                offset: 16,
                bytes: keypair.publicKey.toBase58()
            }
        }
    ]
);

let i = 0;
while (i<res.length) {
    if (res[i].account.projectName == projectName) {
        return console.log("Project already exists");
    } else {
        i++;
    }
}

    console.log(keypair.publicKey.toBase58());

    const id = new BN(Math.floor(Math.random() * 100000000))
    const mint = new PublicKey("FXSZjZ2TXkKWSXRGgV3UJ15Cf36mpZEjTybcBmW6RgoG");
    const ata = await getOrCreateAssociatedTokenAccount(provider.connection, keypair, mint, keypair.publicKey);
    let initializerAta = ata.address;

    const project = [Buffer.from("project"), keypair.publicKey.toBuffer(), id.toArrayLike(Buffer, 'le', 8)];
    const [projectKey, _bump] = PublicKey.findProgramAddressSync(project, program.programId);
    const projectVault =  [Buffer.from("vault"), projectKey.toBuffer()]
    const [projectVaultKey, _anotherbump] = PublicKey.findProgramAddressSync(projectVault, program.programId);

    console.log("ProjectKey: ", projectKey.toBase58())

    try {
        const txhash = await program.methods
        .projectInit(
            id,
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
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();