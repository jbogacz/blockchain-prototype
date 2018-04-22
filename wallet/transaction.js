const ChainUtil = require('../chain-util');
const { MINING_REWARD } = require('../config');

class Transaction {
  constructor() {
    
    // { uuid }
    this.id = ChainUtil.id();
    
    /* 
    { timestamp: DATE_NOW,
      address: SENDER_PUBLICK_KEY,
      amount: SENDER_BALANE,
      signature: senderWallet.sign(OUTPUTS_HASH) } */
    this.input = null;

    // { amount: AMOUNT, address: SENDER_PUBLICK_KEY },
    // { amount: AMOUNT, address: RECIPIENT_PUBLIC_KEY }
    this.outputs = [];
  }

  update(senderWallet, receptient, amount) {
    const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);

    if (amount > senderOutput.amount) {
      console.log(`Amount: ${amount} exceeds balance.`);
      return;
    }

    // subtract sender total amount (balance) with next sending amount
    senderOutput.amount = senderOutput.amount - amount;
    this.outputs.push({amount, address: receptient});
    Transaction.signTransaction(this, senderWallet);

    return this;
  }

  static signTransaction(transaction, senderWallet) {
    transaction.input = {
      timestamp: Date.now(),
      address: senderWallet.publicKey,
      amount: senderWallet.balance,
      signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
    }
  }

  static newTransaction(senderWallet, receptient, amount) {
    if (amount > senderWallet.balance) {
      console.log(`Amount: ${amount} exceeds balance.`);
      return;
    }

    return Transaction.transactionWithOutputs(senderWallet, [
      { amount: senderWallet.balance - amount, address: senderWallet.publicKey }, 
      { amount, address: receptient }
    ]);
  }

  static rewardTransaction(minerWallet, blockchainWallet) {
    return Transaction.transactionWithOutputs(blockchainWallet, [
      { amount: MINING_REWARD, address: minerWallet.publicKey }
    ]);
  }

  static transactionWithOutputs(senderWallet, outputs) {
    const transaction = new this();
    transaction.outputs.push(...outputs);
    Transaction.signTransaction(transaction, senderWallet);
    return transaction;
  }

  static verifyTransaction(transaction) {
    const { address, signature } = transaction.input;
    return ChainUtil.verifySignature(
      address, 
      signature, 
      ChainUtil.hash(transaction.outputs)
    );
  }
}

module.exports = Transaction;