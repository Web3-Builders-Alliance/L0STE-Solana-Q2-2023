use anchor_lang::{prelude::*};
use anchor_spl::token::{Mint, Token, TokenAccount};
use anchor_spl::associated_token::AssociatedToken;

use crate::errors::EmplErr;
use crate::state::project::Project;
use crate::state::employee::Employee;

#[derive(Accounts)]
pub struct EmployeeInit<'info> {
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
        seeds = [b"project", initializer.key().as_ref()],
        bump = project.project_bump,
        constraint = initializer.key() == project.authority,
    )]
    pub project: Account<'info, Project>,
    #[account(
        init, 
        payer = initializer, 
        seeds = [b"employee", project.key().as_ref()], 
        bump,
        space = Employee::space() + 20 + 20   //Maximum space for the title
    )]
    pub employee: Account<'info, Employee>,

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

//QUESTION: is there a way to initialize the employee vault from the project vualt even if ther's no sol in there?
impl<'info> EmployeeInit<'info> {
    pub fn init(
        &mut self,
        employee: Pubkey,
        employee_name: String,
        employee_title: String,
        monthly_pay: u64,
        employee_bump: u8,
    ) -> Result<()> {
        //We made space only for 20 character
        require!(monthly_pay>0, EmplErr::PayTooLow);
        require!(employee_title.len() < 20, EmplErr::TitleTooLong);
        require!(employee_name.len() < 20, EmplErr::NameTooLong);

        let project = self.project.key();
        let employee = employee;   
        let employee_name = employee_name;
        let employee_title = employee_title;
        let monthly_pay = monthly_pay;
        let is_recursive = false;
        let employee_bump = employee_bump;

        self.employee.init(
            project,
            employee,
            employee_name,
            employee_title,
            monthly_pay,
            is_recursive,
            employee_bump,
        )
    }
}