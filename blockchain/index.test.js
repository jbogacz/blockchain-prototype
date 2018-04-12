const Blockchain = require('./index');
const Block = require('./block');

describe('Blockchain', () => {
  let bc, bc2;

  beforeEach(() => {
    bc = new Blockchain();
    bc2 = new Blockchain();
  })

  it('start with genesis block first', () => {
    expect(bc.chain[0]).toEqual(Block.genesis());
  });

  it('adds the new `block`', () => {
    const data = 'foo';
    bc.addBlock(data);

    expect(bc.chain[bc.chain.length - 1].data).toEqual(data);
  })

  it('validates the valid chain', () => {
    bc2.addBlock('foo');
    bc2.addBlock('bar');
    bc2.addBlock('baz');

    expect(bc.isValid(bc2.chain)).toBe(true);
  })

  it('validates the invalid chain', () => {
    bc2.addBlock('foo');
    bc2.addBlock('bar');
    bc2.chain[2].data = 'modified';
    bc2.addBlock('baz');

    expect(bc.isValid(bc2.chain)).toBe(false);
  })

  it('replaces the chain with a valid chain', () => {
    bc2.addBlock('goo');
    bc.replaceChain(bc2.chain);

    expect(bc.chain).toEqual(bc2.chain);
  })

  it('it does not replace the chain with one of less than or equal to length', () => {
    bc.addBlock('foo');
    bc.replaceChain(bc2.chain);

    expect(bc.chain).not.toEqual(bc2.chain);
  })
});