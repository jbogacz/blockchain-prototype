const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');
const Blockchain = require('../blockchain/index');

const { INITIAL_BALANCE } = require('../config');

describe('Wallet', () => {
  let wallet, tp, bc;

  beforeEach(() => {
    wallet = new Wallet();
    tp = new TransactionPool();
    bc = new Blockchain();
  });

  describe('creating a transaction', () => {
    let transaction, sendAmount, recipient;

    beforeEach(() => {
      sendAmount = 50;
      recipient = 'r4nd0m-4ddr355';
      transaction = wallet.createTransaction(recipient, sendAmount, bc, tp);
    });

    describe('and doing the same transaction', () => {
      beforeEach(() => {
        wallet.createTransaction(recipient, sendAmount, bc, tp);
      });

      it('doubles the `sendAmount subtracted from wallet balance', () => {
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
          .toEqual(wallet.balance - sendAmount * 2);
      });

      it('clones the `sendAmount` aoutput for recipient', () => {
        expect(transaction.outputs.filter(output => output.address === recipient).map(output => output.amount))
          .toEqual([sendAmount, sendAmount]);
      });
    });
  });

  describe('calculate a balance', () => {
    let addBalance, repeatAdd, senderWallet;
    
    beforeEach(() => {
      addBalance = 30;
      repeatAdd = 4;
      senderWallet = new Wallet();
  
      for (let i = 0; i < repeatAdd; i++) {
        senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tp);
      }

      bc.addBlock(tp.transactions);
    });

    it('calculate balance for blockchain transactions matching the recipient', () => {
      expect(wallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE + (addBalance * repeatAdd));
    });

    it('calculates balance for blockchain transactions matching the sender', () => {
      expect(senderWallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE - (addBalance * repeatAdd));
    });

    describe('and the recipient conduct a transaction', () => {
      let senderBalance, recipientBalan

      beforeEach(() => {
        tp.clear()
        subtractBalance = 35;
        wallet.createTransaction(senderWallet.publicKey, subtractBalance, bc, tp);
        bc.addBlock(tp.transactions);
      });

      it('calculates balance for sender after reciepient has transacted', () => {
        expect(senderWallet.calculateBalance(bc))
          .toEqual(INITIAL_BALANCE - (addBalance * repeatAdd) + subtractBalance);
      });

      it('calculate recipient balance after reciepient has transacted', () => {
        expect(wallet.calculateBalance(bc))
          .toEqual(INITIAL_BALANCE + (addBalance * repeatAdd) - subtractBalance);
      })
    })
  });
});
