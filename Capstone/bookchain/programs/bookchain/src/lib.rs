use anchor_lang::prelude::*;

mod contexts;
mod errors;
mod state;

use contexts::*;
use error::*;
use state::*;



declare_id!("2qp7cHAarp2APej97MJ6xwrn4oPRiRb7464pJGarQ4vp");

#[program]
pub mod bookchain {
    use super::*;

    pub fn project_init(
        ctx: Context<ProjectInit>,
        project_bump: u8,
        vault_bump: u8,
        project_name: String,
    ) -> Result<()> {
        // Initialise our project config
        ctx.accounts.init(project_name, project_bump, vault_bump)
    }

    //QUESTION: If the the accounts are the same, should i use it both for withdraw and deposit?
    pub fn project_deposit(
        ctx: Context<ProjectChangeBalance>,
        deposit_amount: u64,
    ) -> Result<()> {
        ctx.accounts.project_deposit(deposit_amount)
    }

    pub fn project_withdraw(
        ctx: Context<ProjectChangeBalance>,
        withdraw_amount: u64,
    ) -> Result<()> {
        ctx.accounts.project_withdraw(withdraw_amount)
    }

    pub fn project_change_auth(
        ctx: Context<ProjectChangeState>,
        auth: Pubkey,
    ) -> Result<()> {
        ctx.accounts.project_change_auth(auth)
    }

    pub fn project_change_name(
        ctx: Context<ProjectChangeState>,
        project_name: String,
    ) -> Result<()> {
        ctx.accounts.project_change_name(project_name)
    }

    pub fn employee_init(
        ctx: Context<EmployeeInit>,
        employee: Pubkey,
        employee_name: String,
        employee_title: String,
        monthly_pay: u64,
        employee_bump: u8,
    ) -> Result<()> {
        ctx.accounts.init(employee, employee_name, employee_title, monthly_pay, employee_bump)
    }

    pub fn employee_change_pay(
        ctx: Context<EmployeeChangeState>,
        monthly_pay: u64,
    ) -> Result<()> {
        ctx.accounts.employee_change_pay(monthly_pay)
    }

    pub fn employee_change_title(
        ctx: Context<EmployeeChangeState>,
        employee_title: String,
    ) -> Result<()> {
        ctx.accounts.employee_change_title(employee_title)
    }

    pub fn employee_change_wallet(
        ctx: Context<EmployeeChangeState>,
        employee: Pubkey,
    ) -> Result<()> {
        ctx.accounts.employee_change_wallet(employee)
    }

    //Missing stop being recursive

    pub fn employee_activate(
        ctx: Context<EmployeeActivate>,
        from: i64,
        to: i64,
        invoice_bump: u8,
        vault_bump: u8,
        is_recursive: bool,
    ) -> Result<()> {
        ctx.accounts.activate(from, to, invoice_bump, vault_bump, is_recursive)
    }

    pub fn employee_claim(
        ctx: Context<EmployeeClaim>,
        from: i64,
        to: i64,
        invoice_bump: u8,
        vault_bump: u8,
    ) -> Result<()> {
        ctx.accounts.claim(from, to, invoice_bump, vault_bump)
    }


}
