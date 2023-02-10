const { createAccountKeys, createAccounts, getClient } = require('../../utils/account')
require('dotenv').config({ path:'1.AccountService/.env'})

// Grab account id and private key from ENV
const myAccountId = process.env.MY_ACCOUNT_ID
const myPrivateKey = process.env.MY_PRIVATE_KEY

// If weren't able to grab it, should throw a new error
if (myAccountId == null ||
    myPrivateKey == null) {
    throw new Error("Environment variables myAccountId and myPrivateKey must be present");
}

/**
 * Function to create 5 accounts and transfer 
 */
async function main() {
    // Create CLient Object
    const client = await getClient(myAccountId, myPrivateKey);

    // Call createAccountKeys() to generate 5 account keys
    const accountKeys = await createAccountKeys(client, 5);

    // Call createAccounts() to create account with a balance of 100 Hbar's
    console.log(`Newly Created Accounts are\n`)
    const accounts = await createAccounts(client, accountKeys, 100);
    process.exit();
}

main();