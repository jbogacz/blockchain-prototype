const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('../wallet/index');
const Blockchain = require('../blockchain/index');

describe('TransactionPool', () => {
  let tp, transaction, wallet, bc;

  beforeEach(() => {
    tp = new TransactionPool();
    wallet = new Wallet();
    transaction = wallet.createTransaction('r3c1-p13nt1', 30, bc, tp);
    bc = new Blockchain()
  });

  it('adds transaction to the pool', () => {
    expect(tp.transactions.find(t => t.id === transaction.id))
      .toEqual(transaction);
  });

  it('updates transaction in the poll', () => {
    const newTransaction = transaction.update(wallet, 'r3c1-p13nt2', 40);
 
    expect(tp.transactions.find(t => t.id === newTransaction.id).outputs
      .find(output => output.address === 'r3c1-p13nt2').amount)
        .toEqual(40);
  });

  it('clears transaction pool', () => {
    tp.clear();
    expect(tp.transactions).toEqual([]);
  });

  describe('mixing valid and corrupt transactions', () => {
    let validTransactions;

    beforeEach(() => {
      validTransactions = [...tp.transactions];
      for(let i=0; i<8; i++) {
        wallet = new Wallet();
        transaction = wallet.createTransaction('r4nd-4dr355', 30, bc, tp);
        if(i%2 == 0) {
          transaction.input.amount = 999;
        } else {
          validTransactions.push(transaction);
        }
      }
    });

    it('shows different between valid and corrupt transactions', () => {
      expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions));
    });

    it('grabs valid transactions', () => {
      expect(JSON.stringify(tp.validTransactions())).toEqual(JSON.stringify(validTransactions));
    });
  });
});