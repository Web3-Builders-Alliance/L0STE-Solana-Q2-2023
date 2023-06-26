use anchor_lang::{prelude::*};

use crate::errors::EmplErr;
use crate::errors::ProjError;
use crate::state::project::Project;
use crate::state::employee::Employee;

#[derive(Accounts)]
pub struct EmployeeChangeState<'info> {
    #[account(mut)]
    pub project: Account<'info, Project>,
    #[account(
        mut,
        seeds = [b"employee", project.key().as_ref()], 
        bump = employee.employee_bump,
    )]
    pub employee: Account<'info, Employee>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

impl<'info> EmployeeChangeState<'info> {
    pub fn employee_change_wallet(
        &mut self,
        employee: Pubkey,
    ) -> Result<()> {
        require!(self.project.authority.key() == self.user.key(), ProjError::NotAuthorized);

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
        require!(self.project.authority.key() == self.user.key(), ProjError::NotAuthorized);

        self.employee.employee_title = employee_title;

        Ok(())
    }
}

impl<'info> EmployeeChangeState<'info> {
    pub fn employee_change_name(
        &mut self,
        employee_name: String,
    ) -> Result<()> {
        require!(employee_name.len() <20, EmplErr::NameTooLong);
        require!(self.project.authority.key() == self.user.key(), ProjError::NotAuthorized);

        self.employee.employee_name = employee_name;

        Ok(())
    }
}

impl<'info> EmployeeChangeState<'info> {
    pub fn employee_change_pay(
        &mut self,
        monthly_pay: u64,
    ) -> Result<()> {
        require!(monthly_pay > 0, EmplErr::PayTooLow);
        require!(self.project.authority.key() == self.user.key(), ProjError::NotAuthorized);

        self.employee.monthly_pay = monthly_pay;

        Ok(())
    }
}

impl<'info> EmployeeChangeState<'info> {
    pub fn employee_change_recursive(
        &mut self,
    ) -> Result<()> {
        require!(self.employee.is_recursive == true, EmplErr::NotRecursive);
        require!(self.project.authority.key() == self.user.key(), ProjError::NotAuthorized);

        self.employee.is_recursive = false;

        Ok(())
    }
}