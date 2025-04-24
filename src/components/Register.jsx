import React, { useState } from 'react'

function Register({ onSwitch }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!email || !password || !confirm) {
      alert('請填寫所有欄位')
      return
    }

    if (password !== confirm) {
      alert('兩次密碼不一致')
      return
    }

    const users = JSON.parse(localStorage.getItem('users') || '{}')

    if (users[email]) {
      alert('此帳號已存在')
      return
    }

    users[email] = password
    localStorage.setItem('users', JSON.stringify(users))

    alert('註冊成功，請登入')
    onSwitch()
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><br />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /><br />
        <input type="password" placeholder="Confirm Password" value={confirm} onChange={e => setConfirm(e.target.value)} /><br />
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
          Signup
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
        <span style={{ color: 'white', fontSize: '13px', marginTop: '24px' }}>Already have an account?</span>
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
          Login
        </button>
      </div>
    </div>
  )
}

export default Register
