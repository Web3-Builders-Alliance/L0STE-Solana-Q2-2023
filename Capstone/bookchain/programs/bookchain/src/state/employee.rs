use anchor_lang::prelude::*;

#[account]
pub struct Employee {
    pub project: Pubkey,
    pub employee: Pubkey,
    pub employee_name: String,
    pub employee_title: String,
    pub monthly_pay: u64,
    pub is_recursive: bool,
    pub employee_bump: u8,
}

impl Employee {
    pub fn init(
        &mut self,
        project: Pubkey,
        employee: Pubkey,
        employee_name: String,
        employee_title: String,
        monthly_pay: u64,
        is_recursive: bool,
        employee_bump: u8,
    ) -> Result<()> {
        self.project = project;
        self.employee = employee;
        self.employee_name = employee_name;
        self.employee_title = employee_title;
        self.monthly_pay = monthly_pay;
        self.is_recursive = false;
        self.employee_bump = employee_bump;

        Ok(())
    }
}

impl Employee {
    pub fn space() -> usize {
        8 +     //  Discriminator
        32 +    //  Wallet address of the project PDA
        32 +    //  Wallet address of the Employee
        4 +     //  Name
        4 +     //  Title 
        8 +     //  Monthly Pay (u64)
        1 +     //  Is Active (bool)
        1       //  Bump (u8)
    }
}