export type Bookchain = {
  "version": "0.1.0",
  "name": "bookchain",
  "instructions": [
    {
      "name": "projectInit",
      "accounts": [
        {
          "name": "projectVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "initializerAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "token",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "u64"
        },
        {
          "name": "projectBump",
          "type": "u8"
        },
        {
          "name": "vaultBump",
          "type": "u8"
        },
        {
          "name": "projectName",
          "type": "string"
        }
      ]
    },
    {
      "name": "projectDeposit",
      "accounts": [
        {
          "name": "projectVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "token",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "depositAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "projectWithdraw",
      "accounts": [
        {
          "name": "projectVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "token",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "withdrawAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "projectChangeAuth",
      "accounts": [
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "auth",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "projectChangeName",
      "accounts": [
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "projectName",
          "type": "string"
        }
      ]
    },
    {
      "name": "employeeInit",
      "accounts": [
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "employee",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "initializerAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "token",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "u8"
        },
        {
          "name": "employee",
          "type": "publicKey"
        },
        {
          "name": "employeeName",
          "type": "string"
        },
        {
          "name": "employeeTitle",
          "type": "string"
        },
        {
          "name": "monthlyPay",
          "type": "u64"
        },
        {
          "name": "employeeBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "employeeChangePay",
      "accounts": [
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "employee",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "monthlyPay",
          "type": "u64"
        }
      ]
    },
    {
      "name": "employeeChangeName",
      "accounts": [
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "employee",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "employeeName",
          "type": "string"
        }
      ]
    },
    {
      "name": "employeeChangeTitle",
      "accounts": [
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "employee",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "employeeTitle",
          "type": "string"
        }
      ]
    },
    {
      "name": "employeeChangeWallet",
      "accounts": [
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "employee",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "employee",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "employeeChangeRecursive",
      "accounts": [
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "employee",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "employeeActivate",
      "accounts": [
        {
          "name": "projectVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "employee",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "invoiceVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "invoice",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "initializerAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "token",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "u8"
        },
        {
          "name": "from",
          "type": "i64"
        },
        {
          "name": "to",
          "type": "i64"
        },
        {
          "name": "invoiceBump",
          "type": "u8"
        },
        {
          "name": "vaultBump",
          "type": "u8"
        },
        {
          "name": "isRecursive",
          "type": "bool"
        }
      ]
    },
    {
      "name": "employeeClaim",
      "accounts": [
        {
          "name": "invoiceVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "invoice",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "newInvoiceVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "newInvoice",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "projectVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "employee",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "employeeWallet",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "employeeWalletAta",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "token",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "u8"
        },
        {
          "name": "from",
          "type": "i64"
        },
        {
          "name": "to",
          "type": "i64"
        },
        {
          "name": "invoiceBump",
          "type": "u8"
        },
        {
          "name": "vaultBump",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "Employee",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u8"
          },
          {
            "name": "project",
            "type": "publicKey"
          },
          {
            "name": "employee",
            "type": "publicKey"
          },
          {
            "name": "employeeName",
            "type": "string"
          },
          {
            "name": "employeeTitle",
            "type": "string"
          },
          {
            "name": "monthlyPay",
            "type": "u64"
          },
          {
            "name": "isRecursive",
            "type": "bool"
          },
          {
            "name": "invoice",
            "type": "u8"
          },
          {
            "name": "employeeBump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "Invoice",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u8"
          },
          {
            "name": "project",
            "type": "publicKey"
          },
          {
            "name": "employee",
            "type": "publicKey"
          },
          {
            "name": "employeeTitle",
            "type": "string"
          },
          {
            "name": "from",
            "type": "i64"
          },
          {
            "name": "to",
            "type": "i64"
          },
          {
            "name": "balance",
            "type": "u64"
          },
          {
            "name": "hasClaimed",
            "type": "bool"
          },
          {
            "name": "invoiceBump",
            "type": "u8"
          },
          {
            "name": "vaultBump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "Project",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "projectName",
            "type": "string"
          },
          {
            "name": "balance",
            "type": "u64"
          },
          {
            "name": "monthlySpending",
            "type": "u64"
          },
          {
            "name": "employee",
            "type": "u8"
          },
          {
            "name": "projectBump",
            "type": "u8"
          },
          {
            "name": "vaultBump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "EmplErr",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "TitleTooLong"
          },
          {
            "name": "PayTooLow"
          },
          {
            "name": "NotEnoughFunds"
          },
          {
            "name": "NameTooLong"
          },
          {
            "name": "NotRecursive"
          }
        ]
      }
    },
    {
      "name": "InvErr",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "TimeNotPassed"
          },
          {
            "name": "AlreadyClaimed"
          },
          {
            "name": "NotAuthorized"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "TooManyCharacters",
      "msg": "The project name is too long."
    },
    {
      "code": 6001,
      "name": "DepositErr",
      "msg": "You tried to deposit something <0, Try with a bigger number"
    },
    {
      "code": 6002,
      "name": "WithdrawErr",
      "msg": "You tried to withdraw more than the balance"
    },
    {
      "code": 6003,
      "name": "NotAuthorized",
      "msg": "You are not the owner of this project"
    }
  ]
}

export const IDL: Bookchain = {
  "version": "0.1.0",
  "name": "bookchain",
  "instructions": [
    {
      "name": "projectInit",
      "accounts": [
        {
          "name": "projectVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "initializerAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "token",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "u64"
        },
        {
          "name": "projectBump",
          "type": "u8"
        },
        {
          "name": "vaultBump",
          "type": "u8"
        },
        {
          "name": "projectName",
          "type": "string"
        }
      ]
    },
    {
      "name": "projectDeposit",
      "accounts": [
        {
          "name": "projectVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "token",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "depositAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "projectWithdraw",
      "accounts": [
        {
          "name": "projectVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "token",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "withdrawAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "projectChangeAuth",
      "accounts": [
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "auth",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "projectChangeName",
      "accounts": [
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "projectName",
          "type": "string"
        }
      ]
    },
    {
      "name": "employeeInit",
      "accounts": [
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "employee",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "initializerAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "token",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "u8"
        },
        {
          "name": "employee",
          "type": "publicKey"
        },
        {
          "name": "employeeName",
          "type": "string"
        },
        {
          "name": "employeeTitle",
          "type": "string"
        },
        {
          "name": "monthlyPay",
          "type": "u64"
        },
        {
          "name": "employeeBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "employeeChangePay",
      "accounts": [
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "employee",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "monthlyPay",
          "type": "u64"
        }
      ]
    },
    {
      "name": "employeeChangeName",
      "accounts": [
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "employee",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "employeeName",
          "type": "string"
        }
      ]
    },
    {
      "name": "employeeChangeTitle",
      "accounts": [
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "employee",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "employeeTitle",
          "type": "string"
        }
      ]
    },
    {
      "name": "employeeChangeWallet",
      "accounts": [
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "employee",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "employee",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "employeeChangeRecursive",
      "accounts": [
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "employee",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "employeeActivate",
      "accounts": [
        {
          "name": "projectVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "employee",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "invoiceVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "invoice",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "initializerAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "token",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "u8"
        },
        {
          "name": "from",
          "type": "i64"
        },
        {
          "name": "to",
          "type": "i64"
        },
        {
          "name": "invoiceBump",
          "type": "u8"
        },
        {
          "name": "vaultBump",
          "type": "u8"
        },
        {
          "name": "isRecursive",
          "type": "bool"
        }
      ]
    },
    {
      "name": "employeeClaim",
      "accounts": [
        {
          "name": "invoiceVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "invoice",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "newInvoiceVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "newInvoice",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "projectVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "project",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "employee",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "employeeWallet",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "employeeWalletAta",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "token",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "u8"
        },
        {
          "name": "from",
          "type": "i64"
        },
        {
          "name": "to",
          "type": "i64"
        },
        {
          "name": "invoiceBump",
          "type": "u8"
        },
        {
          "name": "vaultBump",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "Employee",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u8"
          },
          {
            "name": "project",
            "type": "publicKey"
          },
          {
            "name": "employee",
            "type": "publicKey"
          },
          {
            "name": "employeeName",
            "type": "string"
          },
          {
            "name": "employeeTitle",
            "type": "string"
          },
          {
            "name": "monthlyPay",
            "type": "u64"
          },
          {
            "name": "isRecursive",
            "type": "bool"
          },
          {
            "name": "invoice",
            "type": "u8"
          },
          {
            "name": "employeeBump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "Invoice",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u8"
          },
          {
            "name": "project",
            "type": "publicKey"
          },
          {
            "name": "employee",
            "type": "publicKey"
          },
          {
            "name": "employeeTitle",
            "type": "string"
          },
          {
            "name": "from",
            "type": "i64"
          },
          {
            "name": "to",
            "type": "i64"
          },
          {
            "name": "balance",
            "type": "u64"
          },
          {
            "name": "hasClaimed",
            "type": "bool"
          },
          {
            "name": "invoiceBump",
            "type": "u8"
          },
          {
            "name": "vaultBump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "Project",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "projectName",
            "type": "string"
          },
          {
            "name": "balance",
            "type": "u64"
          },
          {
            "name": "monthlySpending",
            "type": "u64"
          },
          {
            "name": "employee",
            "type": "u8"
          },
          {
            "name": "projectBump",
            "type": "u8"
          },
          {
            "name": "vaultBump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "EmplErr",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "TitleTooLong"
          },
          {
            "name": "PayTooLow"
          },
          {
            "name": "NotEnoughFunds"
          },
          {
            "name": "NameTooLong"
          },
          {
            "name": "NotRecursive"
          }
        ]
      }
    },
    {
      "name": "InvErr",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "TimeNotPassed"
          },
          {
            "name": "AlreadyClaimed"
          },
          {
            "name": "NotAuthorized"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "TooManyCharacters",
      "msg": "The project name is too long."
    },
    {
      "code": 6001,
      "name": "DepositErr",
      "msg": "You tried to deposit something <0, Try with a bigger number"
    },
    {
      "code": 6002,
      "name": "WithdrawErr",
      "msg": "You tried to withdraw more than the balance"
    },
    {
      "code": 6003,
      "name": "NotAuthorized",
      "msg": "You are not the owner of this project"
    }
  ]
}