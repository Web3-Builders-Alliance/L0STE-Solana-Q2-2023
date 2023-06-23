mod account;
mod state;
mod error;

use crate::account::*;
use crate::error::*;
pub use crate::state::*;

use anchor_lang::prelude::*;
use anchor_lang::system_program;
use solana_program::program::{invoke_signed, invoke};
use anchor_spl::{token::{TokenAccount, Mint, Token, Transfer, transfer, CloseAccount, close_account}, associated_token::AssociatedToken};
use solana_program::slot_hashes::SlotHashes;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod escrow {
    use anchor_lang::solana_program::slot_hashes;

    use super::*;

    // Initialize the escrow account
    pub fn initialize(
        ctx: Context<Initialize>,
        seed: u64,
        deposit_amount: u64,
        offer_amount: u64,
        expires: u64
    ) -> Result<()> {
        // Set up our escrow variables
        
        let escrow = &mut ctx.accounts.escrow;

        escrow.maker = *ctx.accounts.maker.key;
        escrow.maker_token = *ctx.accounts.maker_token.to_account_info().key;
        escrow.taker_token = *ctx.accounts.taker_token.to_account_info().key;
        escrow.seed = seed;
        escrow.maker_offer_amount = offer_amount;
        escrow.maker_deposit_amount = deposit_amount;
 
        escrow.auth_bump = *ctx.bumps.get("auth").unwrap();
        escrow.vault_bump = *ctx.bumps.get("vault").unwrap();
        escrow.escrow_bump = *ctx.bumps.get("escrow").unwrap();

        if expires > 0 {
            escrow.expires_at = Clock::get()?.slot + expires;
        } else {
            escrow.expires_at = 0;
        }
        
        // Transfer maker tokens to the vault
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_accounts = Transfer{
            from: ctx.accounts.maker_ata.to_account_info(),
            to: ctx.accounts.vault.to_account_info(),
            authority: ctx.accounts.maker.to_account_info(),
        };
        let ctx = CpiContext::new(cpi_program, cpi_accounts);
        transfer(ctx, deposit_amount)?;

        Ok(())
    }

    // Cancel and refund escrow to the maker
    pub fn refund(ctx: Context<Refund>) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        let token_program = &ctx.accounts.token_program;
        let vault = &ctx.accounts.vault;
        let maker = &ctx.accounts.maker;
        let auth = &ctx.accounts.auth;

        //Empty the vault
        let signer_seeds = &[
            &b"auth"[..],
            &[escrow.auth_bump],
        ];

        let cpi_program = token_program.to_account_info();
        let cpi_accounts = Transfer {
            from: ctx.accounts.vault.to_account_info(),
            to: ctx.accounts.maker_ata.to_account_info(),
            authority: ctx.accounts.auth.to_account_info(),
        };
        let binding = [&signer_seeds[..]];
        let ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, &binding);
                
        transfer(ctx, escrow.maker_deposit_amount)?;

        //Close the vault
        let signer_seeds = &[
            &b"auth"[..],
            &[escrow.auth_bump],
        ];

        let cpi_program = token_program.to_account_info();
        let cpi_accounts = CloseAccount {
            account: vault.to_account_info(),
            destination: maker.to_account_info(),
            authority: auth.to_account_info(),
        };
        let binding = [&signer_seeds[..]];
        let ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, &binding);
        close_account(ctx);

        Ok(())
    }

    // Allow maker to change the token and offer amount of the escrow
    pub fn update(
        ctx: Context<Update>,
        offer_amount: u64,
        expires: u64
    ) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        escrow.taker_token = *ctx.accounts.new_taker_token.to_account_info().key;
        escrow.maker_offer_amount = offer_amount;

        if expires > 0 {
            escrow.expires_at = Clock::get()?.slot + expires;
        } else {
            escrow.expires_at = 0;
        }
    
        Ok(())
    }

    // Allow taker to accept the escrow
    pub fn take(ctx: Context<Take>) -> Result<()> {
        let escrow = &ctx.accounts.escrow;
        let token_program = &ctx.accounts.token_program;
        let vault = &ctx.accounts.vault;
        let taker_receive_ata = &ctx.accounts.taker_receive_ata;
        let auth = &ctx.accounts.auth;
        let maker = &ctx.accounts.maker;

        if Clock::get()?.slot < ctx.accounts.escrow.expires_at && ctx.accounts.escrow.expires_at != 0 {
            //Tranfer the token from the guy that accepted to the maker
            let cpi_context = ctx.accounts.token_program.to_account_info();
            let cpi_accounts = Transfer {
                from: ctx.accounts.taker_ata.to_account_info(),
                to: ctx.accounts.maker_receive_ata.to_account_info(),
                authority: ctx.accounts.taker.to_account_info(),
            };
            let ctx = CpiContext::new(cpi_context, cpi_accounts);
            transfer(ctx, escrow.maker_offer_amount)?;

            //Transfer the deposit from the vault to the taker
            let cpi_context = token_program.to_account_info();
            let cpi_accounts = Transfer {
                from: vault.to_account_info(),
                to: taker_receive_ata.to_account_info(),
                authority: auth.to_account_info(),
            };

            let signer_seeds = &[
                &b"auth"[..],
                &[escrow.auth_bump],
            ];
            let binding = [&signer_seeds[..]];

            let ctx = CpiContext::new_with_signer(cpi_context, cpi_accounts, &binding);
            transfer(ctx, escrow.maker_deposit_amount)?;
            
            //Close the vault
            let cpi_context = token_program.to_account_info();
            let cpi_accounts = CloseAccount {
                account: vault.to_account_info(),
                destination: maker.to_account_info(),
                authority: auth.to_account_info(),
            };

            let signer_seeds = &[
                &b"auth"[..],
                &[escrow.auth_bump],
            ];
            let binding = [&signer_seeds[..]];

            let ctx = CpiContext::new_with_signer(cpi_context, cpi_accounts, &binding);
            close_account(ctx)
        } else {
            return 
            Err(EscrowError::EscrowExpired.into());
        }
    }

}


