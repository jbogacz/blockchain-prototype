const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('../wallet/index');

describe('TransactionPool', () => {
  let tp, transaction, wallet;

  beforeEach(() => {
    tp = new TransactionPool();
    wallet = new Wallet();
    transaction = wallet.createTransaction('r3c1-p13nt1', 30, tp);
  });

  it('adds transaction to the pool', () => {
    expect(tp.transactions.find(t => t.id === transaction.id))
      .toEqual(transaction);
  });

  if('updates transaction in the poll', () => {
    const oldTransaction = JSON.stringify(transaction);
    const newTransaction = transaction.update(wallet, 'r3c1-p13nt2', 40);
    tp.updateOrAddTransaction(newTransaction);
 
    expect(tp.transactions.find(t => t.id === newTransaction.id).outputs
      .find(output => outputs.address === 'r3c1-p13nt2').amount)
        .toEqual(40);
  });

  describe('mixing valid and corrupt transactions', () => {
    let validTransactions;

    beforeEach(() => {
      validTransactions = [...tp.transactions];
      for(let i=0; i<8; i++) {
        wallet = new Wallet();
        transaction = wallet.createTransaction('r4nd-4dr355', 30, tp);
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