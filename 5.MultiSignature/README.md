# TASK-5

Create a scheduled transaction with a key list with 3 key
(Account1, Account2 and Account3) that requires 2 of the three
keys.
Sign the transaction with Account1. Get the information of the
transaction and show that it has not yet been executed.
Sign the transaction with Account2 and get the information again
to show that it has been executed.

## How to Run

1. Go to root folder
2. Run `npm run start:multiSignature`

## Output

```
Creating Multisig AccountId

The Multi Signature Account ID is: 0.0.3426292

Balance of 0.0.3426292: 2000000000 tinybars.

Balance of 0.0.3425850: 10000000006 tinybars.

Creating Schedule Multisig transfer
Creating and executing transaction 0.0.3425846@1676030591.507399252 status: SUCCESS
The schedule ID is 0.0.3426295

Printing Scheduled Info


Scheduled Transaction Info -
ScheduleId : 0.0.3426295
Memo :  
Created by :  0.0.3425846
Payed by :  0.0.3425846
Expiration time :  2023-02-10T12:33:23.000Z
The transaction has not been executed yet.

Adding the signature by Account 2
Creating and executing transaction 0.0.3425846@1676030597.61679352 status: SUCCESS

Printing Scheduled Info


Scheduled Transaction Info -
ScheduleId : 0.0.3426295
Memo :  
Created by :  0.0.3425846
Payed by :  0.0.3425846
Expiration time :  2023-02-10T12:33:23.000Z
The transaction has been executed.
Time of execution :  2023-02-10T12:03:25.000Z

Printing Account Balances for transaction

Balance of 0.0.3426292: 1999999998 tinybars.

Balance of 0.0.3425850: 10000000008 tinybars.
```

## Transaction URL's for reference

