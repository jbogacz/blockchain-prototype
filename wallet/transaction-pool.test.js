const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('../wallet/index');

describe('TransactionPool', () => {
  let tp, transaction, wallet;

  beforeEach(() => {
    tp = new TransactionPool();
    wallet = new Wallet();
    transaction = Transaction.newTransaction(wallet, 'r3c1-p13nt1', 30);

    tp.updateOrAddTransaction(transaction);
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
});