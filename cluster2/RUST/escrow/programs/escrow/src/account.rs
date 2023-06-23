use anchor_lang::prelude::*;
use anchor_spl::{token::{Mint, TokenAccount, Token, Transfer, transfer}, associated_token::AssociatedToken};

use crate::state::*;

#[derive(Accounts)]
#[instruction(seed: u64)]
pub struct Initialize<'info> {
    #[account(mut)]             //Guy that is making the trade 
    pub maker: Signer<'info>,
    #[account(
        mut,
        associated_token::mint = maker_token,
        associated_token::authority = maker
    )]
    pub maker_ata: Account<'info, TokenAccount>,
    pub maker_token: Box<Account<'info, Mint>>,
    pub taker_token: Box<Account<'info, Mint>>,
    #[account(
        seeds = [b"auth"],
        bump
    )]
    /// CHECK: This is not dangerous because this account doesn't exist
    pub auth: UncheckedAccount<'info>,
    #[account(
        init,
        payer = maker,
        seeds = [b"vault", escrow.key().as_ref()],
        bump,
        token::mint = maker_token,
        token::authority = auth
    )]
    pub vault: Account<'info, TokenAccount>,
    #[account(
        init,
        payer = maker,
        seeds = [b"escrow", maker.key.as_ref(), seed.to_le_bytes().as_ref()],
        bump,
        space = Escrow::space()
    )]
    pub escrow: Box<Account<'info, Escrow>>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct Refund<'info> {
    #[account(mut)]
    pub maker: Signer<'info>,
    #[account(
        mut,
        associated_token::mint = maker_token,
        associated_token::authority = maker
    )]
    pub maker_ata: Account<'info, TokenAccount>,
    pub maker_token: Account<'info, Mint>,
    #[account(
        seeds = [b"auth"],
        bump = escrow.auth_bump
    )]
    /// CHECK: This is not dangerous because this account doesn't exist
    pub auth: UncheckedAccount<'info>,
    #[account(
        mut,
        seeds = [b"vault", escrow.key().as_ref()],
        bump = escrow.vault_bump,
        token::mint = maker_token,
        token::authority = auth
    )]
    pub vault: Account<'info, TokenAccount>,
    #[account(
        mut,
        has_one = maker,
        has_one = maker_token,
        seeds = [b"escrow", maker.key.as_ref(), escrow.seed.to_le_bytes().as_ref()],
        bump = escrow.escrow_bump,
        close = maker
    )]
    pub escrow: Box<Account<'info, Escrow>>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>   
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub maker: Signer<'info>,
    pub new_taker_token: Account<'info, Mint>,
    #[account(
        mut,
        has_one = maker,
        seeds = [b"escrow", maker.key.as_ref(), escrow.seed.to_le_bytes().as_ref()],
        bump = escrow.escrow_bump
    )]
    pub escrow: Box<Account<'info, Escrow>>,
    pub system_program: Program<'info, System>   
}

#[derive(Accounts)]
pub struct Take<'info> {
    #[account(mut)]
    pub maker: SystemAccount<'info>,
    #[account(
        init,
        payer = taker,
        associated_token::mint = taker_token,
        associated_token::authority = maker
    )]
    pub maker_receive_ata: Account<'info, TokenAccount>,
    pub maker_token: Box<Account<'info, Mint>>,
    #[account(mut)]
    pub taker: Signer<'info>,
    #[account(
        mut,
        associated_token::mint = taker_token,
        associated_token::authority = taker
    )]
    pub taker_ata: Account<'info, TokenAccount>,
    #[account(
        init,
        payer = taker,
        associated_token::mint = maker_token,
        associated_token::authority = taker
    )]
    pub taker_receive_ata: Account<'info, TokenAccount>,
    pub taker_token: Box<Account<'info, Mint>>,
    #[account(
        seeds = [b"auth"],
        bump = escrow.auth_bump
    )]
    /// CHECK: This is not dangerous because this account doesn't exist
    pub auth: UncheckedAccount<'info>,
    #[account(
        mut,
        seeds = [b"vault", escrow.key().as_ref()],
        bump = escrow.vault_bump,
        token::mint = maker_token,
        token::authority = auth
    )]
    pub vault: Account<'info, TokenAccount>,
    #[account(
        mut,
        has_one = maker,
        has_one = taker_token,
        has_one = maker_token,
        seeds = [b"escrow", maker.key.as_ref(), escrow.seed.to_le_bytes().as_ref()],
        bump = escrow.escrow_bump,
        close = taker
    )]
    pub escrow: Box<Account<'info, Escrow>>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>
}