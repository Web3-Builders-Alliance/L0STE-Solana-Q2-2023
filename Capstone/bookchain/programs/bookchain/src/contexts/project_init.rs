use anchor_lang::{prelude::*};
use anchor_spl::token::{Mint, Token, TokenAccount};
use anchor_spl::associated_token::AssociatedToken;

use crate::errors::ProjError;
use crate::state::project::Project;

#[derive(Accounts)]
#[instruction(id: u64)]
pub struct ProjectInit<'info> {
    #[account(
        init,
        payer = initializer,
        seeds = [b"vault", project.key().as_ref()], 
        bump,
        token::mint = token,
        token::authority = project,
    )]
    pub project_vault: Box<Account<'info, TokenAccount>>, // The vault ATA
    #[account(
        init, 
        payer = initializer, 
        seeds = [b"project", initializer.key().as_ref(), id.to_le_bytes().as_ref()], 
        bump,
        space = Project::space() + 20           // 20 = max number of characters in the project name
    )]
    pub project: Account<'info, Project>,

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

impl<'info> ProjectInit<'info> {
    pub fn init(
        &mut self,
        id: u64,
        project_name: String,
        project_bump: u8,
        vault_bump: u8,
    ) -> Result<()> {
        //We made space only for 20 character
        require!(project_name.len() <20, ProjError::TooManyCharacters);

        let id = id;
        let authority = self.initializer.key();
        let project_name = project_name;
        let balance = 0;
        let monthly_spending = 0;
        let employee = 0;
        let project_bump = project_bump;
        let vault_bump = vault_bump;

        self.project.init(
            id,
            authority,
            project_name,
            balance,
            monthly_spending,
            employee,
            project_bump,
            vault_bump,
        )

    }
}