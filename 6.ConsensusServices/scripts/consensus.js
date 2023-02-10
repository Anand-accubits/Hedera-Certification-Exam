const {
    Client,
    PrivateKey,
    Wallet,
    TopicCreateTransaction,
    TopicMessageSubmitTransaction,
} = require('@hashgraph/sdk');
require('dotenv').config({ path:'6.ConsensusServices/.env'})

console.log(process.env.ACCOUNT_ID_1)
// Grab private key and account id for Account 1
const acc1AccountId = '0.0.3424880';//process.env.ACCOUNT_ID_1;
const acc1PrivateKey = PrivateKey.fromString('302e020100300506032b657004220420cdac7662481f9ac1be629bc10afb146f7a6b3141e2d6189a8103d04657ac0a9d');


// Throw error if the private key and account id's are null 
if (acc1AccountId == null || acc1PrivateKey == null) {
    throw new Error("Environment variables AccountId and PrivateKey of Account1 must be present");
}

// Create connection to Hedera
const client = Client.forTestnet();
client.setOperator(acc1AccountId, acc1PrivateKey);

const walletUser = new Wallet(
    acc1AccountId,
    acc1PrivateKey
)

async function main() {

    // Create Topic
    const topicId = await createConsensusTx();
    // Set the message as current time
    const message = new Date().toLocaleTimeString()

    // Submit the message to the topic
    await submitMessage(topicId, message)

    process.exit();
}

async function createConsensusTx() {
    //Create the transaction
    let transaction = new TopicCreateTransaction()
        .setSubmitKey(walletUser.publicKey)
        .setAdminKey(walletUser.publicKey)
        .setTopicMemo('Fluffy Unicorn News');

    console.log(`Created a new TopicCreateTransaction`);

    //Sign with the client operator private key and submit the transaction to a Hedera network
    let txResponse = await transaction.execute(client);

    //Get the receipt of the transaction
    let receipt = await txResponse.getReceipt(client);

    //Grab the new topic ID from the receipt
    let topicId = receipt.topicId;

    //Log the topic ID
    console.log(`The topic ID is: ${topicId}`);

    // Wait 5 seconds between consensus topic creation and subscription
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return topicId;
}

async function submitMessage(topicId, message) {
    // Send the message to the topic
    let sendResponse = await new TopicMessageSubmitTransaction({
        topicId,
        message
    }).execute(client);

    //Get the receipt of the transaction
    const getReceipt = await sendResponse.getReceipt(client);

    //Get the status of the transaction
    const transactionStatus = getReceipt.status
    console.log("The message transaction status: " + transactionStatus)
}

main().catch(err => {
    console.log(err);
    process.exit();
})