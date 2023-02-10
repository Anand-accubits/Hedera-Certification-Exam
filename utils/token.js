const {
    TokenCreateTransaction,
    Client,
    TokenType,
    TokenInfoQuery,
    AccountBalanceQuery, PrivateKey, Wallet,
    TokenMintTransaction,
    TokenUpdateTransaction,
    TokenBurnTransaction,
    TransferTransaction,
    TokenSupplyType,
    kycUser
} = require("@hashgraph/sdk");
require('dotenv').config();


const createToken = async (client, adminUser, supplyUser,kycUser, myAccountId, myPrivateKey, name, symbol) => {
    //Create the transaction and freeze for manual signing
    const transaction = await new TokenCreateTransaction()
        .setTokenName(name)
        .setTokenSymbol(symbol)
        .setTokenType(TokenType.FungibleCommon)
        .setTreasuryAccountId(myAccountId)     
        .setSupplyType(TokenSupplyType.Finite)
        .setMaxSupply(10000000)
        .setInitialSupply(200000)
        .setDecimals(2)
        .setAdminKey(adminUser.publicKey)
        .setSupplyKey(supplyUser.publicKey)
        .setKycKey(kycUser.publicKey)
        .freezeWith(client);

    //Sign the transaction with the client, who is set as admin and treasury account
    const signTx = await transaction.sign(myPrivateKey);

    //Submit to a Hedera network
    const txResponse = await signTx.execute(client);

    //Get the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Get the token ID from the receipt
    const tokenId = receipt.tokenId;

    return tokenId;

}

const mint = async (client, tokenId, privateKey) => {
    console.log('MINTING 1000 TOKENS')

    //Burn 42 tokens and freeze the unsigned transaction for manual signing
    const transaction = await new TokenMintTransaction()
        .setTokenId(tokenId)
        .setAmount(1000)
        .freezeWith(client);

    //Sign with the supply private key of the token
    const signTx = await transaction.sign(privateKey);

    //Submit the transaction to a Hedera network
    const txResponse = await signTx.execute(client);

    //Request the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Get the transaction consensus status
    const transactionStatus = receipt.status;

    console.log("The transaction consensus status " + transactionStatus.toString());
}

const updateSupplyKey = async (client, supplyUser, privateKey, tokenId) => {
    console.log('UPDATING SUPPLY USER...')
    //Create the transaction and freeze for manual signing
    const transaction = await new TokenUpdateTransaction()
        .setTokenId(tokenId)
        .setSupplyKey(supplyUser.publicKey)
        .freezeWith(client);

    //Sign the transaction with the admin key
    const signTx = await transaction.sign(privateKey);

    //Submit the signed transaction to a Hedera network
    const txResponse = await signTx.execute(client);

    //Request the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Get the transaction consensus status
    const transactionStatus = receipt.status.toString();

    console.log("'UPDATING SUPPLY USER': The transaction consensus status is " + transactionStatus);
    // process.exit();
}


const burn = async (client, privateKey, tokenId, amount) => {
    console.log('BURNING 500 TOKENS...')

    //Burn tokens and freeze the unsigned transaction for manual signing
    const transaction = await new TokenBurnTransaction()
        .setTokenId(tokenId)
        .setAmount(amount)
        .freezeWith(client);

    //Sign with the supply private key of the token
    const signTx = await transaction.sign(privateKey);

    //Submit the transaction to a Hedera network
    const txResponse = await signTx.execute(client);

    //Request the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Get the transaction consensus status
    const transactionStatus = receipt.status;

    console.log("The transaction consensus status " + transactionStatus.toString());

}

const queryTokenFunction = async (functionName, tokenId, client) => {
    //Create the query
    const query = new TokenInfoQuery()
        .setTokenId(tokenId);
    const body = await query.execute(client);

    //Sign with the client operator private key, submit the query to the network and get the token supply
    let result;
    if (functionName === "name") {
        result = body.name;
    } else if (functionName === "symbol") {
        result = body.symbol;
    } else if (functionName === "totalSupply") {
        result = body.totalSupply;
    } else {
        return;
    }

    return result
}

const tokenBalance = async (client, accountId, tokenId) => {
    //Create the query
    const balanceQuery = new AccountBalanceQuery()
        .setAccountId(accountId);

    //Sign with the client operator private key and submit to a Hedera network
    const tokenBalance = await balanceQuery.execute(client);

    // console.log("The balance of the user is: " + tokenBalance.tokens.get(tokenId));
    return tokenBalance.tokens.get(tokenId);
}

exports.sendToken = async (client, tokenId, owner, aliasAccountId, sendBalance, treasuryAccPvKey) => {
    const tokenTransferTx = new TransferTransaction()
        .addTokenTransfer(tokenId, owner, -sendBalance)
        .addTokenTransfer(tokenId, aliasAccountId, sendBalance)
        .freezeWith(client);

    // Sign the transaction with the operator key
    let tokenTransferTxSign = await tokenTransferTx.sign(treasuryAccPvKey);

    // Submit the transaction to the Hedera network
    let tokenTransferSubmit = await tokenTransferTxSign.execute(client);
    // Get transaction receipt information
    await tokenTransferSubmit.getReceipt(client);
    console.log("Send Token: The transaction consensus status " + transactionStatus.toString());
}

// 1. PAUSE
// 2. UNPAUSE
// 3. WIPE

exports.createToken = (client, adminUser, supplyUser,kycUser, myAccountId, myPrivateKey, name, symbol) => createToken(client, adminUser, supplyUser,kycUser, myAccountId, myPrivateKey, name, symbol);
exports.queryTokenFunction = (functionName, tokenId, client) => queryTokenFunction(functionName, tokenId, client)
exports.tokenBalance = (client, accountId, tokenId) => tokenBalance(client, accountId, tokenId)
exports.mintToken = (client, tokenId, privateKey) => mint(client, tokenId, privateKey)
exports.updateSupplyKey = (client, supplyUser, privateKey, tokenId) => updateSupplyKey(client, supplyUser, privateKey, tokenId)
exports.burnToken = (client, privateKey, tokenId, amount) => burn(client, privateKey, tokenId, amount)