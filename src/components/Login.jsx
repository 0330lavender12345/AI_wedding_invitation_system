import React, { useState } from 'react'

function Login({ onSwitch, onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!email || !password) {
      alert('請填寫所有欄位')
      return
    }

    const users = JSON.parse(localStorage.getItem('users') || '{}')

    if (!users[email]) {
      alert('帳號不存在，請先註冊')
      return
    }

    if (users[email] !== password) {
      alert('密碼錯誤')
      return
    }

    // 移除 alert，直接調用登入成功函數
    onLoginSuccess(email)  // 通知 App.jsx 進入登入狀態
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><br />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /><br />
        <button
          type="submit"
          style={{
            background: 'transparent',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            marginTop: '12px'
          }}
        >
          Login
        </button>
      </form>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '14px',
          flexWrap: 'nowrap',
          gap: '6px',
          whiteSpace: 'nowrap'
        }}
      >
        <span style={{ color: 'white', fontSize: '13px', marginTop: '24px' }}>Don't have an account?</span>
        <button
          onClick={onSwitch}
          style={{
            background: 'transparent',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Signup
        </button>
      </div>



    </div>
  )
}


export default Login
