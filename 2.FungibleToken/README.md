# TASK-2

Create a script that generates a fungible token that requires a KYC
process to be completed.
Set a fixed supply of 1000. Associate Account3, but do not KYC it.
Try to send 12.99 tokens from Account2 to Account3.
Show that the account is not yet able to participate in the token
because it is not been KYC approved.
Now set the KYC flag on Account3 and retry the transfer.

## How to Run

1. Go to root folder
2. Run `npm run start:token`

## Output

```
Creating Token
The token create transaction status is: SUCCESS 

The new token ID is 0.0.3425915

Fetch Details
Searching for the token 0.0.3425915
The name of the token is: Hedera Test Token 
The symbol of the token is: HTT
The totalsupply of the token is: 100000
Current owner: 0.0.3425513
Current admin: 302a300506032b6570032100421cbdc1bd80a2251c1511b9c2f2d4489eb0b5b55e66abeb27a0131497a2022a

Associate Token
Token association with the other account: SUCCESS 


Token Transfer Before Granting Kyc

The transaction errored with message ACCOUNT_KYC_NOT_GRANTED_FOR_TOKEN

Error:{"name":"StatusError","status":"ACCOUNT_KYC_NOT_GRANTED_FOR_TOKEN","transactionId":"0.0.3425512@1676029693.630475639","message":"receipt for transaction 0.0.3425512@1676029693.630475639 contained error status ACCOUNT_KYC_NOT_GRANTED_FOR_TOKEN"}

Granting Kyc
The grant Kyc transaction consensus status SUCCESS

Token Transfer After Granting Kyc
The transaction consensus status SUCCESS
The transaction Id 0.0.3425512@1676029698.511439430
- Balance of account 0.0.3425513: 98701 unit(s) of token 0.0.3425915
- Balance of account 0.0.3425514: 1299 unit(s) of token 0.0.3425915
```

## Transaction URL's for reference
