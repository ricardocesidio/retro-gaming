import { useState, useRef, useEffect } from "react";
import "./Wallet.css";

const INITIAL_WALLET = {
  available: 14.00,
  pending: 0.00,
  income: 15.00,
  withdrawable: 14.00,
};

const MOCK_BANK = {
  holder: "Demo User",
  iban: "XX00 0000 0000 0000 0000 0000",
  masked: "XX00 **** **** 0000",
  country: "Demo",
};

const MOCK_TRANSACTIONS = [
  { id: 1, item: "iPhone 11 Pro", amount: 30.00, date: "2026-04-28", status: "completed", type: "sale" },
  { id: 2, item: "Adidas vintage cap", amount: 15.00, date: "2026-04-25", status: "completed", type: "sale" },
  { id: 3, item: "Withdrawal to bank account", amount: -15.00, date: "2026-04-20", status: "completed", type: "withdrawal" },
  { id: 4, item: "Withdrawal processing", amount: 0.00, date: "2026-04-18", status: "pending", type: "withdrawal" },
  { id: 5, item: "Start balance", amount: 0.00, date: "2026-04-01", status: "completed", type: "start" },
];

export default function Wallet() {
  const [wallet, setWallet] = useState({ ...INITIAL_WALLET });
  const [activeTab, setActiveTab] = useState("wallet");
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showBankForm, setShowBankForm] = useState(false);
  const [bankForm, setBankForm] = useState({ holder: MOCK_BANK.holder, iban: MOCK_BANK.iban });
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [bankSaved, setBankSaved] = useState(false);
  const [addMoneySuccess, setAddMoneySuccess] = useState(false);
  const [receiveSuccess, setReceiveSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [bankConnected, setBankConnected] = useState(true);

  const timerRef = useRef(null);
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleWithdraw = (e) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    if (!withdrawAmount || amount <= 0) return;
    if (amount > wallet.withdrawable) return;
    setWallet(prev => ({
      ...prev,
      available: +(prev.available - amount).toFixed(2),
      withdrawable: +(prev.withdrawable - amount).toFixed(2),
    }));
    setWithdrawSuccess(true);
    setShowWithdraw(false);
    setWithdrawAmount("");
    setTimeout(() => setWithdrawSuccess(false), 4000);
  };

  const handleAddMoney = () => {
    if (processing) return;
    setProcessing(true);
    setWallet(prev => ({
      ...prev,
      available: +(prev.available + 50).toFixed(2),
      withdrawable: +(prev.withdrawable + 50).toFixed(2),
      income: +(prev.income + 50).toFixed(2),
    }));
    setAddMoneySuccess(true);
    setTimeout(() => {
      setAddMoneySuccess(false);
      setProcessing(false);
    }, 4000);
  };

  const handleReceive = () => {
    if (processing) return;
    setProcessing(true);
    setReceiveSuccess(true);
    timerRef.current = setTimeout(() => {
      setReceiveSuccess(false);
      setProcessing(false);
    }, 2000);
  };

  const handleBankSave = (e) => {
    e.preventDefault();
    if (!bankForm.holder || !bankForm.iban) return;
    setBankSaved(true);
    setBankConnected(true);
    setShowBankForm(false);
    setTimeout(() => setBankSaved(false), 4000);
  };

  const formatCurrency = (val) => `${val.toFixed(2)} €`;

  const transactionIcon = (type) => {
    switch (type) {
      case "sale": return "fa-bag-shopping";
      case "withdrawal": return "fa-arrow-right-from-bracket";
      case "start": return "fa-flag";
      default: return "fa-circle";
    }
  };

  return (
    <div className="wallet-wrapper">
      <div className="wallet-container">
        <header className="wallet-header">
          <div className="wallet-header-top">
            <span className="wallet-badge">FINANCIAL HUB</span>
          </div>
          <h1>Wallet</h1>
          <p className="wallet-subtitle">Manage your balance, withdrawals, and payment history</p>
        </header>

        <div className="wallet-tabs">
          <button type="button"
            className={`wallet-tab ${activeTab === "wallet" ? "active" : ""}`}
            onClick={() => setActiveTab("wallet")}
          >
            <i className="fa-solid fa-wallet" />
            Wallet
          </button>
          <button type="button"
            className={`wallet-tab ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            <i className="fa-solid fa-clock-rotate-left" />
            History
          </button>
          <button type="button"
            className={`wallet-tab ${activeTab === "invoices" ? "active" : ""}`}
            onClick={() => setActiveTab("invoices")}
          >
            <i className="fa-solid fa-file-invoice" />
            Invoices
          </button>
        </div>

        {activeTab === "wallet" && (
          <>
            <div className="balance-grid">
              <div className="balance-card balance-card-primary">
                <span className="balance-label">Available Balance</span>
                <span className="balance-value">{wallet.available.toFixed(2)} €</span>
                <span className="balance-sub">Ready for withdrawal</span>
              </div>
              <div className="balance-card">
                <span className="balance-label">Pending Balance</span>
                <span className="balance-value balance-value-muted">{wallet.pending.toFixed(2)} €</span>
                <span className="balance-sub">Awaiting confirmation</span>
              </div>
              <div className="balance-card">
                <span className="balance-label">Total Income</span>
                <span className="balance-value">{wallet.income.toFixed(2)} €</span>
                <span className="balance-sub">All-time earnings</span>
              </div>
              <div className="balance-card">
                <span className="balance-label">Withdrawable</span>
                <span className="balance-value">{wallet.withdrawable.toFixed(2)} €</span>
                <span className="balance-sub">Available to transfer</span>
              </div>
            </div>

            <div className="wallet-actions">
              <button type="button" className="wallet-btn wallet-btn-primary" onClick={() => setShowWithdraw(true)}>
                <i className="fa-solid fa-arrow-right-from-bracket" />
                Withdraw
              </button>
              <button type="button" className="wallet-btn wallet-btn-secondary" onClick={handleAddMoney}>
                <i className="fa-solid fa-circle-plus" />
                Add Money
              </button>
              <button type="button" className="wallet-btn wallet-btn-secondary" onClick={handleReceive}>
                <i className="fa-solid fa-qrcode" />
                Receive
              </button>
            </div>

            <div className="wallet-section">
              <div className="wallet-section-header">
                <h2>Bank Account</h2>
                <button type="button" className="wallet-link-btn" onClick={() => setShowBankForm(true)}>
                  <i className="fa-solid fa-pen" />
                  {bankConnected ? "Change" : "Add"}
                </button>
              </div>
              {bankConnected ? (
                <div className="bank-card">
                  <div className="bank-card-icon">
                    <i className="fa-solid fa-building-columns" />
                  </div>
                  <div className="bank-card-info">
                    <span className="bank-card-holder">{MOCK_BANK.holder}</span>
                    <span className="bank-card-iban">{MOCK_BANK.masked}</span>
                    <span className="bank-card-country">{MOCK_BANK.country}</span>
                  </div>
                  <div className="bank-card-verified">
                    <i className="fa-solid fa-circle-check" />
                    Connected
                  </div>
                </div>
              ) : (
                <div className="bank-card bank-card-empty" onClick={() => setShowBankForm(true)}>
                  <i className="fa-solid fa-plus-circle" />
                  <span>Link a bank account to withdraw funds</span>
                </div>
              )}
            </div>

            <div className="wallet-section">
              <h2>Recent Transactions</h2>
              <div className="transaction-list">
                {MOCK_TRANSACTIONS.slice(0, 3).map((tx) => (
                  <div key={tx.id} className="transaction-row">
                    <div className="transaction-left">
                      <div className={`transaction-icon transaction-icon-${tx.type}`}>
                        <i className={`fa-solid ${transactionIcon(tx.type)}`} />
                      </div>
                      <div className="transaction-info">
                        <span className="transaction-item">{tx.item}</span>
                        <span className="transaction-date">{tx.date}</span>
                      </div>
                    </div>
                    <div className="transaction-right">
                      <span className={`transaction-amount ${tx.amount < 0 ? "negative" : ""} ${tx.status === "pending" ? "pending" : ""}`}>
                        {formatCurrency(tx.amount)}
                      </span>
                      <span className={`transaction-status transaction-status-${tx.status}`}>
                        {tx.status === "completed" ? "Completed" : "Pending"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" className="wallet-view-all" onClick={() => setActiveTab("history")}>
                View all transactions
                <i className="fa-solid fa-arrow-right" />
              </button>
            </div>

            <div className="wallet-security">
              <i className="fa-solid fa-shield-halved" />
              <div className="wallet-security-text">
                <strong>Protected Payments</strong>
                <span>Your withdrawals are processed securely. Bank details are encrypted and only used for payouts.</span>
              </div>
            </div>
          </>
        )}

        {activeTab === "history" && (
          <div className="wallet-section">
            <h2>Transaction History</h2>
            <div className="transaction-list">
              {MOCK_TRANSACTIONS.map((tx) => (
                <div key={tx.id} className="transaction-row">
                  <div className="transaction-left">
                    <div className={`transaction-icon transaction-icon-${tx.type}`}>
                      <i className={`fa-solid ${transactionIcon(tx.type)}`} />
                    </div>
                    <div className="transaction-info">
                      <span className="transaction-item">{tx.item}</span>
                      <span className="transaction-date">{tx.date}</span>
                    </div>
                  </div>
                  <div className="transaction-right">
                    <span className={`transaction-amount ${tx.amount < 0 ? "negative" : ""} ${tx.status === "pending" ? "pending" : ""}`}>
                      {formatCurrency(tx.amount)}
                    </span>
                    <span className={`transaction-status transaction-status-${tx.status}`}>
                      {tx.status === "completed" ? "Completed" : "Pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "invoices" && (
          <div className="wallet-section">
            <h2>Invoices & Receipts</h2>
            <div className="invoice-empty">
              <i className="fa-solid fa-file-invoice" />
              <p>No invoices available yet. Invoices will appear after completed sales.</p>
            </div>
          </div>
        )}
      </div>

      {showWithdraw && (
        <div className="wallet-modal-overlay" onClick={() => setShowWithdraw(false)}>
          <div className="wallet-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="wallet-modal-close" onClick={() => setShowWithdraw(false)}>
              <i className="fa-solid fa-xmark" />
            </button>
            <h2>Withdraw Funds</h2>
            <p className="wallet-modal-sub">Transfer your available balance to your bank account.</p>
            <div className="withdraw-info">
              <div className="withdraw-info-row">
                <span>Available</span>
                <span className="withdraw-info-value">{wallet.withdrawable.toFixed(2)} €</span>
              </div>
              <div className="withdraw-info-row">
                <span>Destination</span>
                <span className="withdraw-info-value">{MOCK_BANK.masked}</span>
              </div>
            </div>
            <form onSubmit={handleWithdraw} className="withdraw-form">
              <label className="withdraw-label">Amount (€)</label>
              <div className="withdraw-input-wrap">
                <input
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*\.?[0-9]{0,2}"
                  max={wallet.withdrawable}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.00"
                  required
                />
                <span className="withdraw-input-suffix">EUR</span>
              </div>
              <button
                type="submit"
                className="wallet-btn wallet-btn-primary wallet-btn-full"
                disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > wallet.withdrawable}
              >
                <i className="fa-solid fa-arrow-right-from-bracket" />
                Withdraw {withdrawAmount ? `${parseFloat(withdrawAmount).toFixed(2)} €` : ""}
              </button>
            </form>
          </div>
        </div>
      )}

      {showBankForm && (
        <div className="wallet-modal-overlay" onClick={() => setShowBankForm(false)}>
          <div className="wallet-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="wallet-modal-close" onClick={() => setShowBankForm(false)}>
              <i className="fa-solid fa-xmark" />
            </button>
            <h2>{bankConnected ? "Edit Bank Account" : "Add Bank Account"}</h2>
            <p className="wallet-modal-sub">Your bank details are encrypted and only used for payouts.</p>
            <form onSubmit={handleBankSave} className="withdraw-form">
              <label className="withdraw-label">Account Holder</label>
              <input
                type="text"
                value={bankForm.holder}
                onChange={(e) => setBankForm({ ...bankForm, holder: e.target.value })}
                placeholder="Full name"
                required
              />
              <label className="withdraw-label">IBAN</label>
              <input
                type="text"
                value={bankForm.iban}
                onChange={(e) => setBankForm({ ...bankForm, iban: e.target.value })}
                placeholder="PT50 XXXX XXXX XXXX XXXX XXXX X"
                required
              />
              <button type="submit" className="wallet-btn wallet-btn-primary wallet-btn-full">
                <i className="fa-solid fa-check" />
                Save Bank Account
              </button>
            </form>
          </div>
        </div>
      )}

      {withdrawSuccess && (
        <div className="wallet-toast">
          <i className="fa-solid fa-circle-check" />
          Withdrawal request submitted successfully. Funds will arrive within 1-3 business days.
        </div>
      )}

      {bankSaved && (
        <div className="wallet-toast">
          <i className="fa-solid fa-circle-check" />
          Bank account updated successfully.
        </div>
      )}

      {addMoneySuccess && (
        <div className="wallet-toast">
          <i className="fa-solid fa-circle-check" />
          €50.00 added to your wallet.
        </div>
      )}

      {receiveSuccess && (
        <div className="wallet-toast">
          <i className="fa-solid fa-circle-check" />
          Payment request generated. Share your wallet address to receive funds.
        </div>
      )}
    </div>
  );
}
