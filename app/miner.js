class Miner {
  constructor(blockchain, transactionPool, wallet, p2pServer) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.p2pServer = p2pServer;
  }

  mine() {
    const validTransaction = this.transactionPool.validTransactions();
    // include a reward for miner
    // create block consisting valid transactions
    // synchronize chains in p2p server
    // clear the transaction pool
    // broadcast to every miner to clear their transaction pools

  }

}

module.exports = Miner;