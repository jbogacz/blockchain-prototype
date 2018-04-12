const Block = require('./block');

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock(data){
    const block = Block.mineBlock(this.chain[this.chain.length - 1], data);
    this.chain.push(block);

    return block;
  }

  isValid(chain) {
    if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }

    for (let i = 1; i < chain.length - 1; i++) {
      const block = chain[i];
      const prevBlock = chain[i - 1];

      if (block.lastHash !== prevBlock.hash) {
        return false;
      }

      if (block.hash !== Block.blockHash(block)) {
        return false;
      }
    }
    return true;
  }

  replaceChain(newChain) {
    if(newChain.length <= this.chain.length) {
      console.log('Received chain is not longer than the current chain.');
      return;
    } else if (!this.isValid(newChain)) {
      console.log('The received chain is not valid.');
      return;
    }
    console.log('Replacing blockchain with the new chain.')
    this.chain = newChain;
  }
}

module.exports = Blockchain;