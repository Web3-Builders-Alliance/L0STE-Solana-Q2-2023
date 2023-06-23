use anchor_lang::prelude::*;
use anchor_lang::system_program;
use anchor_spl::token::TokenAccount;
use solana_program::program::{invoke_signed, invoke};
use anchor_spl::token;

//In this Smart Contract there is Native Solana & Anchor Solana to do different tasks. 
//Here is the context: https://solana.stackexchange.com/questions/1483/what-is-the-difference-between-making-a-cpi-using-anchors-cpicontextnew-with

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod class {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.vault_state.owner = *ctx.accounts.owner.key;
        ctx.accounts.vault_state.auth_bump = *ctx.bumps.get("vault_auth").unwrap();
        ctx.accounts.vault_state.vault_bump = *ctx.bumps.get("vault").unwrap();
        ctx.accounts.vault_state.score = 0;

        Ok(())
    }

    pub fn deposit (ctx: Context<Deposit>, amount: u64) -> Result<()> {
        
    /*  //Anchor Version:

        //We need to create a CPI (Cross-Program Invocations) and use the transfer program
        let cpi_program = ctx.accounts.system_program.to_account_info();
        let cpi_accounts = system_program::Transfer{
            from: ctx.accounts.owner.to_account_info(), 
            to: ctx.accounts.vault.to_account_info()
        };
        let cpi_context = CpiContext::new(cpi_program, cpi_accounts);
        
        system_program::transfer(cpi_context, amount)?;    */

        //Native Version:

        let transfer_instruction = &solana_program::system_instruction::transfer(&ctx.accounts.owner.key(), &ctx.accounts.vault.key(), amount);
        invoke(transfer_instruction, &[ctx.accounts.owner.to_account_info(), ctx.accounts.vault.to_account_info()])?;
        
        Ok(())
    }

    pub fn withdraw (ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        //Create the PDA seeds. It need 3 value: the name, the ID and the auth_key
        let seeds = &[
            "vault".as_bytes(),
            &ctx.accounts.vault_auth.key().clone().to_bytes(),
            &[ctx.accounts.vault_state.vault_bump]
        ];

        //Anchor Version:

        let signer_seeds = &[&seeds[..]];

        //Create the variables for the CPI : 
        let cpi_program = ctx.accounts.system_program.to_account_info();
        let cpi_accounts = anchor_lang::system_program::Transfer {
            from: ctx.accounts.vault.to_account_info(),
            to: ctx.accounts.vault_state.to_account_info(),
        };

        //To use a PDA to sign the CPI instead of using CpiContext::new you need CpiContext::new_with_signer
        let cpi_context = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
        system_program::transfer(cpi_context, amount)?;    

    /*  //Native version:

        let transfer_instruction = &solana_program::system_instruction::transfer(&ctx.accounts.vault.key(), &ctx.accounts.owner.key(), amount);
        invoke_signed(transfer_instruction, &[ctx.accounts.vault.to_account_info(), ctx.accounts.owner.to_account_info()], &[seeds])?;  */

        Ok(())
    }

    pub fn deposit_spl (ctx: Context<DepositSpl>, amount: u64) -> Result<()> {
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_accounts = token::Transfer{
            from: ctx.accounts.owner_ata.to_account_info(), 
            to: ctx.accounts.vault_ata.to_account_info(),
            authority: ctx.accounts.owner.to_account_info()
        };
        let cpi_context = CpiContext::new(cpi_program, cpi_accounts);
        
        token::transfer(cpi_context, amount)?; 
        Ok(())
    }

    pub fn withdraw_spl (ctx: Context<WithdrawSpl>, amount: u64) -> Result<()> {
        //Create the PDA seeds. It need 3 value: the name, the ID and the auth_key
        let seeds = &[
            "auth".as_bytes(),
            &ctx.accounts.vault_state.key().clone().to_bytes(),
            &[ctx.accounts.vault_state.auth_bump]
        ];
        let signer_seeds = &[&seeds[..]];

        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_accounts = token::Transfer{
            from: ctx.accounts.vault_ata.to_account_info(), 
            to: ctx.accounts.owner_ata.to_account_info(),
            authority: ctx.accounts.vault_auth.to_account_info()
        };
        let cpi_context = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
        
        token::transfer(cpi_context, amount)?; 
        Ok(())
    }

    pub fn close_vault (ctx: Context<CloseVault>) -> Result<()> {
        Ok(())
    }
} 


#[derive(Accounts)]
pub struct Initialize<'info> { //all the <'info> will be around as much as Initialize will be
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(init, payer = owner, space = 8 + 32 + 1 + 1 + 1, )]
    pub vault_state: Account<'info, Vaultstate>,
    #[account(seeds = [b"auth", vault_state.key().as_ref()], bump)]
    /// CHECK: don't need to check this
    pub vault_auth: UncheckedAccount<'info>,
    #[account(seeds = [b"vault", vault_auth.key().as_ref()], bump)]
    pub vault: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deposit<'info> { 
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(mut)] //Changes: We don't need to initialize the account + don't need to pay. We need to change the score == (mut) + check if the signer is the same of the one that initialized the account
    pub vault_state: Account<'info, Vaultstate>,
    #[account(seeds = [b"auth", vault_state.key().as_ref()], bump = vault_state.auth_bump)] //Changes: we don't need to create it but just call the bump in vaultState struct
    /// CHECK: don't need to check this
    pub vault_auth: UncheckedAccount<'info>,
    #[account(mut, seeds = [b"vault", vault_auth.key().as_ref()], bump = vault_state.vault_bump)] //Changes: we don't need to create it but just call the bump in vaultState struct + it need to accept solana so need to be (mut)
    pub vault: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> { 
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(mut, has_one = owner)]
    pub vault_state: Account<'info, Vaultstate>,
    #[account(seeds = [b"auth", vault_state.key().as_ref()], bump = vault_state.auth_bump)]
    /// CHECK: don't need to check this
    pub vault_auth: UncheckedAccount<'info>,
    #[account(mut, seeds = [b"vault", vault_auth.key().as_ref()], bump = vault_state.vault_bump)]
    pub vault: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
} 

#[derive(Accounts)]
pub struct DepositSpl<'info> { 
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(mut)] 
    pub owner_ata: Account<'info, TokenAccount>, //This is the associated token account that we are transferring the token from
    #[account(mut, has_one = owner)]
    pub vault_state: Account<'info, Vaultstate>,
    #[account(seeds = [b"auth", vault_state.key().as_ref()], bump = vault_state.auth_bump)]
    /// CHECK: don't need to check this
    pub vault_auth: UncheckedAccount<'info>,
    #[account(mut)]
    pub vault_ata: Account<'info, TokenAccount>, //This is the associated token account that we are transferring the token to
    /// CHECK: This is the token program
    pub token_mint: UncheckedAccount< 'info>,
    pub token_program: Program<'info, token::Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct WithdrawSpl<'info> { 
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(mut)] 
    pub owner_ata: Account<'info, TokenAccount>, //This is the associated token account that we are transferring the token from
    #[account(mut, has_one = owner)]
    pub vault_state: Account<'info, Vaultstate>,
    #[account(seeds = [b"auth", vault_state.key().as_ref()], bump = vault_state.auth_bump)]
    /// CHECK: don't need to check this
    pub vault_auth: UncheckedAccount<'info>,
    #[account(mut)]
    pub vault_ata: Account<'info, TokenAccount>, //This is the associated token account that we are transferring the token to
    /// CHECK: This is the token program
    pub token_mint: UncheckedAccount< 'info>,
    pub token_program: Program<'info, token::Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CloseVault<'info> { 
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(mut, has_one = owner, close = owner)]
    pub vault_state: Account<'info, Vaultstate>,

    pub system_program: Program<'info, System>,
}


#[account]
pub struct Vaultstate {
    owner: Pubkey,
    auth_bump: u8,
    vault_bump: u8,
    score: u8,
}