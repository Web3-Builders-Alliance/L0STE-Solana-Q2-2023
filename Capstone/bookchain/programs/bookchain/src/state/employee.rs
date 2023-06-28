use anchor_lang::prelude::*;

#[account]
pub struct Employee {
    pub id: u64,
    pub project: Pubkey,
    pub employee: Pubkey,
    pub employee_name: String,
    pub employee_title: String,
    pub monthly_pay: u64,
    pub is_recursive: bool,
    pub invoice: u8,
    pub employee_bump: u8,
}

impl Employee {
    pub fn init(
        &mut self,
        id: u64,
        project: Pubkey,
        employee: Pubkey,
        employee_name: String,
        employee_title: String,
        monthly_pay: u64,
        is_recursive: bool,
        invoice: u8,
        employee_bump: u8,
    ) -> Result<()> {
        self.id = id;
        self.project = project;
        self.employee = employee;
        self.employee_name = employee_name;
        self.employee_title = employee_title;
        self.monthly_pay = monthly_pay;
        self.is_recursive = false;
        self.invoice = invoice;
        self.employee_bump = employee_bump;

        Ok(())
    }
}

impl Employee {
    pub fn space() -> usize {
        8 +     //  Discriminator
        4 +     //  id
        32 +    //  project
        32 +    //  employee
        4 +     //  employee_name
        4 +     //  employee_title
        8 +     //  monthly_pay
        1 +     //  is_recursive
        1 +     //  invoice
        1       //  employee_bump

    }
}