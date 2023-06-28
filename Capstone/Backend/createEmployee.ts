// FLOW 1.1: Create a new project with projectName as input

///////////////////////////////////////////////////////////////////////////////////////////

import { Connection, Keypair, SystemProgram, PublicKey } from "@solana/web3.js"
import { Program, Wallet, AnchorProvider, Address, BN } from "@project-serum/anchor"
import { ASSOCIATED_TOKEN_PROGRAM_ID as associatedTokenProgram, TOKEN_PROGRAM_ID as tokenProgram, getOrCreateAssociatedTokenAccount } from "@solana/spl-token"
import { Bookchain, IDL } from "./programs/bookchain";
import wallet from "./wallet_helpers/wallet/Wallet1.json"
import wallet2 from "./wallet_helpers/wallet/Wallet2.json"


//INPUTS:
let employeeWallet = Keypair.fromSecretKey(new Uint8Array(wallet2));
let employeeName = "Test Employee";
let employeeTitle = "Test Title";
let monthlyPay = new BN(10);

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// Create a devnet connection
const connection = new Connection("https://api.devnet.solana.com");

// Create our anchor provider
const provider = new AnchorProvider(connection, new Wallet(keypair), { commitment: "confirmed"});

// Create our program
const program = new Program<Bookchain>(IDL, "HwnJp9Gkz8uBX5e3GC2B1cbp95iVy5CCjFUZ4DTFrsFW" as Address, provider);

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

    let id = new BN(res[0].account.employee);
    let projectKey = res[0].publicKey;

    console.log("This is the ID: ", id);

    const mint = new PublicKey("FXSZjZ2TXkKWSXRGgV3UJ15Cf36mpZEjTybcBmW6RgoG");
    const ata = await getOrCreateAssociatedTokenAccount(provider.connection, keypair, mint, keypair.publicKey);
    let initializerAta = ata.address;
    
    const employee = [Buffer.from("employee"), projectKey.toBuffer(), id.toArrayLike(Buffer, 'le', 8)];
    const [employeeKey, _bump] = PublicKey.findProgramAddressSync(employee, program.programId);

    try {
        const txhash = await program.methods
        .employeeInit(
            id,
            employeeWallet.publicKey,
            employeeName,
            employeeTitle,
            monthlyPay,
            _bump,
        )
        .accounts({
            project: projectKey,
            employee: employeeKey,
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