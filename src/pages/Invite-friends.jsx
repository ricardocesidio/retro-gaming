import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../App";
import "./profile.css";
import "./Invite-friends.css";

export default function InviteFriends() {
  const { user, getUserId } = useAuth();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [invites, setInvites] = useState([
    { id: 1, email: "john@retro.com", status: "accepted", date: "Mar 28" },
    { id: 2, email: "ana.gamer@email.com", status: "pending", date: "Mar 27" },
    { id: 3, email: "carlos@vintage.net", status: "accepted", date: "Mar 25" },
    { id: 4, email: "retrofan@gmail.com", status: "expired", date: "Mar 20" },
  ]);

  const userId = getUserId(user);
  const inviteLink = `https://retro-vault.com/invite/${userId}`;
  const inviteCode = `${userId?.slice(-6) || "RETRO"}-${Date.now().toString().slice(-4)}`;

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "link") {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      } else {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const shareWhatsApp = () => {
    const message = `Join me on Retro Vault! Use my invite: ${inviteCode}\n${inviteLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const shareEmail = () => {
    const subject = "Join Retro Vault - My Exclusive Invite";
    const body = `Hey! Join me on Retro Vault marketplace:\n\nInvite Code: ${inviteCode}\nInvite Link: ${inviteLink}\n\nLet's collect together!`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const stats = {
    totalInvites: invites.length,
    accepted: invites.filter(i => i.status === "accepted").length,
    pending: invites.filter(i => i.status === "pending").length,
    conversion: ((invites.filter(i => i.status === "accepted").length / invites.length) * 100).toFixed(1),
  };

  return (
    <div className="profile-page-wrapper">
      <section className="profile-header-card elite-tech">
        <div className="profile-info">
          <h1>
            <span id="displayUsername">Invite Friends</span>
            <i className="fa-solid fa-circle-check verified-badge" title="Referral Program"></i>
          </h1>

          <div className="profile-meta-info">
            <div className="reviews-group">
              <div className="reviews-diamonds">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className={`fa-solid fa-gem ${i < 4 ? "filled" : ""}`}></i>
                ))}
              </div>
              <span className="reviews-link">
                Grow Your Vault Network
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="inventory-header elite-reward-section">
        <div className="reward-flow-wrapper">
          <h2>Rewards Progress</h2>
          <div className="reward-stats-flow">
            <div className="reward-stat">
              <i className="fa-solid fa-gem"></i>
              <span className="reward-label">Current</span>
              <span className="reward-value">{stats.accepted} Friends</span>
            </div>
            <div className="reward-divider"></div>
            <div className="reward-stat">
              <i className="fa-solid fa-trophy"></i>
              <span className="reward-label">Next Goal</span>
              <span className="reward-value">5 for Gold</span>
            </div>
            <div className="reward-divider"></div>
            <div className="reward-stat">
              <i className="fa-solid fa-star"></i>
              <span className="reward-label">Benefit</span>
              <span className="reward-value">+1 gem/invite</span>
            </div>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${Math.min((stats.accepted / 5) * 100, 100)}%` }}></div>
            </div>
            <div className="progress-labels">
              <span>0</span>
              <span className="milestone">5 Gold</span>
              <span className="milestone">10 Plat</span>
              <span>50 Supreme</span>
            </div>
          </div>
        </div>
      </div>

      <section className="reviews-slider">
        <h2>Your Invite</h2>
        <div className="slider-container">
          <div className="review-card elite-invite-card">
            <div className="invite-grid">
              <div className="invite-input-group">
                <label className="invite-label">Personal Invite Link</label>
                <div className="input-wrapper">
                  <input
                    readOnly
                    value={inviteLink}
                    className="elite-input"
                  />
                  <button
                    onClick={() => copyToClipboard(inviteLink, "link")}
                    className="elite-btn-copy"
                  >
                    {copiedLink ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
              <div className="invite-input-group">
                <label className="invite-label">Invite Code</label>
                <div className="input-wrapper">
                  <input
                    readOnly
                    value={inviteCode}
                    className="elite-input elite-code-input"
                  />
                  <button
                    onClick={() => copyToClipboard(inviteCode, "code")}
                    className="elite-btn-copy elite-btn-code"
                  >
                    {copiedCode ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            </div>

            <div className="invite-share-btns">
              <button
                onClick={shareWhatsApp}
                className="elite-btn-share whatsapp"
              >
                <i className="fab fa-whatsapp"></i>
                WhatsApp
              </button>
              <button
                onClick={shareEmail}
                className="elite-btn-share email"
              >
                <i className="fa-solid fa-envelope"></i>
                Email
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="reviews-slider">
        <h2>How It Works</h2>
        <div className="slider-container elite-how-grid" style={{ display: 'grid' }}>
          <div className="review-card elite-step-card">
            <div className="step-number">1</div>
            <h4>Share Your Invite</h4>
            <p>Send your unique link or code to friends via WhatsApp, email, or social media. Each invite is tracked individually for maximum rewards.</p>
          </div>
          <div className="review-card elite-step-card">
            <div className="step-number">2</div>
            <h4>They Join Vault</h4>
            <p>Friends create accounts using your invite link/code. Both of you receive welcome gems instantly upon successful registration.</p>
          </div>
          <div className="review-card elite-step-card">
            <div className="step-number">3</div>
            <h4>Build Trust</h4>
            <p>As your friends trade and build reputation, your network grows stronger. Earn +0.5 gems per accepted invite automatically.</p>
          </div>
          <div className="review-card elite-step-card">
            <div className="step-number">4</div>
            <h4>Track Progress</h4>
            <p>Monitor your invite history with real-time status updates. See who joined, who's pending, and track your reward milestones.</p>
          </div>
          <div className="review-card elite-step-card">
            <div className="step-number">5</div>
            <h4>Unlock Benefits</h4>
            <p>Reach 5 friends for Gold Badge, 10 for Platinum, 20 for Master. Each tier unlocks exclusive features like priority listings and featured status.</p>
          </div>
          <div className="review-card elite-step-card">
            <div className="step-number">6</div>
            <h4>Vault Legend</h4>
            <p>Invite 50+ friends to achieve Supreme Inviter status. Get Vault Legend badge, +10 gems bonus, and permanent featured listings in marketplace.</p>
          </div>
        </div>
      </section>

      <section className="reviews-slider">
        <h2>Invite History</h2>
        <div className="slider-container">
          {invites.length === 0 ? (
            <div className="review-card elite-empty-state">
              <i className="fa-solid fa-users"></i>
              <h3>No invites yet</h3>
              <p>Share your link above to start building your network!</p>
            </div>
          ) : (
            <div className="elite-history-list">
              {invites.map((invite) => (
                <div
                  key={invite.id}
                  className="elite-history-item"
                >
                  <div className="history-info">
                    <div className="history-email">{invite.email}</div>
                    <div className="history-date">{invite.date}</div>
                  </div>
                  <span className={`elite-status-badge ${invite.status}`}>
                    {invite.status.charAt(0).toUpperCase() + invite.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}