const { PrivateKey, AccountCreateTransaction, Hbar, Client, AccountBalanceQuery } = require('@hashgraph/sdk');

const getClient = async (accountId, privateKey) => {
    // Connect with Hedera
    const client = Client.forTestnet();
    client.setOperator(accountId, privateKey)
    return client;
}
/**
 * 
 * @param {Object} client 
 * @param {Number} counts 
 * @returns <Array>
 */
const createAccountKeys = async (client, counts) => {
    const accountKeys = []
    for (let i = 0; i < counts; i++) {
        const newPrivateKey = PrivateKey.generateED25519();
        const newPublicKey = newPrivateKey.publicKey;

        accountKeys.push({
            privateKey: newPrivateKey,
            publicKey: newPublicKey
        })
    }

    return accountKeys;
}

/**
 * Function to create 5 accounts and transfer 
 */
/**
 * 
 * @param {Object} client 
 * @param {Array<Number>} accountKeys 
 * @param {Number} initialBalance 
 * @returns {Object}
 */
const createAccounts = async (client, accountKeys, initialBalance) => {
    // const accountKeys = await createAccountKeys(5);
    const accounts = {}

    for (let index = 0; index < accountKeys.length; index++) {
        const account = accountKeys[index];
        const createAccountTx = await new AccountCreateTransaction()
            .setKey(account.publicKey)
            .setInitialBalance(new Hbar(initialBalance))
            .execute(client);

        const receipt = await createAccountTx.getReceipt(client);

        accounts[`PrivateKey${index + 1}`] = account.privateKey.toString()
        accounts[`PublicKey${index + 1}`] = account.publicKey.toString()
        accounts[`AccountId${index + 1}`] = receipt.accountId.toString()

        console.log(`PRIVATE_KEY_${index + 1} = ${account.privateKey.toString()}`)
        console.log(`PUBLIC_KEY_${index + 1} = ${account.publicKey.toString()}`)
        console.log(`ACCOUNT_ID_${index + 1} = ${receipt.accountId.toString()}`)
        console.log('\n')
    }
    return accounts;
}

exports.getClient = (accountId, privateKey) => getClient(accountId, privateKey)
exports.createAccountKeys = (client, counts) => createAccountKeys(client, counts)
exports.createAccounts = (client, accountKeys, amount) => createAccounts(client, accountKeys, amount)