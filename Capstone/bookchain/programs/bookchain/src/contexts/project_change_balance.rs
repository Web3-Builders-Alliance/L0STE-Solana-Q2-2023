use anchor_lang::{prelude::*};
use anchor_spl::token::{Mint, Token, TokenAccount, Transfer, transfer};
use anchor_spl::associated_token::AssociatedToken;

use crate::errors::ProjError;
use crate::state::project::Project;

#[derive(Accounts)]
pub struct ProjectChangeBalance<'info> {
    #[account(
        mut,
        seeds = [b"vault", project.key().as_ref()],
        bump = project.vault_bump,
        token::mint = token,
        token::authority = project
    )]
    pub project_vault: Box<Account<'info, TokenAccount>>,
    #[account(
        mut,
        seeds = [b"project", user.key().as_ref(), project.id.to_le_bytes().as_ref()],
        bump = project.project_bump,
    )]
    pub project: Account<'info, Project>,

    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        mut,
        associated_token::mint = token,
        associated_token::authority = user
    )]
    pub user_ata: Account<'info, TokenAccount>,
    pub token: Box<Account<'info, Mint>>,       // The token that is used as payment
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

impl<'info> ProjectChangeBalance<'info> {
    pub fn project_deposit(
        &mut self,
        deposit_amount: u64,
    ) -> Result<()> {
        //We don't want the user to deposit anything <0
        require!(deposit_amount > 0, ProjError::DepositErr);
        require!(self.project.authority.key() == self.user.key(), ProjError::NotAuthorized);

        let cpi_program = self.system_program.to_account_info();
        let cpi_accounts = Transfer{
            from: self.user_ata.to_account_info(), 
            to: self.project_vault.to_account_info(),
            authority: self.user.to_account_info(),
        };
        let cpi_context = CpiContext::new(cpi_program, cpi_accounts);

        transfer(cpi_context, deposit_amount)?;

        self.project.balance += deposit_amount;

        Ok(())
    }
}

impl<'info> ProjectChangeBalance<'info> {
    pub fn project_withdraw(
        &mut self,
        withdraw_amount: u64,
    ) -> Result<()> {
        //We don't want the user to withdraw more than the project balance
        require!(withdraw_amount < self.project.balance, ProjError::WithdrawErr);
        require!(self.project.authority.key() == self.user.key(), ProjError::NotAuthorized);

        let seeds = &[
            "project".as_bytes(),
            &self.user.key().clone().to_bytes(),
            &self.project.id.to_le_bytes(),
            &[self.project.project_bump]
        ];
        let signer_seeds = &[&seeds[..]];

        let cpi_program = self.system_program.to_account_info();
        let cpi_accounts = Transfer{
            from: self.project_vault.to_account_info(), 
            to: self.user_ata.to_account_info(),
            authority: self.project.to_account_info(),
        };
        let cpi_context = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

        transfer(cpi_context, withdraw_amount)?;

        self.project.balance -= withdraw_amount;

        Ok(())
    }
}