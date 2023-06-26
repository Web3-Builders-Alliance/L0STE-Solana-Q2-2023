use anchor_lang::prelude::*;

mod contexts;
mod errors;
mod state;

use contexts::*;



declare_id!("HwnJp9Gkz8uBX5e3GC2B1cbp95iVy5CCjFUZ4DTFrsFW");

#[program]
pub mod bookchain {
    use super::*;

    pub fn project_init(
        ctx: Context<ProjectInit>,
        id: u64,
        project_bump: u8,
        vault_bump: u8,
        project_name: String,
    ) -> Result<()> {
        // Initialise our project config
        ctx.accounts.init(id, project_name, project_bump, vault_bump)
    }

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
        id: u8,
        employee: Pubkey,
        employee_name: String,
        employee_title: String,
        monthly_pay: u64,
        employee_bump: u8,
    ) -> Result<()> {
        ctx.accounts.init(id, employee, employee_name, employee_title, monthly_pay, employee_bump)
    }

    pub fn employee_change_pay(
        ctx: Context<EmployeeChangeState>,
        monthly_pay: u64,
    ) -> Result<()> {
        ctx.accounts.employee_change_pay(monthly_pay)
    }

    pub fn employee_change_name(
        ctx: Context<EmployeeChangeState>,
        employee_name: String,
    ) -> Result<()> {
        ctx.accounts.employee_change_name(employee_name)
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

    pub fn employee_change_recursive(
        ctx: Context<EmployeeChangeState>,
    ) -> Result<()> {
        ctx.accounts.employee_change_recursive()
    }

    pub fn employee_activate(
        ctx: Context<EmployeeActivate>,
        id: u8,
        from: i64,
        to: i64,
        invoice_bump: u8,
        vault_bump: u8,
        is_recursive: bool,
    ) -> Result<()> {
        ctx.accounts.activate(id, from, to, invoice_bump, vault_bump, is_recursive)
    }

    pub fn employee_claim(
        ctx: Context<EmployeeClaim>,
        id: u8,
        from: i64,
        to: i64,
        invoice_bump: u8,
        vault_bump: u8,
    ) -> Result<()> {
        ctx.accounts.claim(id, from, to, invoice_bump, vault_bump)
    }


}
