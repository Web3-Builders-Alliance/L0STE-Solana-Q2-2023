import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { WbaVault } from "../target/types/wba_vault";
import { Connection, clusterApiUrl, ConfirmOptions, PublicKey, SystemProgram, LAMPORTS_PER_SOL} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, createMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";

describe("wba-vault", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.getProvider();

  anchor.AnchorProvider.env().opts.commitment = "finalized";

  const program = anchor.workspace.WbaVault as Program<WbaVault>;

  // Generate new keypair
  const keypair = anchor.web3.Keypair.generate();

  const connection = new Connection("https://api.devnet.solana.com");

  // Create a new keypair
  const vaultState = anchor.web3.Keypair.generate();
  console.log("Vault State Public Key: ", vaultState.publicKey.toBase58());

  // Create the PDA for our vault auth
  const vaultAuth_seeds = [Buffer.from("auth"), vaultState.publicKey.toBuffer()];
  const [vaultAuth_key, _bump] = PublicKey.findProgramAddressSync(vaultAuth_seeds, program.programId);

  // Create the PDA for our vault
  const vault_seeds = [Buffer.from("vault"), vaultAuth_key.toBuffer()];
  const [vault_key, _anotherBump] = PublicKey.findProgramAddressSync(vault_seeds, program.programId);

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

  it ("Check Balance", async () => {
    let accountBalance = await provider.connection.getBalance(keypair.publicKey);
    console.log("\nNEW Wallet Balance: ", accountBalance/LAMPORTS_PER_SOL);
  })

it("Is initialized!", async () => {
  // Add your test here.
    const signature = await program.methods
    .initialize()
    .accounts({
        owner: keypair.publicKey,
        vaultState: vaultState.publicKey,
        vaultAuth: vaultAuth_key,
        vault: vault_key,
        systemProgram: SystemProgram.programId,
    })
    .signers([
        keypair,
        vaultState,
    ]).rpc();
    console.log("\nSuccess! Your Vault is Initialized\n");
  });

  it("Deposit SOL", async () => {
    const signature = await program.methods
    .deposit(
      new anchor.BN(2*LAMPORTS_PER_SOL) 
    )
    .accounts({
      owner: keypair.publicKey,
      vaultState: vaultState.publicKey,
      vaultAuth: vaultAuth_key,
      vault: vault_key,
      systemProgram: SystemProgram.programId,
    })
    .signers([
        keypair
    ]).rpc();
    console.log("\nSuccess! You Sent 2 Sol to the Vault\n");
    let accountBalance = await provider.connection.getBalance(vault_key);
    console.log("\nNEW Vault Balance: ", accountBalance/LAMPORTS_PER_SOL);
    })

    it("Withdraw SOL", async () => {
        const signature = await program.methods
          .withdraw(
            new anchor.BN(1 * LAMPORTS_PER_SOL)
          )
          .accounts({
            owner: keypair.publicKey,
            vaultState: vaultState.publicKey,
            vaultAuth: vaultAuth_key,
            vault: vault_key,
            systemProgram: SystemProgram.programId,
          })
          .signers([
            keypair
          ]).rpc();
    
        let latestBlockHash = await provider.connection.getLatestBlockhash()
    
        await provider.connection.confirmTransaction({
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: signature,
        });
        console.log("\nSuccess! You Withdrew 1 Sol from the Vault\n");
        let accountBalance = await provider.connection.getBalance(vault_key);
        console.log("\nNEW Vault Balance: ", accountBalance / LAMPORTS_PER_SOL);
        console.log(vault_key);
        
    });

    it("Deposit and Withdraw SPL-Token from the Vault", async () => {
        

      const mint = await createMint(provider.connection, keypair, keypair.publicKey, keypair.publicKey, 6);
      console.log("\nHere's the ID or your newly minted token: ", mint.toString());

      const ownerAta = await getOrCreateAssociatedTokenAccount(provider.connection, keypair, mint, keypair.publicKey);
      console.log("\nOwnerATA created Succesfully!");    
      const vaultAta = await getOrCreateAssociatedTokenAccount(provider.connection, keypair, mint, vaultAuth_key, true);
      console.log("\nVaultATA created Succesfully!");  
      
      const mintTx = await mintTo(provider.connection, keypair, mint, ownerAta.address, keypair, 10*1_000_000);
      console.log("\nSPL Token succesfully Minted!");

      const depositTx = await program.methods
      .depositSpl(
          new anchor.BN(2*1_000_000) 
      )
      .accounts({
          owner: keypair.publicKey,
          vaultState: vaultState.publicKey,
          vaultAuth: vaultAuth_key,
          systemProgram: SystemProgram.programId,
          ownerAta: ownerAta.address,
          vaultAta: vaultAta.address,
          tokenMint: mint,
          tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([
          keypair
      ]).rpc();
      console.log("\nSPL Token Succesfully Sent to the Vault ");

      const withdrawtx = await program.methods
      .withdrawSpl(
            new anchor.BN(1*1_000_000)  
        )
        .accounts({
            owner: keypair.publicKey,
            vaultState: vaultState.publicKey,
            vaultAuth: vaultAuth_key,
            systemProgram: SystemProgram.programId,
            ownerAta: ownerAta.address,
            vaultAta: vaultAta.address,
            tokenMint: mint,
            tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([
            keypair
        ]).rpc();
        console.log("\nSPL Token Succesfully Withdrawn from the Vault ");
  })

  it("Close Vault", async () => {
        
    const tx = await program.methods
    .closeVault()
    .accounts({
        owner: keypair.publicKey,
        vaultState: vaultState.publicKey,
        systemProgram: SystemProgram.programId,
    })
    .signers([
        keypair
    ]).rpc();
    console.log("\nClosing the Vault ");
})


})
