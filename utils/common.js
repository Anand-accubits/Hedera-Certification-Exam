const {
    Wallet,
    LocalProvider,
    Client,
    PrngTransaction
} = require('@hashgraph/sdk');

exports.getClient = async (accountId, privateKey) => {
    // Connect with Hedera
    const client = Client.forTestnet();
    client.setOperator(accountId, privateKey)
    return client;
}

exports.getWallet = async (accountId, privateKey) => {
    return new Wallet(
        accountId,
        privateKey,
        new LocalProvider()
    );
}

exports.generateRandom = async (client, range) => {
    //Create the transaction with range set
    const transaction = await new PrngTransaction()
        //Set the range
        .setRange(range)
        .execute(client);

    //Get the record
    const transactionRecord = await transaction.getRecord(client);

    //Get the number
    const prngNumber = transactionRecord.prngNumber;

    console.log('Random Number Generated is: ', prngNumber);
    return prngNumber;
}