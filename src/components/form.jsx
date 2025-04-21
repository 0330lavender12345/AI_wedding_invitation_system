import React, { useState, useEffect } from 'react';

// 將換行的純文字轉換為 HTML 段落
function convertTextToHtml(text) {
  return text
    .split('\n\n')
    .map((para) => `<p>${para.trim()}</p>`)
    .join('');
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

  useEffect(() => {
    const savedBrideName = localStorage.getItem('brideName');
    const savedGroomName = localStorage.getItem('groomName');
    const savedWeddingDate = localStorage.getItem('weddingDate');
    const savedWeddingLocation = localStorage.getItem('weddingLocation');

    if (savedBrideName) setBrideName(savedBrideName);
    if (savedGroomName) setGroomName(savedGroomName);
    if (savedWeddingDate) setWeddingDate(savedWeddingDate);
    if (savedWeddingLocation) setWeddingLocation(savedWeddingLocation);
  }, []);

  const handleGenerate = async () => {
    const formData = {
      brideName,
      groomName,
      weddingDate,
      weddingLocation,
      guestName,
      relationship,
      description,
    };

    try {
      const response = await fetch('https://leolee218039.app.n8n.cloud/webhook/se', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.text();
      setInvitationContent(data); // data 可以是 HTML 或純文字
    } catch (error) {
      alert('生成邀請函失敗');
      console.error(error);
    }
  };

  const handleSend = async () => {
    const formData = {
      brideName,
      groomName,
      weddingDate,
      weddingLocation,
      guestName,
      guestEmail,
      relationship,
      description,
      invitationContent,
    };
  
    try {
      const response = await fetch('https://leolee218039.app.n8n.cloud/webhook/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        alert('邀請函已寄出！');
        setGuestName('');
        setGuestEmail('');
        setRelationship('');
        setDescription('');
        setInvitationContent('');
      } else {
        alert('寄送失敗');
      }
    } catch (error) {
      alert('發生錯誤');
      console.error(error);
    }
  };
  

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
      <h2>婚禮喜帖邀請函</h2>

      <div>
        <label>新娘姓名：</label>
        <input type="text" value={brideName} onChange={(e) => setBrideName(e.target.value)} />

        <label>新郎姓名：</label>
        <input type="text" value={groomName} onChange={(e) => setGroomName(e.target.value)} />

        <label>婚禮日期：</label>
        <input type="date" value={weddingDate} onChange={(e) => setWeddingDate(e.target.value)} />

        <label>婚禮地點：</label>
        <input type="text" value={weddingLocation} onChange={(e) => setWeddingLocation(e.target.value)} />
      </div>

      <div style={{ marginTop: '20px' }}>
        <label>來賓姓名：</label>
        <input type="text" value={guestName} onChange={(e) => setGuestName(e.target.value)} />

        <label>來賓 Email：</label>
        <input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} />

        <label>與來賓的關係：</label>
        <input type="text" value={relationship} onChange={(e) => setRelationship(e.target.value)} />

        <label>新人對來賓的描述：</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <button onClick={handleGenerate} style={{ marginTop: '20px' }}>生成邀請函</button>

      {invitationContent && (
        <div style={{ marginTop: '40px' }}>
          <h3>邀請函預覽（可編輯）</h3>

          <textarea
            style={{ width: '100%', height: '200px' }}
            value={invitationContent}
            onChange={(e) => setInvitationContent(e.target.value)}
          />

          <h4 style={{ marginTop: '30px' }}>📨 Gmail 預覽樣式</h4>
          <div
            style={{
              marginTop: '10px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              lineHeight: '1.6',
            }}
            dangerouslySetInnerHTML={{
              __html: invitationContent.includes('<p>')
                ? invitationContent
                : convertTextToHtml(invitationContent),
            }}
          />

          <button onClick={handleSend} style={{ marginTop: '20px' }}>送出邀請函</button>
        </div>
      )}
    </div>
  );
}

export default Form;
