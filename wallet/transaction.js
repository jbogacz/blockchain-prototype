const ChainUtil = require('../chain-util');

class Transaction {
  constructor() {
    // { uuid }
    this.id = ChainUtil.id();
    
    // {
    //   timestamp: DATE_NOW,
    //   address: SENDER_PUBLICK_KEY,
    //   amount: SENDER_BALANE,
    //   signature: senderWallet.sign( OUTPUTS_HASH )
    // }
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

    senderOutput.amount = senderOutput.amount - amount;
    this.outputs.push({amount, address: receptient});
    Transaction.signTransaction(this, senderWallet);

    return this;
  }

  static newTransaction(senderWallet, receptient, amount) {
    const transaction = new this();
    if (amount > senderWallet.balance) {
      console.log(`Amount: ${amount} exceeds balance.`);
      return;
    }

    transaction.outputs.push(...[
      { amount: senderWallet.balance - amount, address: senderWallet.publicKey },
      { amount, address: receptient }
    ])

    Transaction.signTransaction(transaction, senderWallet);

    return transaction;
  }

  static signTransaction(transaction, senderWallet) {
    transaction.input = {
      timestamp: Date.now(),
      address: senderWallet.publicKey,
      amount: senderWallet.balance,
      signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
    }
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