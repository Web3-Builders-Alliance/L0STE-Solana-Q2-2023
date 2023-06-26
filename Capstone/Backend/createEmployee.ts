// FLOW 1.1: Create a new project with projectName as input

import employeeWallet from "./wallet_helpers/wallet/Wallet2.json"

//INPUTS:
let employeeW = Keypair.fromSecretKey(new Uint8Array(employeeWallet));
let employeeName = "Test Employee";
let employeeTitle = "Test Title";
let monthlyPay = new BN(10);

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
const program = new Program<Bookchain>(IDL, "HwnJp9Gkz8uBX5e3GC2B1cbp95iVy5CCjFUZ4DTFrsFW" as Address, provider);

(async () => {
/* NEED HELP WITH THE FILTER
projectAccount = ...
{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getProgramAccounts",
    "params": [
      "HwnJp9Gkz8uBX5e3GC2B1cbp95iVy5CCjFUZ4DTFrsFW", //Is this the programId in reality?
      {
        "encoding": "base64",
        "filters": [
            {
                "dataSize": 91
            },
            {
                "memcmp": {
                    "offset": 18,
                    "bytes": "" //This should be the wallet1
                }
            }
        ]
      }
    ]
  }

const id = await getAccountInfo() //This should use the project address from the filter and search for the EMPLOYEE number
*/


    const mint = new PublicKey("FXSZjZ2TXkKWSXRGgV3UJ15Cf36mpZEjTybcBmW6RgoG");

    //Will delete this when filter works
    const projectId = new BN(43,282,355);
    const project = [Buffer.from("project"), keypair.publicKey.toBuffer(), projectId.toArrayLike(Buffer, 'le', 8)];
    const [projectKey, _bump] = PublicKey.findProgramAddressSync(project, program.programId);
    const idbn = BN(0);
    const id = 0;

    const ata = await getOrCreateAssociatedTokenAccount(provider.connection, keypair, mint, keypair.publicKey);
    let initializerAta = ata.address;

    //Here i used toArrayLike to convert the string to a buffer but i need BN that don't go with u8 but i think i will always only need u8
    const employee = [Buffer.from("employee"), projectKey.toBuffer(), idbn.toArrayLike(Buffer, 'le', 8)];
    const [employeeKey, _bumpbump] = PublicKey.findProgramAddressSync(project, program.programId);

    try {
        const txhash = await program.methods
        .employeeInit(
            id,
            employeeW,
            employeeName,
            employeeTitle,
            monthlyPay,
            _bumpbump,
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