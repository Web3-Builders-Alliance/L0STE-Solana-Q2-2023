use anchor_lang::prelude::*;

#[account]
pub struct Project {
    pub authority: Pubkey,
    pub project_name: String,
    pub balance: u64,
    pub monthly_spending: u64,
    pub project_bump: u8,
    pub vault_bump: u8,
}

impl Project {
    pub fn init(
        &mut self, 
        authority: Pubkey,
        project_name: String,
        balance: u64,
        monthly_spending: u64,
        project_bump: u8,
        vault_bump: u8,
    ) -> Result<()> {
        self.authority = authority;
        self.project_name = project_name;
        self.balance = 0;
        self.monthly_spending = 0;
        self.project_bump = project_bump;
        self.vault_bump = vault_bump;

        Ok(())
    }
}

impl Project {
    pub fn space() -> usize {    
        8 +      // Descrimintor
        32 +     // Authority  
        4 +      // Project name
        8 +      // Balance
        8 +      // Monthly spending
        1        // Project bump
    }
}