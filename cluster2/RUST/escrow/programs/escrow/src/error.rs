use anchor_lang::error_code;

#[error_code]
pub enum EscrowError {
    #[msg("The vault has expired")]
    EscrowExpired,
}