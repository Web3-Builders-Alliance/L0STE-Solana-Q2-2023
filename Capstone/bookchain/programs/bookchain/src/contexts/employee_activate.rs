use anchor_lang::{prelude::*};
use anchor_spl::token::{Mint, Token, TokenAccount, Transfer, transfer};
use anchor_spl::associated_token::AssociatedToken;

use crate::errors::EmplErr;
use crate::errors::ProjError;
use crate::state::project::Project;
use crate::state::employee::Employee;
use crate::state::invoice::Invoice;

#[derive(Accounts)]
#[instruction(id: u64)]
pub struct EmployeeActivate<'info> {
    #[account(
        mut,
        seeds = [b"vault", project.key().as_ref()],
        bump = project.vault_bump,
        token::mint = token,
        token::authority = project
    )]
    pub project_vault: Box<Account<'info, TokenAccount>>,

    //NB non è detto che sia l'initializer, mettere auth
    #[account(
        mut,
        seeds = [b"project", initializer.key().as_ref(), project.id.to_le_bytes().as_ref()],
        bump = project.project_bump,
    )]
    pub project: Account<'info, Project>,
    #[account(mut)]
    pub employee: Account<'info, Employee>,
    #[account(
        init,
        payer = initializer,
        seeds = [b"vault", invoice.key().as_ref()], 
        bump,
        token::mint = token,
        token::authority = invoice,
    )]
    pub invoice_vault: Box<Account<'info, TokenAccount>>, // The vault ATA
    #[account(
        init, 
        payer = initializer, 
        seeds = [b"invoice", employee.key().as_ref(), id.to_le_bytes().as_ref()], 
        bump,
        space = Invoice::space() + 20
    )]
    pub invoice: Account<'info, Invoice>,

    #[account(mut)]
    pub initializer: Signer<'info>,
    #[account(
        mut,
        associated_token::mint = token,
        associated_token::authority = initializer
    )]
    pub initializer_ata: Account<'info, TokenAccount>,
    pub token: Box<Account<'info, Mint>>,       // The token that is used as payment
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

impl<'info> EmployeeActivate<'info> {
    pub fn activate(
        &mut self,
        id: u64,
        from: i64,
        to: i64,
        invoice_bump: u8,
        vault_bump: u8,
        is_recursive: bool,
    ) -> Result<()> {
        require!(self.employee.monthly_pay < self.project.balance, EmplErr::NotEnoughFunds);
        require!(self.project.authority.key() == self.initializer.key(), ProjError::NotAuthorized);

        let id = id;
        let project = self.project.key();
        let employee = self.employee.key();
        let employee_title = &self.employee.employee_title;
        let from = from;
        let to = to;
        let balance = self.employee.monthly_pay*((to-from)  as u64)/(1000 * 60 * 60 * 24)/30;
        let has_claimed = false;
        let invoice_bump = invoice_bump;
        let vault_bump = vault_bump;

        self.invoice.init(
            id,
            project,
            employee,
            employee_title.to_string(),
            from,
            to,
            balance,
            has_claimed,
            invoice_bump,
            vault_bump,
        );

        // Change the employee state if the employee is recursive
        if is_recursive == true {
            self.employee.is_recursive = true;
        }

        //Send to Escrow the monthly_pay;
        let seeds = &[
            "project".as_bytes(),
            &self.initializer.key().clone().to_bytes(),
            &self.project.id.to_le_bytes(),
            &[self.project.project_bump]
        ];
        let signer_seeds = &[&seeds[..]];

        let cpi_program = self.system_program.to_account_info();
        let cpi_accounts = Transfer{
            from: self.project_vault.to_account_info(), 
            to: self.invoice_vault.to_account_info(),
            authority: self.project.to_account_info(),
        };
        let cpi_context = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

        transfer(cpi_context, balance)?;

        self.employee.invoice += 1;

        self.project.balance -= balance;
        self.project.monthly_spending += balance;

        Ok(())

    }
}
