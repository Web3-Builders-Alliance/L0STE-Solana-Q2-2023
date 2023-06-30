import * as anchor from "@coral-xyz/anchor";
import { BN } from "@coral-xyz/anchor"
import { Program } from "@coral-xyz/anchor";
import { Bookchain } from "../target/types/bookchain";
import { PublicKey, Commitment, Keypair, SystemProgram, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { ASSOCIATED_TOKEN_PROGRAM_ID as associatedTokenProgram, TOKEN_PROGRAM_ID as tokenProgram, createMint, createAccount, mintTo, getAssociatedTokenAddress, TOKEN_PROGRAM_ID, getOrCreateAssociatedTokenAccount } from "@solana/spl-token"

const commitment: Commitment = "confirmed"; // processed, confirmed, finalized

describe("bookchain", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.getProvider(); 
  anchor.AnchorProvider.env().opts.commitment = "finalized";
  const program = anchor.workspace.Bookchain as Program<Bookchain>;
  const connection = new Connection("https://api.devnet.solana.com");
  const keypair = anchor.web3.Keypair.generate(); //This is the project Manager
  const employeeWallet = anchor.web3.Keypair.generate(); //This is the employee

  ///////////////////////////////////////////////////////////////////////////////////////////

  //INPUT
  const projectName = "WBA";
  let from = new Date(Date.UTC(2024, 4, 27)); //Put your from from date here
  from.setHours(0, 0, 0, 0);
  let to = new Date(Date.UTC(2024, 4, 30)); //Put your to from date here
  to.setHours(0, 0, 0, 0); 
  let fromUnix = 0;
  let toUnix = 0;
  let depositAmount = new anchor.BN(30*LAMPORTS_PER_SOL); //Put your amount here
  let withdrawAmount = new anchor.BN(10*LAMPORTS_PER_SOL); //Put your amount here
  let employeeTitle = "Developer"; //Put your employee title here
  let employeeName = "John Doe"; //Put your employee name here
  let monthlyPay = new anchor.BN(0.5*LAMPORTS_PER_SOL); //Put your employee monthly pay here
  const isRecursive = true;

  //Mint
  let mint: PublicKey;
  let initializerAta: PublicKey;

  ///////////////////////////////////////////////////////////////////////////////////////////
  
  //Funding the wallet
  it("Starts an airdrop and confirms it", async () => {
    const signature = await provider.connection.requestAirdrop(keypair.publicKey, 100 * LAMPORTS_PER_SOL);
    const latestBlockhash = await connection.getLatestBlockhash();
    await provider.connection.confirmTransaction(
    {
        signature,
        ...latestBlockhash,
    },
  "finalized"
    );  
  })

  ///////////////////////////////////////////////////////////////////////////////////////////

  //PROJECT

  const id = new BN(Math.floor(Math.random() * 1000));

  // PDAs
  const project = [Buffer.from("project"), keypair.publicKey.toBuffer()];
  const [projectKey, _bump] = PublicKey.findProgramAddressSync(project, program.programId);
  const projectVault =  [Buffer.from("vault"), projectKey.toBuffer()]
  const [projectVaultKey, _anotherbump] = PublicKey.findProgramAddressSync(projectVault, program.programId);
 
  it("Creates a project", async () => {
    // Main Wallet 
    console.log("keypair: ", keypair.publicKey.toBase58())

    // Mint
    mint = await createMint(provider.connection, keypair, keypair.publicKey, keypair.publicKey, 6);
    console.log("\nHere's the ID or your newly minted token: ", mint.toString());

    // ATAs   
    const ata = await getOrCreateAssociatedTokenAccount(provider.connection, keypair, mint, keypair.publicKey);
    initializerAta = ata.address;
    console.log("\ninitializerAta created Succesfully!");    

    try {
      const tx = await program.methods
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
      let projectAccount = await program.account.project.fetch(projectKey);
      console.log(`\nAuth: ${projectAccount.authority}`);
      console.log(`\nProject Name: ${projectAccount.projectName}`);
      console.log(`\nBalance: ${projectAccount.balance}`);
      console.log(`\nMonthly Spending: ${projectAccount.monthlySpending}`);
    } catch (err) {
      console.log(err);
    }
  })

  /*
  it("Deposit token", async () => { 

    const mintTx = await mintTo(provider.connection, keypair, mint, initializerAta, keypair, 100*LAMPORTS_PER_SOL);
    console.log("\nSPL Token succesfully Minted!");

    try {
      const tx = await program.methods
      .projectDeposit(
        new anchor.BN(depositAmount),
      )
      .accounts({
        projectVault: projectVaultKey,
        project: projectKey,
        user: keypair.publicKey,
        userAta: initializerAta,
        token: mint,
        tokenProgram: tokenProgram,
        associatedTokenProgram: associatedTokenProgram,
        systemProgram: SystemProgram.programId,
      })
      .signers([
        keypair
      ]).rpc();

      let projectAccount = await program.account.project.fetch(projectKey);
      console.log(`\nBalance: ${projectAccount.balance}`);
    } catch (err) {
      console.log(err);
    }
  })

  it("Withdraw token", async () => { 

    try {
      const tx = await program.methods
      .projectWithdraw(
        new anchor.BN(withdrawAmount),
      )
      .accounts({
        projectVault: projectVaultKey,
        project: projectKey,
        user: keypair.publicKey,
        userAta: initializerAta,
        token: mint,
        tokenProgram: tokenProgram,
        associatedTokenProgram: associatedTokenProgram,
        systemProgram: SystemProgram.programId,
      })
      .signers([
        keypair
      ]).rpc();

      let projectAccount = await program.account.project.fetch(projectKey);
      console.log(`\nBalance: ${projectAccount.balance}`);
    } catch (err) {
      console.log(err);
    }
  })

  //Change name & auth
  /*
  const authTmp = new anchor.web3.Keypair();

  it("Change the Auth of the Project", async () => {
    // Tmp Wallet
    console.log("authTmp: ", authTmp.publicKey.toBase58())

    const tx = await program.methods
    .projectChangeAuth(
      authTmp.publicKey,
    )
    .accounts({
        project: projectKey,
        user: keypair.publicKey,
        systemProgram: SystemProgram.programId,
    })
    .signers([
      keypair
    ]).rpc();
  let projectAccount = await program.account.project.fetch(projectKey);
  console.log(`\nAuth: ${projectAccount.authority}`);
  })

  it("Change the Auth of the Project", async () => {
    const tx = await program.methods
    .projectChangeAuth(
      keypair.publicKey,
    )
    .accounts({
      project: projectKey,
      user: authTmp.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .signers([
      authTmp
    ]).rpc();
  let projectAccount = await program.account.project.fetch(projectKey);
  console.log(`\nAuth: ${projectAccount.authority}`);
  })

  it("Change the Name of the Project", async () => {
    let projectTmp = "WBA2"
    const tx = await program.methods
    .projectChangeName(
      projectTmp,
    )
    .accounts({
      project: projectKey,
      user: keypair.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .signers([
      keypair
    ]).rpc();
  let projectAccount = await program.account.project.fetch(projectKey);
  console.log(`\nProject Name: ${projectAccount.projectName}`);
  })


  ///////////////////////////////////////////////////////////////////////////////////////////

  //EMPLOYEE

  let employeeNumber = 0;

  const employee = [Buffer.from("employee"), projectKey.toBuffer(), employeeNumber.toBuffer()];
  const [employeeKey, _bumpbump] = PublicKey.findProgramAddressSync(employee, program.programId);

  it("Creates an Employee", async () => {
    try {
      const tx = await program.methods
      .employeeInit(
        employeeWallet.publicKey,
        employeeName,
        employeeTitle,
        monthlyPay,
        _bumpbump,
      )
      .accounts({
        projectVault: projectVaultKey,
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
      let employeeAccount = await program.account.employee.fetch(employeeKey);
      console.log(`\nProject: ${employeeAccount.project}`);
      console.log(`\nEmployee: ${employeeAccount.employee}`);
      console.log(`\nEmployee Title: ${employeeAccount.employeeTitle}`);
      console.log(`\nMonthly Pay: ${employeeAccount.monthlyPay}`);
      console.log(`\nIs Recursive: ${employeeAccount.isRecursive}`);

    } catch (err) {
      console.log(err);
    }
  })

  //Change title, pay & employee wallet
  /*

  it("Change the Title of the Employee", async () => {
    let employeeTmp = "Dev"
    try {
      const tx = await program.methods
      .employeeChangeTitle(
        employeeTmp,
      )
      .accounts({
        employee: employeeKey,
        project: projectKey,
        user: keypair.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([
        keypair
      ]).rpc();
      let employeeAccount = await program.account.employee.fetch(employeeKey);
      console.log(`\nEmployee Title: ${employeeAccount.employeeTitle}`);

    } catch (err) {
      console.log(err);
    }
  })

  it("Change the Monthly Pay of the Employee", async () => {
      let monthlyPayTmp = 1 * LAMPORTS_PER_SOL
      try {
        const tx = await program.methods
        .employeeChangePay(
          new anchor.BN(monthlyPayTmp),
        )
        .accounts({
          employee: employeeKey,
          project: projectKey,
          user: keypair.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([
          keypair
        ]).rpc();
        let employeeAccount = await program.account.employee.fetch(employeeKey);
        console.log(`\nMonthly Pay: ${employeeAccount.monthlyPay}`);
  
      } catch (err) {
        console.log(err);
      }
  })

  it("Change Employee Wallet", async () => {
    let employeeWalletTmp = new anchor.web3.Keypair();
    try {
      const tx = await program.methods
      .employeeChangeWallet(
        employeeWalletTmp.publicKey,
      )
      .accounts({
        employee: employeeKey,
        project: projectKey,
        user: keypair.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([
        keypair
      ]).rpc();
      let employeeAccount = await program.account.employee.fetch(employeeKey);
      console.log(`\nEmployee Wallet: ${employeeAccount.employee}`);

    } catch (err) {
      console.log(err);
    }
  })



///////////////////////////////////////////////////////////////////////////////////////////

//INVOICE

const invoice = [Buffer.from("invoice"), employeeKey.toBuffer()];
const [invoiceKey, _bumpbumpbump] = PublicKey.findProgramAddressSync(invoice, program.programId);
const invoiceVault =  [Buffer.from("vault"), invoiceKey.toBuffer()]
const [invoiceVaultKey, _anotherbumpbumpbump] = PublicKey.findProgramAddressSync(invoiceVault, program.programId);

if (isRecursive) {
  to = new Date(from.getFullYear(), from.getMonth() + 1, 0);

  fromUnix = from.getTime();
  toUnix = to.getTime();
} else {
  fromUnix = from.getTime();
  toUnix = to.getTime();
}

console.log(`\nFrom: ${from}`);
console.log(`\nTo: ${to}`);

it("Creates an Invoice", async () => {
  try {
    const tx = await program.methods
    .employeeActivate(
      new anchor.BN(fromUnix),
      new anchor.BN(toUnix),
      _bumpbumpbump,
      _anotherbumpbumpbump,
      isRecursive,
    )
    .accounts({
      projectVault: projectVaultKey,
      project: projectKey,
      employee: employeeKey,
      invoice: invoiceKey,
      invoiceVault: invoiceVaultKey,
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
    let invoiceAccount = await program.account.invoice.fetch(invoiceKey);
    console.log(`\nProject: ${invoiceAccount.project}`);
    console.log(`\nEmployee: ${invoiceAccount.employee}`);
    console.log(`\nEmployee Title: ${invoiceAccount.employeeTitle}`);
    console.log(`\nFrom: ${invoiceAccount.from}`);
    console.log(`\nTo: ${invoiceAccount.to}`);
    console.log(`\nBalance: ${invoiceAccount.balance}`);
    console.log(`\nHas Claimed: ${invoiceAccount.hasClaimed}`);



} catch (err) {
  console.log(err);
}

})

*/

})
