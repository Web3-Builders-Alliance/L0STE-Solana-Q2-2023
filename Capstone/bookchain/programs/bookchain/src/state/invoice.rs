use anchor_lang::prelude::*;

#[account]
pub struct Invoice {
    pub id: u64,
    pub project: Pubkey,
    pub employee: Pubkey,
    pub employee_title: String,
    pub from: i64,
    pub to: i64,
    pub balance: u64,
    pub has_claimed: bool,
    pub invoice_bump: u8,
    pub vault_bump: u8,
}

impl Invoice {
    pub fn init(
        &mut self,
        id: u64,
        project: Pubkey,
        employee: Pubkey,
        employee_title: String,
        from: i64,
        to: i64,
        balance: u64,
        has_claimed: bool,
        invoice_bump: u8,
        vault_bump: u8,
    ) -> Result<()> {
        self.id = id;
        self.project = project;
        self.employee = employee;
        self.employee_title = employee_title;
        self.from = from;
        self.to = to;
        self.balance = balance;
        self.has_claimed = false;
        self.invoice_bump = invoice_bump;
        self.vault_bump = vault_bump;

        Ok(())
    }
}

impl Invoice {
    pub fn space() -> usize {
        8 +     //  Discriminator
        4 +     //  id
        32 +    //  Wallet address of the project PDA
        32 +    //  Wallet address of the Employee
        4 +     //  Title
        8 +     //  From (i64)
        8 +     //  To (i64)
        8 +     //  Balance (u64)
        1 +     //  Has Claimed (bool)
        1 +     //  Bump (u8)
        1       //  Bump (u8)
    }
}