import React, { useMemo, useState } from "react";
import { useAuth } from "../App";
import "./profile.css";

const initialInvites = [
  { id: 1, email: "john@retro.com", status: "accepted", date: "Mar 28" },
  { id: 2, email: "ana.gamer@email.com", status: "pending", date: "Mar 27" },
  { id: 3, email: "carlos@vintage.net", status: "accepted", date: "Mar 25" },
  { id: 4, email: "retrofan@gmail.com", status: "expired", date: "Mar 20" },
];

export default function InviteFriends() {
  const { user, getUserId } = useAuth();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [invites] = useState(initialInvites);

  const userId = getUserId(user);
  const inviteLink = `https://retro-vault.com/invite/${userId}`;
  const inviteCode = `${(userId?.slice(-6) || "RETRO").toUpperCase()}-${Date.now().toString().slice(-4)}`;

  const stats = useMemo(() => {
    const accepted = invites.filter((item) => item.status === "accepted").length;
    const total = invites.length;
    return {
      totalInvites: total,
      accepted,
      pending: invites.filter((item) => item.status === "pending").length,
      conversion: total ? ((accepted / total) * 100).toFixed(1) : "0.0",
    };
  }, [invites]);

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "link") {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 1800);
      } else {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 1800);
      }
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const shareWhatsApp = () => {
    const message = `Join me on Retro Vault! Use my invite: ${inviteCode}
${inviteLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const shareEmail = () => {
    const subject = "Join Retro Vault - My Exclusive Invite";
    const body = `Hey! Join me on Retro Vault marketplace:

Invite Code: ${inviteCode}
Invite Link: ${inviteLink}

Let's collect together!`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="profile-page-wrapper invite-page">
      <section className="profile-header-card">
        <div className="profile-info">
          <h1>
            <span id="displayUsername">Invite Friends</span>
            <i className="fa-solid fa-circle-check verified-badge" title="Referral Program" />
          </h1>
          <div className="profile-meta-info">
            <div className="reviews-group">
              <div className="reviews-diamonds">
                {[...Array(5)].map((_, i) => <i key={i} className={`fa-solid fa-gem ${i < 4 ? "filled" : ""}`} />)}
              </div>
              <span className="reviews-link">Grow Your Vault Network</span>
            </div>
          </div>
          <div className="profile-stats">
            <div className="stat-link"><span className="stat-value">{stats.accepted}</span><span className="stat-label">Friends Joined</span></div>
            <div className="stat-link"><span className="stat-value">{stats.totalInvites}</span><span className="stat-label">Invites Sent</span></div>
            <div className="stat-link"><span className="stat-value">{stats.conversion}%</span><span className="stat-label">Conversion</span></div>
          </div>
        </div>
      </section>

      <section className="reviews-slider">
        <h2>Your Invite</h2>
        <div className="slider-container invite-grid">
          <div className="review-card invite-card">
            <label className="field-label">Personal Invite Link</label>
            <div className="copy-field">
              <input readOnly value={inviteLink} className="login-input" />
              <button type="button" className="btn-elite primary" onClick={() => copyToClipboard(inviteLink, "link")}>{copiedLink ? "Copied!" : "Copy"}</button>
            </div>
          </div>
          <div className="review-card invite-card">
            <label className="field-label">Invite Code</label>
            <div className="copy-field">
              <input readOnly value={inviteCode} className="login-input invite-code-input" />
              <button type="button" className="btn-elite primary" onClick={() => copyToClipboard(inviteCode, "code")}>{copiedCode ? "Copied!" : "Copy"}</button>
            </div>
          </div>
        </div>
        <div className="invite-actions">
          <button type="button" className="btn-elite primary" onClick={shareWhatsApp}><i className="fab fa-whatsapp" /> WhatsApp</button>
          <button type="button" className="btn-elite primary" onClick={shareEmail}><i className="fa-solid fa-envelope" /> Email</button>
        </div>
      </section>

      <section className="reviews-slider">
        <h2>How It Works</h2>
        <div className="slider-container how-it-works-grid">
          {[
            ["1", "Share Your Invite", "Send your unique link or code to friends via WhatsApp, email, or social media."],
            ["2", "They Join Vault", "Friends create accounts using your invite. Both get welcome gems!"],
            ["3", "Earn Rewards", "Unlock gems, badges, and priority listing for every successful invite."],
          ].map(([num, title, text]) => (
            <article className="review-card step-card" key={title}>
              <div className="step-number">{num}</div>
              <h4>{title}</h4>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="reviews-slider">
        <h2>Invite History</h2>
        <div className="slider-container">
          <div className="review-card history-card">
            {invites.map((invite) => (
              <div className="history-row" key={invite.id}>
                <div>
                  <div className="history-email">{invite.email}</div>
                  <div className="history-date">{invite.date}</div>
                </div>
                <span className={`status-pill status-${invite.status}`}>{invite.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
