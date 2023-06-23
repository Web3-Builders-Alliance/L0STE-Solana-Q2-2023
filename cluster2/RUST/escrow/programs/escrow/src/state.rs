use anchor_lang::prelude::*;

#[account]
pub struct Escrow {
    pub maker: Pubkey,
    pub maker_token: Pubkey,
    pub taker_token: Pubkey,
    pub maker_offer_amount: u64,
    pub maker_deposit_amount: u64,
    pub seed: u64,
    pub auth_bump: u8,
    pub vault_bump: u8,
    pub escrow_bump: u8,
    pub expires_at: u64
     
}

impl Escrow {
    pub fn space() -> usize {
        8 +     //  Discriminator
        32 +    //  Maker (Pubkey)
        32 +    //  Maker Token (Pubkey)
        32 +    //  Taker Token (Pubkey)
        8 +     //  Offer Amount (u64)
        8 +     //  Deposit Amount (u64)
        8 +     //  Seed (u64)
        1 +     //  Auth Bump (u8)
        1 +     //  Vault Bump (u8)
        1 +     //  Escrow Bump (u8)
        8       //  Expires At (u64)
    }
}