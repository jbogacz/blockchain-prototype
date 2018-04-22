const Wallet = require('../wallet');
const Transaction = require('../wallet/transaction');
class Miner {
  constructor(blockchain, transactionPool, wallet, p2pServer) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.p2pServer = p2pServer;
  }

  mine() {
    // include a reward for miner
    const validTransactions = this.transactionPool.validTransactions();
    validTransactions.push(
      Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet())
    );
    
    // create block consisting valid transactions (mine block and push to local blockchain)
    const block = this.blockchain.addBlock(validTransactions);

    // synchronize chains in p2p server (push local block chain to known nodes)
    this.p2pServer.syncChains();

    // clear the transaction pool
    this.transactionPool.clear();

    // broadcast to every miner to clear their transaction pools so that they don't accidentally
    // include the same transactional data in the block chain
    this.p2pServer.breadcastClearTransactions();

    return block;
  }

}

module.exports = Miner;