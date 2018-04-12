const ChainUtil = require('../chain-util');
const { DIFFICULTY, MINE_RATE } = require('../config');

class Block {
  constructor(timestamp, lastHash, hash, data, nounce, difficulty) {
      this.timestamp = timestamp;
      this.lastHash = lastHash;
      this.hash = hash;
      this.data = data;
      this.nounce = nounce;
      this.difficulty = difficulty || DIFFICULTY;
  }

  toString() {
    return `Block -
      Timestamp  : ${this.timestamp}
      LastHash   : ${this.lastHash.substring(0, 10)}
      Hash       : ${this.hash.substring(0, 10)}
      Nounce     : ${this.nounce}
      Difficulty : ${this.difficulty}
      Data       : ${this.data}
    `;
  }

  static genesis() {
    return new this('-', '-', '-', [], 0, DIFFICULTY);
  }

  static mineBlock(lastBlock, data) {
    let timestamp, hash, nounce = 0;
    let { difficulty } = lastBlock.difficulty;

    do {
      nounce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty(lastBlock, timestamp);
      
      hash = Block.hash(timestamp, lastBlock.hash, data, nounce, difficulty);
    } 
    while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

    return new this(timestamp, lastBlock.hash, hash, data, nounce, difficulty);
  }

  static hash(timestamp, lastHash, data, nounce, difficulty) {
    return ChainUtil.hash(`${timestamp}${lastHash}${data}${nounce}${difficulty}`);
  }

  static blockHash(block) {
    const { timestamp, lastHash, data, nounce, difficulty } = block;
    const hash = Block.hash(timestamp, lastHash, data, nounce, difficulty);
    return hash;
  }

  static adjustDifficulty(lastBlock, currentTime) {
    let { difficulty } = lastBlock;
    return currentTime - lastBlock.timestamp > MINE_RATE 
      ? difficulty - 1 
      : difficulty + 1;
  }
}

module.exports = Block;