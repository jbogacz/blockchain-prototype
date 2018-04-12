const Block = require('./block');
const { MINE_RATE } = require('../config'); 

describe('Block', () => {
  let data, lastBlock, block;
  
  beforeEach(() => {
    data = 'bar';
    lastBlock = Block.genesis();
    block = Block.mineBlock(lastBlock, data);
  }); 
  
  it('sets the `data` to match input', () => {
    expect(block.data).toEqual(data);
  });

  it('sets `lastHash` to match hash of last block', () => {
    expect(block.lastHash).toEqual(lastBlock.hash);
  });

  it('generates a hash that matches the difficulty', () => {
    expect(block.hash.substring(0, block.difficulty)).toEqual('0'.repeat(block.difficulty));
    //console.log(block.toString());
  })

  it('lowers difficulty for slowly mined blocks', () => {
    expect(Block.adjustDifficulty(block, block.timestamp + 1000 * 60 * 60))
      .toEqual(block.difficulty - 1);
  });

  it('raises difficulty for quickly mined blocks', () => {
    expect(Block.adjustDifficulty(block, block.timestamp + MINE_RATE - 1000))
      .toEqual(block.difficulty + 1);
  })
})