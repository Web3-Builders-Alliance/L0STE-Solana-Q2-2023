use anchor_lang::{prelude::*};
use anchor_spl::token::{Mint, Token, TokenAccount, Transfer, transfer};
use anchor_spl::associated_token::AssociatedToken;

use crate::errors::EmplErr;
use crate::errors::InvErr;
use crate::state::project::Project;
use crate::state::employee::Employee;
use crate::state::invoice::Invoice;

#[derive(Accounts)]
#[instruction(id: u64)]
pub struct EmployeeClaim<'info> {
    #[account(
        mut,
        seeds = [b"vault", invoice.key().as_ref()], 
        bump = invoice.vault_bump,
        token::mint = token,
        token::authority = invoice,
    )]
    pub invoice_vault: Box<Account<'info, TokenAccount>>, // The vault ATA
    #[account(
        mut,
        seeds = [b"invoice", employee.key().as_ref(), invoice.id.to_le_bytes().as_ref()], 
        bump = invoice.invoice_bump,
    )]
    pub invoice: Account<'info, Invoice>,

    #[account(
        init,
        payer = employee_wallet,
        seeds = [b"vault", new_invoice.key().as_ref()], 
        bump,
        token::mint = token,
        token::authority = invoice,
    )]
    pub new_invoice_vault: Box<Account<'info, TokenAccount>>, // The vault ATA
    #[account(
        init, 
        payer = employee_wallet, 
        seeds = [b"invoice", employee.key().as_ref(), id.to_le_bytes().as_ref()], 
        bump,
        space = Invoice::space() + 20
    )]
    pub new_invoice: Account<'info, Invoice>,

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
        seeds = [b"project", project.authority.as_ref()],
        bump = project.project_bump,
    )]
    pub project: Account<'info, Project>,
    #[account(mut)]
    pub employee: Account<'info, Employee>,

    #[account(mut)]
    pub employee_wallet: Signer<'info>,
    pub employee_wallet_ata: Account<'info, TokenAccount>,
    pub token: Box<Account<'info, Mint>>,       // The token that is used as payment
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

impl<'info> EmployeeClaim<'info> {
    pub fn claim(
        &mut self,
        id: u64,
        from: i64,
        to: i64,
        invoice_bump: u8,
        vault_bump: u8,
    ) -> Result<()> {
        require!(Clock::get()?.unix_timestamp > self.invoice.to, InvErr::TimeNotPassed);
        require!(self.invoice.has_claimed == false, InvErr::AlreadyClaimed);
        require!(self.invoice.employee == self.employee.key(), InvErr::NotAuthorized);
        
        //Claim the Invoice
        let seeds = &[
            "vault".as_bytes(),
            &self.invoice.key().clone().to_bytes(),
            &self.invoice.id.to_le_bytes(),
            &[self.invoice.invoice_bump]
        ];
        let signer_seeds = &[&seeds[..]];

        let cpi_program = self.system_program.to_account_info();
        let cpi_accounts = Transfer{
            from: self.invoice_vault.to_account_info(), 
            to: self.employee_wallet.to_account_info(),
            authority: self.invoice.to_account_info(),
        };
        let cpi_context = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

        transfer(cpi_context, self.invoice.balance)?;
        
        self.invoice.has_claimed = true;

        //Set a new Invoice for the next month 
        if self.employee.is_recursive == true {
            require!(self.employee.monthly_pay < self.project.balance, EmplErr::NotEnoughFunds);

            //Project_state
            self.project.balance -= self.employee.monthly_pay;

            //Invoice_state
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
    
            //Send to Escrow the monthly_pay;
            let seeds = &[
                "project".as_bytes(),
                &self.project.authority.key().clone().to_bytes(),
                &self.project.id.to_le_bytes(),
                &[self.project.project_bump]
            ];
            let signer_seeds = &[&seeds[..]];
    
            let cpi_program = self.system_program.to_account_info();
            let cpi_accounts = Transfer{
                from: self.project_vault.to_account_info(), 
                to: self.new_invoice_vault.to_account_info(),
                authority: self.project.to_account_info(),
            };
            let cpi_context = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
    
            transfer(cpi_context, balance)?;
    
            self.employee.invoice += 1;
    
            self.project.balance -= balance; 
        } else {
            self.project.monthly_spending -= self.employee.monthly_pay;
        }

        Ok(())
    
    }
}