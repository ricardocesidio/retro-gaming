import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Messages.css';
import { readConversations, writeConversations } from '../utils/uiState';

const nowTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function Messages() {
  const location = useLocation();
  const [activeChatId, setActiveChatId] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState(() => []);
  const [reportData, setReportData] = useState({ reason: '', description: '' });
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [conversations, setConversations] = useState(() => readConversations());
  const [selectedImage, setSelectedImage] = useState(null);
  const menuRef = useRef(null);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleImgError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  const getProductColor = (name) => {
    if (name?.includes('GameBoy')) return '#654321';
    if (name?.includes('PS2') || name?.includes('PlayStation')) return '#007bff';
    if (name?.includes('N64') || name?.includes('Nintendo 64')) return '#9b59b6';
    if (name?.includes('Controller')) return '#8e44ad';
    if (name?.includes('Sega')) return '#00a86b';
    return '#333333';
  };

  const syncConversations = useCallback(() => setConversations(readConversations()), []);

  const findConversationFromParams = useCallback((search) => {
    const params = new URLSearchParams(search);
    const seller = (params.get('seller') || '').trim().toLowerCase();
    const product = (params.get('product') || '').trim().toLowerCase();

    if (!seller && !product) return null;

    return conversations.find((chat) => {
      const name = String(chat.name || '').toLowerCase();
      const snippet = String(chat.lastMsg || '').toLowerCase();
      const productName = String(chat.product?.name || '').toLowerCase();
      const productId = String(chat.product?.id || '').toLowerCase();
      const chatId = String(chat.id || '').toLowerCase();

      const sellerMatch = seller && (name.includes(seller) || seller.includes(name) || snippet.includes(seller));
      const productMatch = product && (productName.includes(product) || productId === product || chatId === product || snippet.includes(product));
      return sellerMatch || productMatch;
    }) || null;
  }, [conversations]);

  useEffect(() => {
    const matched = findConversationFromParams(location.search);
    if (matched) {
      setActiveChatId(String(matched.id));
      setMobileShowChat(true);
      return;
    }

    if (conversations.length > 0 && activeChatId === null) {
      setActiveChatId(String(conversations[0].id));
    }
  }, [activeChatId, conversations, findConversationFromParams, location.search]);

  useEffect(() => {
    const handleStorage = () => syncConversations();
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', handleStorage);
    if (showMenu) document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', handleStorage);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu, syncConversations]);

  // Auto-scroll removed per user request
  // useEffect(() => {
  //   chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  // }, [activeChatId, conversations]);

  const activeChat = conversations.find((c) => String(c.id) === String(activeChatId)) || conversations[0] || null;
  const isBlocked = activeChat ? blockedUsers.map(String).includes(String(activeChat.id)) : false;
  const isFormValid = reportData.reason !== '' && reportData.description.trim().length > 0;

  const handleDeleteChat = (id) => {
    const updated = conversations.filter((c) => String(c.id) !== String(id));
    setConversations(updated);
    writeConversations(updated);
    setActiveChatId(updated.length > 0 ? String(updated[0].id) : null);
    setShowMenu(false);
    setMobileShowChat(false);
  };

  const handleBlockUser = (id) => {
    const key = String(id);
    if (!blockedUsers.map(String).includes(key)) setBlockedUsers((prev) => [...prev, key]);
    setShowMenu(false);
  };

  const submitReport = (e) => {
    e.preventDefault();
    setShowReportModal(false);
    setShowSuccessToast(true);
    setReportData({ reason: '', description: '' });
    setTimeout(() => setShowSuccessToast(false), 4000);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be smaller than 5MB');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target.result);
    };
    reader.onerror = () => {
      e.target.value = '';
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedImage) || isBlocked || !activeChatId) return;

    const message = {
      type: 'sent',
      text: newMessage,
      time: nowTime(),
      image: selectedImage || null,
    };

    const updatedChats = conversations.map((chat) => {
      if (String(chat.id) !== String(activeChatId)) return chat;
      const history = [...(Array.isArray(chat.history) ? chat.history : []), message];
      const lastMsg = selectedImage ? '📷 Image' : newMessage;
      return {
        ...chat,
        history,
        lastMsg,
        time: message.time,
      };
    });

    setConversations(updatedChats);
    writeConversations(updatedChats);
    setNewMessage('');
    setSelectedImage(null);
  };

  const openChat = (id) => {
    const chatId = String(id);
    setActiveChatId(chatId);
    setMobileShowChat(window.innerWidth < 769);
    setShowMenu(false);
    
    // Clear unread count when opening chat
    setConversations(prev => {
      const updated = prev.map(chat => 
        String(chat.id) === chatId ? { ...chat, unread: 0 } : chat
      );
      writeConversations(updated);
      return updated;
    });
  };

  return (
    <div className="messages-page">
      <div className={`messages-layout ${mobileShowChat ? 'mobile-chat-open' : ''}`}>
        <aside className="inbox-sidebar">
          <div className="inbox-header">
            <h2>Inbox</h2>
            <span className="inbox-count">{conversations.length}</span>
          </div>

          <div className="conversation-list">
            {conversations.length > 0 ? (
              conversations.map((chat) => (
                <div
                  key={chat.id}
                  className={`chat-item ${String(activeChatId) === String(chat.id) ? 'active' : ''}`}
                  onClick={() => openChat(chat.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && openChat(chat.id)}
                >
                  <div className="chat-avatar-wrap">
                    <img src={chat.avatar} className="chat-avatar" alt={chat.name} loading="lazy" />
                    {chat.unread > 0 && <span className="chat-unread-dot" />}
                  </div>
                  <div className="chat-preview">
                    <div className="chat-preview-top">
                      <h4 className="chat-name">
                        {chat.name}
                        {blockedUsers.map(String).includes(String(chat.id)) && <span className="blocked-tag">🚫</span>}
                      </h4>
                      <span className="chat-time">{chat.time}</span>
                    </div>
                    <p className="chat-snippet">{chat.lastMsg}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-inbox">
                <i className="fa-regular fa-message" />
                <p>No conversations yet</p>
              </div>
            )}
          </div>
        </aside>

        <div className="chat-window">
          {activeChat ? (
            <>
              <div className="chat-window-header">
                <button
                  type="button"
                  className="mobile-back-btn"
                  onClick={() => setMobileShowChat(false)}
                  aria-label="Back to inbox"
                >
                  <i className="fa-solid fa-chevron-left" />
                </button>

                {activeChat.product ? (
                  <div className="chat-product-info">
                    <img 
                      src={activeChat.product.img} 
                      className="chat-product-img" 
                      alt="Product" 
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div 
                      className="chat-product-fallback" 
                      style={{
                        display: 'none',
                        width: '68px',
                        height: '68px',
                        borderRadius: '16px',
                        background: getProductColor(activeChat.product.name),
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        flexShrink: 0
                      }}
                    >
                      {activeChat.product.name.split(' ').map(w => w[0]).join('')}
                    </div>
                    <div>
                      <h3>{activeChat.product.name}</h3>
                      <p>{activeChat.product.price}</p>
                    </div>
                  </div>
                ) : (
                  <div className="chat-product-info">
                    <div className="chat-contact-avatar">
                      <img src={activeChat.avatar} alt={activeChat.name} loading="lazy" />
                    </div>
                    <h3>{activeChat.name}</h3>
                  </div>
                )}

                <div className="info-menu-container" ref={menuRef}>
                  <button
                    className="info-trigger-btn"
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                    aria-label="Chat options"
                  >
                    <i className="fa-solid fa-ellipsis-vertical" />
                  </button>

                  {showMenu && (
                    <div className="info-dropdown-box">
                      <button className="drop-item" type="button" onClick={() => { setShowMenu(false); setShowReportModal(true); }}>
                        <i className="fa-solid fa-flag" /> Report User
                      </button>
                      <button className="drop-item" type="button" onClick={() => handleBlockUser(activeChat.id)}>
                        <i className="fa-solid fa-ban" /> Block User
                      </button>
                      <div className="drop-divider" />
                      <button className="drop-item delete-text" type="button" onClick={() => handleDeleteChat(activeChat.id)}>
                        <i className="fa-solid fa-trash" /> Delete Chat
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="chat-history">
                {activeChat.history.map((msg, i) => (
                  <div key={i} className={`message-bubble message-${msg.type}`}>
                    {msg.image && (
                      <img 
                        src={msg.image} 
                        alt="Sent image" 
                        className="message-image"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                    {msg.text && <span className="msg-text">{msg.text}</span>}
                    <span className="msg-time">{msg.time}</span>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {isBlocked ? (
                <div className="blocked-notice">
                  <i className="fa-solid fa-ban" />
                  <p>This user has been blocked.</p>
                </div>
              ) : (
                <form className="chat-input-area" onSubmit={handleSendMessage}>
                  {selectedImage && (
                    <div className="image-preview-container">
                      <img src={selectedImage} alt="Preview" className="image-preview" />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => {
                          setSelectedImage(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        aria-label="Remove image"
                      >
                        <i className="fa-solid fa-xmark" />
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageSelect}
                  />
                  <button 
                    type="button" 
                    className="btn-attach"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Attach image"
                  >
                    <i className="fa-solid fa-paperclip" />
                  </button>
                  <input
                    type="text"
                    className="chat-input"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    aria-label="Message input"
                  />
                  <button type="submit" className="btn-send" aria-label="Send message" disabled={!newMessage.trim() && !selectedImage}>
                    <i className="fa-solid fa-paper-plane" />
                  </button>
                </form>
              )}
            </>
          ) : (
            <div className="empty-chat-state">
              <i className="fa-regular fa-comments" />
              <p>Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>

      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="report-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Report {activeChat?.name}</h3>
              <button className="modal-close-btn" type="button" onClick={() => setShowReportModal(false)}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <form onSubmit={submitReport}>
              <label className="report-label">Reason for reporting:</label>
              <select
                required
                className="report-select"
                value={reportData.reason}
                onChange={(e) => setReportData({ ...reportData, reason: e.target.value })}
              >
                <option value="">Select a reason...</option>
                <option value="harassment">Harassment</option>
                <option value="racism">Racism / Hate Speech</option>
                <option value="fraud">Fraud / Scam</option>
                <option value="spam">Spam</option>
                <option value="other">Other</option>
              </select>

              <label className="report-label" style={{ marginTop: 14 }}>
                Description <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(required)</span>
              </label>
              <textarea
                required
                rows={6}
                className="report-textarea"
                placeholder="Describe the incident in detail..."
                value={reportData.description}
                onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
              />

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowReportModal(false)}>Cancel</button>
                <button
                  type="submit"
                  className="btn-submit-report"
                  disabled={!isFormValid}
                  style={{ opacity: isFormValid ? 1 : 0.55, cursor: isFormValid ? 'pointer' : 'not-allowed' }}
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSuccessToast && (
        <div className="success-toast">
          <div className="toast-icon"><i className="fa-solid fa-circle-check" /></div>
          <div className="toast-content">
            <h4>Report Submitted</h4>
            <p>Our team will investigate the report.</p>
          </div>
        </div>
      )}
    </div>
  );
}
