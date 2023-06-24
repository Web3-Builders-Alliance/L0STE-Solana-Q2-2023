use anchor_lang::{prelude::*};
use anchor_spl::token::{Mint, Token, TokenAccount};
use anchor_spl::associated_token::AssociatedToken;

use crate::errors::EmplErr;
use crate::state::project::Project;
use crate::state::employee::Employee;

#[derive(Accounts)]
pub struct EmployeeChangeState<'info> {
    #[account(
        mut,
        seeds = [b"employee", project.key().as_ref()], 
        bump = employee.employee_bump,
    )]
    pub employee: Account<'info, Employee>,
    #[account(
        mut,
        seeds = [b"project", user.key().as_ref()],
        bump = project.project_bump,
        constraint = user.key() == project.authority,
    )]
    pub project: Account<'info, Project>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

impl<'info> EmployeeChangeState<'info> {
    pub fn employee_change_wallet(
        &mut self,
        employee: Pubkey,
    ) -> Result<()> {
        self.employee.employee = employee;

        Ok(())
    }
}

impl<'info> EmployeeChangeState<'info> {
    pub fn employee_change_title(
        &mut self,
        employee_title: String,
    ) -> Result<()> {
        require!(employee_title.len() <20, EmplErr::TitleTooLong);
        self.employee.employee_title = employee_title;

        Ok(())
    }
}

impl<'info> EmployeeChangeState<'info> {
    pub fn employee_change_pay(
        &mut self,
        monthly_pay: u64,
    ) -> Result<()> {
        require!(monthly_pay > 0, EmplErr::PayTooLow);
        self.employee.monthly_pay = monthly_pay;

        Ok(())
    }
}