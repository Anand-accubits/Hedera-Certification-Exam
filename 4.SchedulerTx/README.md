# TASK-4

Create a scheduled transaction with a key list with 3 key
(Account1, Account2 and Account3) that requires 2 of the three
keys.
Sign the transaction with Account1. Get the information of the
transaction and show that it has not yet been executed.
Sign the transaction with Account2 and get the information again
to show that it has been executed.

## How to Run

1. Go to root folder
2. Run `npm run start:scheduled`

## Output

```
Created a tranfer transaction without any signatures
Creating a schedule transaction for the transfer
Schedule transaction is created 0.0.3425645
Schedule transaction  0.0.3425645 is deleted SUCCESS



            Scheduled Transaction Info 
            ID               : 0.0.3425645 
            Memo             : Scheduled Transaction on 2023-02-10T11:10:15.911Z
            Creator          : 0.0.3422188
            Payer            : 0.0.3422188
            Expiration Time  : 1676029216.0
        
Failed to execute transaction receipt for transaction 0.0.3422188@1676027407.780547926 contained error status SCHEDULE_ALREADY_DELETED
```

## Transaction URL's for reference

