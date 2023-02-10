const { TransferTransaction, ScheduleDeleteTransaction, PrivateKey, ScheduleInfoQuery, ScheduleCreateTransaction, ScheduleSignTransaction, Hbar } = require("@hashgraph/sdk");
const { getClient } = require("../../utils/common");
require('dotenv').config({ path: '4.SchedulerTx/.env' })

const accountId1 = process.env.ACCOUNT_ID_1;
const privateKey1 = PrivateKey.fromString(process.env.PRIVATE_KEY_1);

const accountId2 = process.env.ACCOUNT_ID_2;
const privateKey2 = PrivateKey.fromString(process.env.PRIVATE_KEY_2);

const accountId3 = process.env.ACCOUNT_ID_3;

/**
 * Create a simple transfer transaction and create schedule transaction with it
 * @returns scheduleId
 */
async function createScheduleTransfer(client) {
    
    // Create a transaction to schedule
    const transaction = new TransferTransaction()
        .addHbarTransfer(accountId2, Hbar.fromString('-5'))
        .addHbarTransfer(accountId3, Hbar.fromString('5'));
    console.log('Created a tranfer transaction without any signatures')

    // Schedule a transaction without signing the transfer 
    const scheduleTransaction = new ScheduleCreateTransaction()
        .setScheduledTransaction(transaction)
        // Make each transaction unique
        .setScheduleMemo(`Scheduled Transaction on ${new Date().toISOString()}`)
        .setAdminKey(privateKey1)
        .freezeWith(client);
    console.log('Creating a schedule transaction for the transfer')

    // Sign the scheduled transaction
    const signTx = await scheduleTransaction.sign(privateKey1);

    //Sign with the account 1 key and submit the transaction to a Hedera network
    const txResponse = await signTx.execute(client);

    //Request the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Get the schedule ID
    const scheduleId = receipt.scheduleId;
    console.log(`Schedule transaction is created ${scheduleId}`);
    return scheduleId;
}


/**
 * Delete the schedule transaction if it's not executed by Hedera yet
 * @param {*} scheduleId 
 */
async function deleteSchedule(client ,scheduleId) {
    // Create a delete schedule transaction with schedule id
    const scheduleTransaction = new ScheduleDeleteTransaction({
        scheduleId
    }).freezeWith(client);


    // Sign with the account 1 key and submit the delete transaction to a Hedera network
    const signTx = await scheduleTransaction.sign(privateKey1)
    const txResponse = await signTx.execute(client);

    //Request the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Get the schedule ID
    console.log(`Schedule transaction  ${scheduleId} is deleted ${receipt.status}`);
}

/**
 * Print the schedule Id info
 * @param {*} scheduleId 
 */
async function printInfo(client, scheduleId) {
    const info = await new ScheduleInfoQuery().setScheduleId(scheduleId)
        .execute(client);
    console.log(`\n\n
            Scheduled Transaction Info 
            ID               : ${scheduleId} 
            Memo             : ${info.scheduleMemo}
            Creator          : ${info.creatorAccountId}
            Payer            : ${info.payerAccountId}
            Expiration Time  : ${info.expirationTime}
        `);
}


async function executeSchedule(client,scheduleId) {
    try {
        // Get the schedule transaction
        const transaction = new ScheduleSignTransaction({
            scheduleId
        }).freezeWith(client);
        // Sign the transaction with required key
        const signTx = await transaction.sign(privateKey2);
        const txResponse = await signTx.execute(client);
        const receipt = await txResponse.getReceipt(client);
        console.log(
            `Schedule Transaction ${scheduleId} status is ${receipt.status}`
        );

    } catch (error) {
        console.log(`Failed to execute transaction ${error.message}`)
    }
}

async function main() {
    const client = await getClient(accountId1, privateKey1)
    // Create a transfer schedule 
    const scheduleId = await createScheduleTransfer(client);
    // Delete the schedule transaction before execution
    await deleteSchedule(client,scheduleId);
    // Schedule transaction info
    await printInfo(client,scheduleId);
    // // Try and Execute the schedule transaction with signature
    await executeSchedule(client,scheduleId);
    process.exit();
}

main();