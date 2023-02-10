
const {
    FileCreateTransaction, ContractCreateTransaction, ContractFunctionParameters,ContractCreateFlow } = require("@hashgraph/sdk");
const { ContractExecuteTransaction, ContractCallQuery, Hbar } = require("@hashgraph/sdk");

// const { hethers } = require('@hashgraph/hethers');
// const abicoder = new hethers.utils.AbiCoder();


const deploy = async (client, bytecode) => {

    //Create a file on Hedera and store the hex-encoded bytecode
    const fileCreateTx = new FileCreateTransaction()
        //Set the bytecode of the contract
        .setContents(bytecode);

    //Submit the file to the Hedera test network signing with the transaction fee payer key specified with the client
    const submitTx = await fileCreateTx.execute(client);

    //Get the receipt of the file create transaction
    const fileReceipt = await submitTx.getReceipt(client);

    //Get the file ID from the receipt
    const bytecodeFileId = fileReceipt.fileId;

    //Log the file ID
    console.log("The smart contract byte code file ID is " + bytecodeFileId)

    // Instantiate the contract instance
    const contractTx = await new ContractCreateTransaction()
        //Set the file ID of the Hedera file storing the bytecode
        .setBytecodeFileId(bytecodeFileId)
        //Set the gas to instantiate the contract
        .setGas(100000)
        //Provide the constructor parameters for the contract
        .setConstructorParameters(new ContractFunctionParameters().addString("Alice").addUint256(1234567));

    //Submit the transaction to the Hedera test network
    const contractResponse = await contractTx.execute(client);

    //Get the receipt of the file create transaction
    const contractReceipt = await contractResponse.getReceipt(client);

    //Get the smart contract ID
    const newContractId = contractReceipt.contractId;

    //Log the smart contract ID
    console.log("The smart contract ID is " + newContractId);
    return newContractId;
}

const invoke = async (client, contractId, paramObj) => {
    //Create the transaction to update the contract message
    const contractExecTx = await new ContractExecuteTransaction()
        //Set the ID of the contract
        .setContractId(contractId)
        //Set the gas for the contract call
        .setGas(100000)
        //Set the contract function to call
        .setFunction("setMobileNumber", paramObj)//.addUint16(7));

    //Submit the transaction to a Hedera network and store the response
    const submitExecTx = await contractExecTx.execute(client);

    //Get the receipt of the transaction
    const receipt2 = await submitExecTx.getReceipt(client);

    //Confirm the transaction was executed successfully
    console.log("The transaction status is " + receipt2.status.toString());

}

const query = async (client, contractId, paramObj) => {

    //Create the transaction to update the contract message
    const contractCallQuery = await new ContractCallQuery()
        //Set the ID of the contract
        .setContractId(contractId)
        //Set the gas for the contract call
        .setGas(100000)
        //Set the contract function to call
        .setFunction("getMobileNumber", paramObj)
        .setQueryPayment(new Hbar(10));

    //Submit the transaction to a Hedera network and store the response
    const contractQuerySubmit = await contractCallQuery.execute(client);
    console.log('Retrieved data is ' + contractQuerySubmit.getUint256(0).toString())


}

exports.deploy = (client, bytecode) => deploy(client, bytecode);
exports.invoke = (client, contractId, paramObj) => invoke(client, contractId, paramObj);
exports.query = (client, contractId, paramObj) => query(client, contractId, paramObj);