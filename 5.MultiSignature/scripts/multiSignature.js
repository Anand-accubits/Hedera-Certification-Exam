const {
    Client,
    PrivateKey,
    AccountCreateTransaction,
    TransferTransaction,
    AccountBalanceQuery,
    Hbar,
    KeyList,
    ScheduleInfoQuery,
    ScheduleSignTransaction,
    ScheduleId,
    AccountId,
    Timestamp,
  } = require('@hashgraph/sdk');
  require('dotenv').config({ path: '5.MultiSignature/.env' })
  
  //Grab your Hedera testnet account ID and private key from your .env file
  
  
  const {
    ACCOUNT_ID_1,
    PRIVATE_KEY_1,
    PRIVATE_KEY_2,
    PRIVATE_KEY_3,
    ACCOUNT_ID_5
  } = process.env;
  
  const main = async () => {
    const client = await getClient();
  
    console.log(`\nCreating Multisig AccountId`);
   
    //Creating key objects and extracting public keys
    const key1 = PrivateKey.fromString(PRIVATE_KEY_1).publicKey;
    const key2 = PrivateKey.fromString(PRIVATE_KEY_2).publicKey;
    const key3 = PrivateKey.fromString(PRIVATE_KEY_3).publicKey;
  
    //Creating array of multi sig account owners
    const keys = [key1, key2, key3];
  
    //Create a key list with 3 keys and require 2 signatures
    const keyList = new KeyList(keys, 2);
  
    //Create a multi signature account with 20 Hbar starting balance
    const multiSigAccountID = await createMultiSigAccount(keyList);
  
    //Logging initial balances
    await accountBalance(multiSigAccountID);
    await accountBalance(ACCOUNT_ID_5);
  
    console.log(`\nCreating Schedule Multisig transfer`);
  
    // Schedule crypto transfer from multi-sig account to account 4 and sign the transaction by Account 1
    const txSchedule = await await new TransferTransaction()
      .addHbarTransfer(multiSigAccountID, Hbar.fromTinybars(-2))
      .addHbarTransfer(ACCOUNT_ID_5, Hbar.fromTinybars(2))
      .schedule() // create schedule
      .freezeWith(client)
      .sign(PrivateKey.fromString(PRIVATE_KEY_1)); //Signing by the Key
  
    const txResponse = await txSchedule.execute(client);
    const receipt = await txResponse.getReceipt(client);
    console.log(
      `Creating and executing transaction ${txResponse.transactionId.toString()} status: ${
        receipt.status
      }`
    );
  
    //Get the schedule ID
    const scheduleId = receipt.scheduleId;
    console.log('The schedule ID is ' + scheduleId);
  
    console.log(`\nPrinting Scheduled Info`);
    
    await queryScheduledTxn(scheduleId);
  
    console.log(`\nAdding the signature by Account 2`);
      // Add Signature by Account 2
      const txScheduleSign2 = await (
        await new ScheduleSignTransaction()
          .setScheduleId(scheduleId)
          .freezeWith(client)
          .sign(PrivateKey.fromString(PRIVATE_KEY_2))
      ) // Add Signature 2
      
      const txResponse2 = await txScheduleSign2.execute(client);
    const receipt2 = await txResponse2.getReceipt(client);
    console.log(
      `Creating and executing transaction ${txResponse2.transactionId.toString()} status: ${
        receipt2.status
      }`
    );
  
    console.log(`\nPrinting Scheduled Info`);
    await queryScheduledTxn(scheduleId);
  
    console.log(`\nPrinting Account Balances for transaction`);
    await accountBalance(multiSigAccountID);
    await accountBalance(ACCOUNT_ID_5);
  
    process.exit();
  };
  
  const getClient = async () => {
    // If we weren't able to grab it, we should throw a new error
    if (ACCOUNT_ID_1 == null || PRIVATE_KEY_1 == null) {
      throw new Error(
        'Environment variables ACCOUNT_ID_1 and PRIVATE_KEY_1 must be present'
      );
    }
  
    // Create our connection to the Hedera network
    return Client.forTestnet().setOperator(ACCOUNT_ID_1, PRIVATE_KEY_1);
  };
  
  const createMultiSigAccount = async (keys) => {
    const client = await getClient();
    const multiSigAccount = await new AccountCreateTransaction()
      .setKey(keys)
      .setInitialBalance(Hbar.fromString('20'))
      .execute(client);
  
    // Get the new account ID
    const getReceipt = await multiSigAccount.getReceipt(client);
    const multiSigAccountID = getReceipt.accountId;
  
    console.log('\nThe Multi Signature Account ID is: ' + multiSigAccountID);
    return multiSigAccountID;
  };
  
  const accountBalance = async (accountID) => {
    const client = await getClient();
    const getBalance = await new AccountBalanceQuery()
      .setAccountId(accountID)
      .execute(client);
  
    console.log(
      `\nBalance of ${accountID}: ` + getBalance.hbars.toTinybars() + ' tinybars.'
    );
  };
  
  const queryScheduledTxn = async (scheduleId) => {
    const client = await getClient();
    const info = await new ScheduleInfoQuery().setScheduleId(scheduleId).execute(client);

    console.log('\n\nScheduled Transaction Info -');
    console.log('ScheduleId :', new ScheduleId(info.scheduleId).toString());
    console.log('Memo : ', info.scheduleMemo);
    console.log('Created by : ', new AccountId(info.creatorAccountId).toString());
    console.log('Payed by : ', new AccountId(info.payerAccountId).toString());
    console.log('Expiration time : ', new Timestamp(info.expirationTime).toDate());
    if (
      new Timestamp(info.executed).toDate().getTime() ===
      new Date('1970-01-01T00:00:00.000Z').getTime()
    ) {
      console.log('The transaction has not been executed yet.');
    } else {
      console.log('The transaction has been executed.');
      console.log('Time of execution : ', new Timestamp(info.executed).toDate());
    }
  };
  
  main();
  