import React, { useState, useEffect, useRef } from 'react';
import '../pages/messages.css'; 


export default function Messages() {
  // --- STATES ---
  const [activeChatId, setActiveChatId] = useState(1);
  const [newMessage, setNewMessage] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);

  const [showMenu, setShowMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  
  const [blockedUsers, setBlockedUsers] = useState([]); 
  const [reportData, setReportData] = useState({ reason: '', description: '' });
  
  const menuRef = useRef(null);
  const fileInputRef = useRef(null);

  

  // --- FULL DATASET ---
  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: "@yantravelling",
      avatar: "https://i.pravatar.cc/150?img=11",
      lastMsg: "Final Fantasy still available?",
      time: "14:30",
      unread: 1,
      product: {
        name: "Final Fantasy - PS1",
        price: "25€",
        img: "./images/ff12.JPG"
      },
      history: [
        { type: 'received', content: "Hi! Does the screen have scratches?", time: "14:10" },
        { type: 'sent', content: "It's flawless! New lens.", time: "14:15" },
        { type: 'received', content: "Do you ship via MBWay?", time: "14:20" }
      ]
    },
    {
      id: 2,
      name: "@anaretro",
      avatar: "https://i.pravatar.cc/150?img=32",
      lastMsg: "The package arrived perfectly!",
      time: "Yesterday",
      unread: 0,
      product: null,
      history: [{ type: 'received', content: "The package arrived perfectly!", time: "Yesterday" }]
    }
  ]);

  

  // --- LOGIC ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const activeChat = conversations.find(c => c.id === activeChatId);
  const isBlocked = blockedUsers.includes(activeChatId);

  const isFormValid = reportData.reason !== '' && reportData.description.trim().length > 0;

  
  // --- HANDLERS ---
  const handleDeleteChat = (id) => {
    const updated = conversations.filter(c => c.id !== id);
    setConversations(updated);
    setActiveChatId(updated.length > 0 ? updated[0].id : null);
    setShowMenu(false);
  };

  const handleBlockUser = (id) => {
    if (!blockedUsers.includes(id)) {
      setBlockedUsers([...blockedUsers, id]);
    }
    setShowMenu(false);
  };

  const handleUnblockUser = (id) => {
    setBlockedUsers(blockedUsers.filter(userId => userId !== id));
    setShowMenu(false);
  };

  const submitReport = (e) => {
    e.preventDefault();
    setShowReportModal(false);
    setShowSuccessToast(true);
    setReportData({ reason: '', description: '' });
    setTimeout(() => setShowSuccessToast(false), 4000);
  };

  const handleMediaSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      alert("Só é permitido enviar imagem ou vídeo.");
      return;
    }
    setMediaFile(file);
    setSelectedMedia(URL.createObjectURL(file));
    e.target.value = '';
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (isBlocked || !activeChatId) return;
    if (!newMessage.trim() && !mediaFile) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let messageContent;
    let lastMsgText = newMessage.trim() || "📷 Mídia enviada";

    if (mediaFile) {
      messageContent = mediaFile.type.startsWith('image/') ? (
        <img src={URL.createObjectURL(mediaFile)} alt="Enviada" style={{ maxWidth: '100%', borderRadius: '12px' }} />
      ) : (
        <video src={URL.createObjectURL(mediaFile)} controls style={{ maxWidth: '100%', borderRadius: '12px' }} />
      );
    } else {
      messageContent = newMessage;
    }

    const updatedChats = conversations.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          history: [...chat.history, { type: 'sent', content: messageContent, time }],
          lastMsg: lastMsgText
        };
      }
      return chat;
    });

    setConversations(updatedChats);
    setNewMessage('');
    setSelectedMedia(null);
    setMediaFile(null);
  };

  return (
    <div className="messages-page">
      <main className="main-content">
        <div className="messages-wrapper">
          
          {/* SIDEBAR */}
          <div className="inbox-sidebar">
            <div className="inbox-header"><h2>Inbox</h2></div>
            <div className="conversation-list">
              {conversations.map((chat) => (
                <div 
                  key={chat.id} 
                  className={`chat-item ${activeChatId === chat.id ? 'active' : ''}`}
                  onClick={() => { setActiveChatId(chat.id); setShowMenu(false); }}
                >
                  <img src={chat.avatar} className="chat-avatar" alt={chat.name} />
                  <div className="chat-preview">
                    <h4 className="chat-name">
                      {chat.name} {blockedUsers.includes(chat.id) && <span className="blocked-tag">🚫</span>}
                    </h4>
                    <p className="chat-snippet">{chat.lastMsg}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CHAT WINDOW */}
          <div className="chat-window">
            {activeChat ? (
              <>
                <div className="chat-window-header">
                  {activeChat.product ? (
                    <div className="chat-product-info">
                      <img src={activeChat.product.img} className="chat-product-img" alt="Product" />
                      <div className="chat-product-details">
                        <h3>{activeChat.product.name}</h3>
                        <p>{activeChat.product.price}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="chat-product-info"><h3>{activeChat.name}</h3></div>
                  )}

                  <div className="info-menu-container" ref={menuRef}>
                    <button className="info-trigger-btn" onClick={() => setShowMenu(!showMenu)}>
                      <i className="fa-solid fa-circle-info info-btn-blue"></i>
                    </button>

                    {showMenu && (
                      <div className="info-dropdown-box">
                        <button className="drop-item" onClick={() => { setShowMenu(false); setShowReportModal(true); }}>
                          <i className="fa-solid fa-flag"></i> Report User
                        </button>

                        {isBlocked ? (
                          <button className="drop-item" onClick={() => handleUnblockUser(activeChat.id)}>
                            <i className="fa-solid fa-unlock"></i> Unblock User
                          </button>
                        ) : (
                          <button className="drop-item" onClick={() => handleBlockUser(activeChat.id)}>
                            <i className="fa-solid fa-ban"></i> Block User
                          </button>
                        )}

                        <div className="drop-divider"></div>
                        <button className="drop-item delete-text" onClick={() => handleDeleteChat(activeChat.id)}>
                          <i className="fa-solid fa-trash"></i> Delete Chat
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="chat-history">
                  {activeChat.history.map((msg, index) => (
                    <div key={index} className={`message-bubble message-${msg.type}`}>
                      {msg.content}
                      <span className="msg-time">{msg.time}</span>
                    </div>
                  ))}
                </div>

                {isBlocked ? (
                  <div className="blocked-notice">
                    <i className="fa-solid fa-ban"></i>
                    <p>This user has been blocked. You can no longer send messages.</p>
                  </div>
                ) : (
                  <>
                    <form className="chat-input-area" onSubmit={handleSendMessage}>
                      <input 
                        type="text" 
                        className="chat-input" 
                        placeholder="Type a message..." 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />

                      <button type="button" className="btn-media" onClick={() => fileInputRef.current?.click()}>
                        <i className="fa-solid fa-camera"></i>
                      </button>

                      <input
                        type="file"
                        accept="image/*,video/*"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleMediaSelect}
                      />

                      <button type="submit" className="btn-send">
                        <i className="fa-solid fa-paper-plane"></i>
                      </button>
                    </form>

                    {selectedMedia && (
                      <div className="media-preview">
                        {mediaFile.type.startsWith('image/') ? (
                          <img src={selectedMedia} alt="preview" className="preview-media" />
                        ) : (
                          <video src={selectedMedia} controls className="preview-media" />
                        )}
                        <button className="remove-media-btn" onClick={() => { setSelectedMedia(null); setMediaFile(null); }}>
                          ×
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <div className="empty-chat-state">
                <i className="fa-regular fa-message"></i>
                <p>Select a conversation to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* REPORT MODAL */}
      {showReportModal && (
        <div className="modal-overlay">
          <div className="report-modal">
            <div className="modal-header">
              <h3>Report {activeChat?.name}</h3>
              <button className="close-modal" onClick={() => setShowReportModal(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form onSubmit={submitReport}>
              <label className="report-label">Reason for reporting:</label>
              <select 
                required 
                className="report-select"
                value={reportData.reason}
                onChange={(e) => setReportData({...reportData, reason: e.target.value})}
              >
                <option value="">Select a reason...</option>
                <option value="harassment">Harassment</option>
                <option value="racism">Racism / Hate Speech</option>
                <option value="fraud">Fraud / Scam</option>
                <option value="spam">Spam</option>
                <option value="other">Other</option>
              </select>

              <h2 className="report-h2-instruction">MINIMUM 10 LINES DESCRIPTION</h2>

              <textarea 
                required 
                rows="10" 
                className="report-textarea" 
                placeholder="Describe the incident in detail..."
                value={reportData.description}
                onChange={(e) => setReportData({...reportData, description: e.target.value})}
              ></textarea>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowReportModal(false)}>Cancel</button>
                <button 
                  type="submit" 
                  className="btn-submit-report" 
                  disabled={!isFormValid}
                  style={{ 
                    background: isFormValid ? '#ff4b4b' : '#333', 
                    cursor: isFormValid ? 'pointer' : 'not-allowed',
                    opacity: isFormValid ? 1 : 0.6
                  }}
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUCCESS TOAST */}
      {showSuccessToast && (
        <div className="success-toast">
          <div className="toast-icon"><i className="fa-solid fa-circle-check"></i></div>
          <div className="toast-content">
            <h4>Report Submitted</h4>
            <p>Thank you for reporting. Our team will investigate.</p>
          </div>
        </div>
      )}
    </div>
  );
}