const ChainUtil = require('../chain-util');
const Transaction = require('./transaction');
const { INITIAL_BALANCE } = require('../config');

class Wallet {
  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = ChainUtil.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex');
  }

  toString() {
    return `Wallet -
      publicKey : ${this.publicKey.toString()}
      balance   : ${this.balance}`;
  }

  sign(dataHash) {
    return this.keyPair.sign(dataHash);
  }

  createTransaction(recipient, amount, blockchain, transactionPool) {
    let transaction = transactionPool.existingTransaction(this.publicKey);

    if (transaction) {
      transaction.update(this, recipient, amount);
    } else {
      transaction = Transaction.newTransaction(this, recipient, amount);
      transactionPool.addTransaction(transaction);
    }

    this.balance = this.calculateBalance(blockchain);

    return transaction;
  }

  calculateBalance(blockchain) {
    let allTransactions = [];
    let balance = this.balance;
    
    // collect all transactions
    blockchain.chain.forEach(block => allTransactions.push(block.data));
    
    // collect only this wallet transactions looking at transaction output publicKey
    const walletTransactions = allTransactions
    .filter(transaction => transaction.input.address === this.publicKey);
    
    // retrieve timestamp of wallet's last transaction
    // retrieve amount of wallet's last output transaction
    let timestamp = 0;
    if(walletTransactions.length > 0) {
      
      // retrieve last transaction
      const lastTransaction = walletTransactions
        .reduce((current, next) => 
          next.input.timestamp > current.input.timestamp 
            ? next 
            : current
          );
      timestamp = lastTransaction.input.timestamp;
      balance = lastTransaction.outputs.find(output => output.address === this.publicKey).amount; 
    } 

    // calculate all transactions that were transacted to the wallet after last wallet output transaction
    allTransactions.forEach(transaction => {
      if(transaction.input.timestamp > timestamp) {
        transaction.outputs.forEach(output => {
          if(output.address === this.publicKey) {
            balance += output.amount;
          }
        });
      }
    });

    return balance;
  }

  static blockchainWallet() {
    const blockchainWallet = new this();
    blockchainWallet.publicKey = 'blockchain-wallet';
    return blockchainWallet;
  }
}

module.exports = Wallet;