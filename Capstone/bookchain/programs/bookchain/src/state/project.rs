use anchor_lang::prelude::*;

#[account]
pub struct Project {
    pub id: u64,
    pub authority: Pubkey,
    pub project_name: String,
    pub balance: u64,
    pub monthly_spending: u64,
    pub employee: u8,
    pub project_bump: u8,
    pub vault_bump: u8,
}

impl Project {
    pub fn init(
        &mut self, 
        id: u64,
        authority: Pubkey,
        project_name: String,
        balance: u64,
        monthly_spending: u64,
        employee: u8,
        project_bump: u8,
        vault_bump: u8,
    ) -> Result<()> {
        self.id = id;
        self.authority = authority;
        self.project_name = project_name;
        self.balance = balance;
        self.monthly_spending = monthly_spending;
        self.employee = employee;
        self.project_bump = project_bump;
        self.vault_bump = vault_bump;

        Ok(())
    }
}

impl Project {
    pub fn space() -> usize {    
        8 +      // Descrimintor
        8 +      // id
        32 +     // authority
        4 +      // project_name
        8 +      // balance
        8 +      // monthly_spending
        1 +      // employee
        1 +      // project_bump
        1        // vault_bump
    }
}