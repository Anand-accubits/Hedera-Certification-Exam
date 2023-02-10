const {
  Client,
  ContractExecuteTransaction,
  PrivateKey,
  ContractCreateFlow,
  ContractFunctionParameters,
  ContractDeleteTransaction,
} = require('@hashgraph/sdk');

const { hethers } = require('@hashgraph/hethers');
require('dotenv').config({ path:'3.Smart-Contract-Service/.env'})
const contractJSON = require('../artifacts/contracts/certificationC3.sol/CertificationC3.json');

const abicoder = new hethers.utils.AbiCoder();

//Grab your Hedera testnet account ID and private key from your .env file
const { PRIVATE_KEY_1, ACCOUNT_ID_1 } = process.env;

const main = async () => {
  const client = await getClient();

  //Extracting bytecode from compiled code
  const bytecode = contractJSON.bytecode;

  //Create the transaction
  const contractCreation = new ContractCreateFlow()
    .setContractMemo('CertificationC3.sol')
    .setGas(100000)
    .setBytecode(bytecode)
    .setAdminKey(PrivateKey.fromString(PRIVATE_KEY_1));

  //Sign the transaction with the client operator key and submit to a Hedera network
  const txResponse = await contractCreation.execute(client);

  //Get the receipt of the transaction
  const receipt = await txResponse.getReceipt(client);

  //Get the new contract ID
  const contractId = receipt.contractId;

  console.log('The contract ID is ' + contractId);

  //Create the transaction to call function1
  const firstFunctionExecution = new ContractExecuteTransaction()
    //Set the ID of the contract
    .setContractId(contractId)
    //Set the gas for the contract call
    .setGas(100000)
    //Set the contract function to call
    .setFunction('function1', new ContractFunctionParameters().addUint16(5).addUint16(6));

  //Submit the transaction to a Hedera network and store the response
  const submitFirstFunctionExec = await firstFunctionExecution.execute(client);

  const record = await submitFirstFunctionExec.getRecord(client);

  const encodedResult1 = '0x' + record.contractFunctionResult.bytes.toString('hex');

  const result1 = abicoder.decode(['uint16'], encodedResult1);

  console.log('Function 1 Output :', result1[0]);

  //Create the transaction to update the contract message
  const deleteContractExec = await new ContractDeleteTransaction()
    //Set the ID of the contract
    .setContractId(contractId)
    .setTransferAccountId(ACCOUNT_ID_1)
    //Submit the transaction to a Hedera network and store the response
    .execute(client);

  //Get the receipt of the transaction
  const deleteContractTxnReceipt = await deleteContractExec.getReceipt(client);

  //Get the transaction consensus status
  const transactionStatus = deleteContractTxnReceipt.status;

  console.log('The transaction consensus status is ' + transactionStatus);
  console.log("The contract has deleted");

  process.exit();
};

//To create client object
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

main();
