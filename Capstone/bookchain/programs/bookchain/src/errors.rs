use anchor_lang::error_code;

//Errore per dire che per cambiare le cose deve essere l'autorità - Manca

#[error_code]
pub enum ProjError {
    #[msg("The project name is too long.")]
    TooManyCharacters,
    #[msg("You tried to deposit something <0, Try with a bigger number")]
    DepositErr,
    #[msg("You tried to withdraw more than the balance")]
    WithdrawErr,
}

#[error_code]
pub enum EmplErr {
    #[msg("The title is too long. (Keep it 20 character maximum)")]
    TitleTooLong,
    #[msg("You need to put a number greater than 0 for the salary of your employee")]
    PayTooLow,
    #[msg("You don't have enough money to pay your employee")]
    NotEnoughFunds,
    #[msg("The name is too long. (Keep it 20 character maximum)")]
    NameTooLong,
}

#[error_code]
pub enum InvErr {
    #[msg("You need to wait till the time of the invoice has passed")]
    TimeNotPassed,
    #[msg("You already claimed this invoice")]
    AlreadyClaimed,
    #[msg("You are not the employee of this invoice")]
    NotAuthorized,
}