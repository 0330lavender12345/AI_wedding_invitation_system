import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

function convertTextToHtml(text, brideName, groomName, weddingDate, weddingLocation, guestName) {
  // Split the text into paragraphs and filter out empty ones
  const paragraphs = text.split('\n\n').map(para => para.trim()).filter(para => para);

  // Check if the first paragraph already contains a greeting like "Dear" or "親愛的"
  const hasGreeting = paragraphs.length > 0 && 
    (paragraphs[0].toLowerCase().includes('dear') || paragraphs[0].includes('親愛的'));

  // Generate the HTML invitation
  return `
    <div style="max-width: 600px; margin: 20px auto; background-color: #fff; border: 1px solid #e0e0e0; border-radius: 10px; padding: 30px; font-family: 'Georgia', serif; line-height: 1.6; color: #333;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="font-size: 28px; color: #4A2C1F; margin: 0;">Wedding Invitation</h1>
        <h2 style="font-size: 22px; color: #4A2C1F; margin: 10px 0;">${brideName} & ${groomName}</h2>
        <hr style="border: 0; border-top: 2px solid #D4A373; width: 50px; margin: 10px auto;">
      </div>
      <div style="margin-bottom: 20px;">
        ${!hasGreeting ? `<p style="font-size: 16px; color: #555;">親愛的 ${guestName}，</p>` : ''}
        ${paragraphs.map(para => `<p style="font-size: 16px; color: #555; margin: 10px 0;">${para}</p>`).join('')}
      </div>
      <div style="background-color: #F9F5F0; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="font-size: 20px; color: #4A2C1F; margin: 0 0 10px 0;">婚禮詳情</h3>
        <p style="font-size: 16px; color: #555; margin: 5px 0;"><strong>日期：</strong> ${weddingDate}</p>
        <p style="font-size: 16px; color: #555; margin: 5px 0;"><strong>地點：</strong> ${weddingLocation}</p>
      </div>
      <div style="text-align: center;">
        <p style="font-size: 16px; color: #555; margin: 0;">我們誠摯邀請您共襄盛舉，分享我們的喜悅。</p>
      </div>
    </div>
  `;
}

function Form() {
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [weddingLocation, setWeddingLocation] = useState('');

  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [relationship, setRelationship] = useState('');
  const [description, setDescription] = useState('');

  const [invitationContent, setInvitationContent] = useState('');

  // Track invited guests history
  const [invitedGuests, setInvitedGuests] = useState([]);
  // Track if a submission has been made to trigger layout shift
  const [hasSubmitted, setHasSubmitted] = useState(false);
  // Search functionality
  const [searchTerm, setSearchTerm] = useState('');
  // Loading states
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  // Notification state
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // New states for CSV functionality
  const [guests, setGuests] = useState([]);
  const [showGuestInfo, setShowGuestInfo] = useState(false);

  const [saveButtonState, setSaveButtonState] = useState('ready');
  const [sendButtonState, setSendButtonState] = useState('ready');

  const [generateButtonState, setGenerateButtonState] = useState('ready'); // 'ready', 'generating', 'generated'

  useEffect(() => {
    const savedBrideName = localStorage.getItem('brideName');
    const savedGroomName = localStorage.getItem('groomName');
    const savedWeddingDate = localStorage.getItem('weddingDate');
    const savedWeddingLocation = localStorage.getItem('weddingLocation');
    const savedInvitedGuests = localStorage.getItem('invitedGuests');

    if (savedBrideName) setBrideName(savedBrideName);
    if (savedGroomName) setGroomName(savedGroomName);
    if (savedWeddingDate) setWeddingDate(savedWeddingDate);
    if (savedWeddingLocation) setWeddingLocation(savedWeddingLocation);
    if (savedInvitedGuests) {
      const parsedGuests = JSON.parse(savedInvitedGuests);
      setInvitedGuests(parsedGuests);
      if (parsedGuests.length > 0) {
        setHasSubmitted(true);
      }
    }
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleClearInvitedGuests = () => {
    localStorage.removeItem('invitedGuests');
    setInvitedGuests([]);
    setHasSubmitted(false);
    showNotification('已清除所有寄出記錄！');
  };

  const handleSaveWeddingInfo = () => {
    setSaveButtonState('saving');

    setTimeout(() => {
      localStorage.setItem('brideName', brideName);
      localStorage.setItem('groomName', groomName);
      localStorage.setItem('weddingDate', weddingDate);
      localStorage.setItem('weddingLocation', weddingLocation);

      setSaveButtonState('saved');
      showNotification('婚禮基本資訊已儲存！');

      setTimeout(() => {
        setSaveButtonState('ready');
      }, 3000);
    }, 800);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const cleanedData = results.data.map(guest => {
          return {
            姓名: guest['姓名'] || guest['姓名 '] || guest['name'] || '',
            Email: guest['Email'] || guest['email'] || '',
            關係: guest['關係'] || guest['關係 '] || guest['relationship'] || '',
            描述: guest['描述'] || guest['描述 '] || guest['description'] || '',
            sent: false
          };
        });

        setGuests(cleanedData);
        showNotification('CSV 檔案上傳成功！');
      },
      error: () => {
        showNotification('CSV 檔案讀取失敗', 'error');
      }
    });
  };

  const handleSelectGuest = (guest) => {
    setGuestName(guest['姓名'] || '');
    setGuestEmail(guest['Email'] || '');
    setRelationship(guest['關係'] || '');
    setDescription(guest['描述'] || '');
    setShowGuestInfo(true);
  };

  const handleGenerate = async () => {
    if (!brideName || !groomName || !weddingDate || !weddingLocation || !guestName) {
      showNotification('請填寫必要的婚禮和賓客資訊', 'error');
      return;
    }

    setIsGenerating(true);
    setGenerateButtonState('generating');

    const formData = {
      brideName,
      groomName,
      weddingDate,
      weddingLocation,
      guestName,
      guestEmail,
      relationship,
      description,
    };

    console.log('發送請求到 n8n:', formData); // 添加日誌

    try {
      console.log('開始發送請求...');
      const response = await fetch('https://yyunnnnnnnnnnnnnnn.app.n8n.cloud/webhook/se', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      console.log('請求響應狀態:', response.status); // 添加狀態碼日誌

      const data = await response.text();
      console.log('請求響應數據:', data); // 添加響應數據日誌

      setInvitationContent(data);
      setGenerateButtonState('generated');
      showNotification('邀請函已成功生成！');

      setTimeout(() => {
        setGenerateButtonState('ready');
      }, 3000);
    } catch (error) {
      console.error('請求錯誤詳情:', error);
      setGenerateButtonState('ready');
      showNotification('生成邀請函失敗', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSend = async () => {
    if (!guestEmail || !invitationContent) {
      showNotification('請確保已填寫賓客Email並已生成邀請函內容', 'error');
      return;
    }

    setSendButtonState('sending');
    setIsSending(true);
    const htmlFormatted = invitationContent.includes('<div') 
      ? invitationContent 
      : convertTextToHtml(invitationContent, brideName, groomName, weddingDate, weddingLocation, guestName);
    const formData = {
      brideName,
      groomName,
      weddingDate,
      weddingLocation,
      guestName,
      guestEmail,
      relationship,
      description,
      invitationContent: htmlFormatted,
    };

    try {
      const response = await fetch('https://yyunnnnnnnnnnnnnnn.app.n8n.cloud/webhook/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        mode: 'cors',
        cache: 'no-cache',
      });

      if (response.ok) {
        const newGuest = {
          name: guestName,
          email: guestEmail,
          relationship: relationship,
          sentAt: new Date().toLocaleString()
        };

        const updatedGuestList = [...invitedGuests, newGuest];
        setInvitedGuests(updatedGuestList);

        localStorage.setItem('invitedGuests', JSON.stringify(updatedGuestList));

        setHasSubmitted(true);

        setGuests(prevGuests =>
          prevGuests.map(guest =>
            (guest['Email'] === guestEmail || guest['姓名'] === guestName)
              ? { ...guest, sent: true }
              : guest
          )
        );

        setSendButtonState('sent');
        showNotification('邀請函已成功寄出！');

        setTimeout(() => {
          setGuestName('');
          setGuestEmail('');
          setRelationship('');
          setDescription('');
          setInvitationContent('');
          setShowGuestInfo(false);

          setSendButtonState('ready');
        }, 3000);
      } else {
        setSendButtonState('ready');
        showNotification('寄送失敗，請檢查網路連接並確認 n8n 伺服器運行正常', 'error');
      }
    } catch (error) {
      setSendButtonState('ready');
      showNotification('發生錯誤，可能需要手動在 n8n 頁面執行工作流程', 'error');
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  const filteredGuests = invitedGuests.filter(guest =>
    guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inputStyle = {
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ffffff',
    backgroundColor: 'transparent',
    color: '#ffffff',
    width: '100%',
    transition: 'all 0.3s ease',
  };

  const dateInputStyle = {
    ...inputStyle,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    colorScheme: 'dark',
  };

  const saveButtonStyle = {
    backgroundColor: 'transparent',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '6px',
    border: '1px solid #ffffff',
    fontFamily: 'Tinos, serif',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s ease',
  };

  const csvButtonStyle = {
    display: 'inline-block',
    padding: '10px 16px',
    border: '1px solid white',
    borderRadius: '6px',
    backgroundColor: 'transparent',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: 'Tinos, serif',
    transition: 'all 0.3s ease',
    width: 'fit-content',
    maxWidth: '200px',
    textAlign: 'center'
  };

  const generateButtonStyle = {
    backgroundColor: isGenerating ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
    color: 'white',
    padding: '14px 35px',
    borderRadius: '6px',
    border: '1px solid #ffffff',
    cursor: isGenerating ? 'not-allowed' : 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const sendButtonStyle = {
    backgroundColor: 'transparent',
    color: 'white',
    padding: '14px 35px',
    borderRadius: '6px',
    border: '1px solid #ffffff',
    cursor: isSending ? 'not-allowed' : 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '30px auto',
    width: '220px',
  };

  const searchInputStyle = {
    ...inputStyle,
    marginBottom: '15px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    padding: '10px 15px',
  };

  const containerStyle = {
    display: 'flex',
    maxWidth: '1200px',
    margin: '0 auto',
    gap: '30px',
  };

  const formContainerStyle = {
    width: guests.length > 0 ? '65%' : '100%',
    transition: 'width 0.5s ease',
  };

  const historySidebarStyle = {
    width: '35%',
    padding: '30px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    display: guests.length > 0 ? 'block' : 'none',
    opacity: guests.length > 0 ? '1' : '0',
    transition: 'opacity 0.5s ease',
  };

  const spinnerStyle = {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '50%',
    borderTopColor: 'white',
    animation: 'spin 1s linear infinite',
    marginRight: '10px',
  };

  const notificationStyle = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '15px 25px',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
    backgroundColor: notification.type === 'error' ? 'rgba(220, 53, 69, 0.95)' : 'rgba(40, 167, 69, 0.95)',
    color: 'white',
    fontSize: '16px',
    fontWeight: '500',
    zIndex: 1000,
    transition: 'all 0.3s ease',
    transform: notification.show ? 'translateY(0)' : 'translateY(-100px)',
    opacity: notification.show ? 1 : 0,
    display: 'flex',
    alignItems: 'center',
    minWidth: '300px',
  };

  const notificationIconStyle = {
    marginRight: '12px',
    fontSize: '20px',
  };

  const guestListItemStyle = {
    padding: '12px 15px',
    borderRadius: '6px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: '8px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.2s ease',
  };

  const keyFramesStyle = `
    @keyframes spin {
      to {transform: rotate(360deg);}
    }
  `;

  return (
    <>
      <style>{keyFramesStyle}</style>

      {/* Notification component */}
      <div style={notificationStyle}>
        <span style={notificationIconStyle}>
          {notification.type === 'error' ? '❌' : '✅'}
        </span>
        {notification.message}
      </div>

      <div style={containerStyle}>
        <div className="form-container" style={{
          ...formContainerStyle,
          padding: '40px',
          backgroundColor: 'transparent',
          borderRadius: '12px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
          fontFamily: '"Noto Sans TC", sans-serif'
        }}>
          <h2 className="main-title" style={{
            fontSize: '32px',
            marginBottom: '40px',
            color: '#ddd',
            textAlign: 'center',
            fontWeight: '600',
            position: 'relative',
            paddingBottom: '5px'
          }}>
            Wedding Invitation
          </h2>

          <div className="form-section" style={{
            backgroundColor: 'transparent',
            padding: '25px',
            borderRadius: '10px',
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontSize: '22px',
              marginBottom: '20px',
              color: '#ddd',
              paddingLeft: '12px'
            }}>Wedding Information <span style={{ fontSize: '16px', color: '#ddd' }}></span></h3>

            <p style={{ fontSize: '14px', color: ':#ddd', marginBottom: '20px' }}>Please fill in your basic wedding information. These details will be used to generate all invitations.</p>

            <div className="input-group" style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
              <div className="input-field" style={{ flex: 1 }}>
                <label style={{ color: '#ddd', fontWeight: '500' }}>Bride：</label>
                <input
                  type="text"
                  value={brideName}
                  onChange={(e) => setBrideName(e.target.value)}
                  placeholder="Ex：Emily"
                  style={inputStyle}
                />
              </div>
              <div className="input-field" style={{ flex: 1 }}>
                <label style={{ color: '#ddd', fontWeight: '500' }}>Groom：</label>
                <input
                  type="text"
                  value={groomName}
                  onChange={(e) => setGroomName(e.target.value)}
                  placeholder="Ex：James"
                  style={inputStyle}
                />
              </div>
            </div>

            <div className="input-group" style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
              <div className="input-field" style={{ flex: 1 }}>
                <label style={{ color: '#ddd', fontWeight: '500' }}>Wedding Date：</label>
                <input
                  type="date"
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  style={dateInputStyle}
                />
              </div>
              <div className="input-field" style={{ flex: 1 }}>
                <label style={{ color: '#ddd', fontWeight: '500' }}>Venue：</label>
                <input
                  type="text"
                  value={weddingLocation}
                  onChange={(e) => setWeddingLocation(e.target.value)}
                  placeholder="Ex：Villa 32, Beitou"
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button
                onClick={handleSaveWeddingInfo}
                disabled={saveButtonState !== 'ready'}
                style={{
                  ...saveButtonStyle,
                  backgroundColor: saveButtonState === 'saving' ? 'rgba(255, 255, 255, 0.2)' :
                    saveButtonState === 'saved' ? 'rgba(40, 167, 69, 0.2)' : 'transparent',
                }}
                onMouseOver={(e) => {
                  if (saveButtonState === 'ready') {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (saveButtonState === 'ready') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.transform = 'translateY(0)';
                  } else if (saveButtonState === 'saved') {
                    e.currentTarget.style.backgroundColor = 'rgba(40, 167, 69, 0.2)';
                  }
                }}
              >
                {saveButtonState === 'saving' && <div style={spinnerStyle}></div>}
                {saveButtonState === 'ready' && 'Save'}
                {saveButtonState === 'saving' && 'Saving...'}
                {saveButtonState === 'saved' && 'Saved successfully'}
              </button>

              <div style={{ marginTop: '20px' }}>
                <label
                  htmlFor="csv-upload"
                  style={csvButtonStyle}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span style={{ marginRight: '2px' }}></span> Upload CSV
                </label>
                <input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
          </div>

          {showGuestInfo && (
            <div className="form-section" style={{
              backgroundColor: 'transparent',
              padding: '25px',
              borderRadius: '10px',
              marginBottom: '30px'
            }}>
              <h3 style={{
                fontSize: '22px',
                marginBottom: '20px',
                color: '#ddd',
                paddingLeft: '12px'
              }}>Guest Information <span style={{ fontSize: '16px', color: '#ddd' }}></span></h3>

              <p style={{ fontSize: '14px', color: '#ddd', marginBottom: '20px' }}>Enter recipient details to personalize the invitation content.</p>

              <div className="input-group" style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
                <div className="input-field" style={{ flex: 1 }}>
                  <label style={{ color: '#ddd', fontWeight: '500' }}>Guest Name ：</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Ex：Emily"
                    style={inputStyle}
                  />
                </div>
                <div className="input-field" style={{ flex: 1 }}>
                  <label style={{ color: '#ddd', fontWeight: '500' }}>Guest Email ：</label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div className="input-field" style={{ marginBottom: '15px' }}>
                <label style={{ color: '#ddd', fontWeight: '500' }}>Relationship：</label>
                <input
                  type="text"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  placeholder="Ex：Relative、Coworker"
                  style={inputStyle}
                />
              </div>

              <div className="input-field">
                <label style={{ color: '#ddd', fontWeight: '500' }}>Description ：</label>
                <p style={{ fontSize: '13px', color: '#ddd', marginBottom: '8px' }}>Share a memory or special connection to personalize the invitation.</p>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex：Wejór shared many wonderful moments during our college years. I truly hope you can join us on this most important day."
                  style={{
                    ...inputStyle,
                    height: '120px',
                  }}
                />
              </div>

              <div className="form-actions" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <button
                  onClick={handleGenerate}
                  disabled={generateButtonState !== 'ready'}
                  style={{
                    ...generateButtonStyle,
                    backgroundColor: generateButtonState === 'generating' ? 'rgba(255, 255, 255, 0.2)' :
                      generateButtonState === 'generated' ? 'rgba(40, 167, 69, 0.2)' : 'transparent',
                  }}
                  onMouseOver={(e) => {
                    if (generateButtonState === 'ready') {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (generateButtonState === 'ready') {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.transform = 'translateY(0)';
                    } else if (generateButtonState === 'generated') {
                      e.currentTarget.style.backgroundColor = 'rgba(40, 167, 69, 0.2)';
                    }
                  }}
                >
                  {generateButtonState === 'generating' && <div style={spinnerStyle}></div>}
                  {generateButtonState === 'ready' && 'Personalize My Invitation '}
                  {generateButtonState === 'generating' && 'Generating...'}
                  {generateButtonState === 'generated' && 'Generated successfully'}
                </button>
              </div>
            </div>
          )}

          {invitationContent && (
            <>
              <div className="preview-container" style={{
                marginTop: '40px',
                padding: '30px',
                backgroundColor: 'transparent',
                borderRadius: '10px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e8e8e8'
              }}>
                <h3 style={{
                  fontSize: '22px',
                  marginBottom: '20px',
                  color: '#fff',
                  textAlign: 'center',
                  paddingBottom: '15px'
                }}>
                  預覽與編輯<br />
                </h3>

                <p style={{ fontSize: '14px', color: '#ddd', marginBottom: '20px', textAlign: 'center' }}>
                  您可以在下方編輯邀請函內容，請在寄送前仔細檢查。
                </p>

                <textarea
                  style={{
                    width: '100%',
                    height: '200px',
                    marginBottom: '20px',
                    padding: '15px',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    fontFamily: 'inherit',
                    fontSize: '15px',
                    lineHeight: '1.6'
                  }}
                  value={invitationContent}
                  onChange={(e) => setInvitationContent(e.target.value)}
                />

                <h4 style={{
                  fontSize: '18px',
                  margin: '25px 0 15px',
                  color: '#ddd',
                  fontWeight: '500'
                }}>
                  Gmail 預覽
                </h4>

                <div
                  style={{
                    marginTop: '10px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '25px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    lineHeight: '1.7',
                    backgroundColor: '#fff',
                    color: '#333',
                    fontSize: '15px'
                  }}
                  dangerouslySetInnerHTML={{
                    __html: invitationContent.includes('<div') 
                      ? invitationContent 
                      : convertTextToHtml(invitationContent, brideName, groomName, weddingDate, weddingLocation, guestName),
                  }}
                />
              </div>

              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={handleSend}
                  disabled={sendButtonState !== 'ready'}
                  style={{
                    ...sendButtonStyle,
                    backgroundColor: sendButtonState === 'sending' ? 'rgba(255, 255, 255, 0.2)' :
                      sendButtonState === 'sent' ? 'rgba(40, 167, 69, 0.2)' : 'transparent',
                  }}
                  onMouseOver={(e) => {
                    if (sendButtonState === 'ready') {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (sendButtonState === 'ready') {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.transform = 'translateY(0)';
                    } else if (sendButtonState === 'sent') {
                      e.currentTarget.style.backgroundColor = 'rgba(40, 167, 69, 0.2)';
                    }
                  }}
                >
                  {sendButtonState === 'sending' && <div style={spinnerStyle}></div>}
                  {sendButtonState === 'ready' && 'Send Invitation '}
                  {sendButtonState === 'sending' && 'Sending...'}
                  {sendButtonState === 'sent' && 'Sent successfully'}
                </button>
              </div>
            </>
          )}
        </div>

        <div className="history-sidebar" style={historySidebarStyle}>
          <h3 style={{
            fontSize: '22px',
            marginBottom: '20px',
            color: '#ddd',
            textAlign: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            paddingBottom: '15px'
          }}>
            Guest List <span style={{ fontSize: '16px', color: '#ddd' }}></span>
          </h3>

          <div className="search-container" style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Search guest name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={searchInputStyle}
            />
          </div>

          {guests.length > 0 ? (
            <div className="guest-list" style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '5px' }}>
              {guests.filter(guest =>
                guest['姓名']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                guest['Email']?.toLowerCase().includes(searchTerm.toLowerCase())
              ).length > 0 ? (
                guests.filter(guest =>
                  guest['姓名']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  guest['Email']?.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((guest, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      padding: '15px',
                      borderRadius: '8px',
                      marginBottom: '12px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      position: 'relative',
                      opacity: guest.sent ? 0.5 : 1,
                      cursor: guest.sent ? 'not-allowed' : 'pointer',
                    }}
                    onClick={() => !guest.sent && handleSelectGuest(guest)}
                  >
                    <h4 style={{ fontSize: '18px', color: '#fff', margin: '0 0 5px 0' }}>
                      {guest['姓名']}
                    </h4>
                    <p style={{ fontSize: '14px', color: '#ddd', margin: '5px 0' }}>
                      <span style={{ opacity: 0.7 }}>Email:</span> {guest['Email']}
                    </p>
                    <p style={{ fontSize: '14px', color: '#ddd', margin: '5px 0' }}>
                      <span style={{ opacity: 0.7 }}>Relationship:</span> {guest['關係']}
                    </p>
                    {guest.sent && (
                      <p style={{ fontSize: '12px', color: '#ddd', margin: '10px 0 0 0', opacity: '0.6' }}>
                        Invitation Sent
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: '#ddd', fontSize: '14px' }}>
                  No results found for "{searchTerm}"
                </p>
              )}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#ddd', fontSize: '14px' }}>
              No guest list uploaded yet.
            </p>
          )}

          <div style={{ textAlign: 'center', marginTop: '25px' }}>
            <p style={{ color: '#ddd', fontSize: '14px', marginBottom: '15px' }}>
              Total guests: {guests.length}
              {searchTerm && ` (Showing ${guests.filter(guest =>
                guest['姓名']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                guest['Email']?.toLowerCase().includes(searchTerm.toLowerCase())
              ).length} result${guests.filter(guest =>
                guest['姓名']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                guest['Email']?.toLowerCase().includes(searchTerm.toLowerCase())
              ).length !== 1 ? 's' : ''})`}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Form;
