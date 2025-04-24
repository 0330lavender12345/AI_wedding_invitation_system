// src/components/Slideshow.jsx
import Form from './Form';
import LoginModal from './LoginModal'; // 使用現有的 LoginModal
import React, { useRef, useState, useEffect } from 'react';
import wedding01 from '../assets/images/wedding01.jpg';
import wedding02 from '../assets/images/wedding02.jpg';
import wedding03 from '../assets/images/wedding03.jpg';
import wedding04 from '../assets/images/wedding04.jpg';
import wedding05 from '../assets/images/wedding05.jpg';
import wedding06 from '../assets/images/wedding06.jpg';
import wedding07 from '../assets/images/wedding07.jpg';
import wedding08 from '../assets/images/wedding08.jpg';
import wedding09 from '../assets/images/wedding09.jpg';
import wedding10 from '../assets/images/wedding10.jpg';
import wedding11 from '../assets/images/wedding11.jpg';
import wedding12 from '../assets/images/wedding12.jpg';
import wedding13 from '../assets/images/wedding13.jpg';
import wedding14 from '../assets/images/wedding14.jpg';


function useRevealAnimation() {
    useEffect(() => {
        const sections = document.querySelectorAll('.section');

        // 設定每個區塊進場的方向
        sections.forEach((section, index) => {
            section.classList.add(index % 2 === 0 ? 'from-left' : 'from-right');
        });

        // 觸發動畫的函數，可被重複使用
        function triggerAnimation(element) {
            // 移除 show 類別，強制重新渲染，然後再加回來
            element.classList.remove('show');
            void element.offsetWidth; // 強制重新渲染
            element.classList.add('show');
        }

        // 創建一個記錄元素是否已經顯示過的 Map
        const hasBeenVisible = new Map();
        sections.forEach(section => hasBeenVisible.set(section, false));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // 當元素進入視窗
                if (entry.isIntersecting) {
                    triggerAnimation(entry.target);
                } else {
                    // 當元素離開視窗，重設顯示狀態，為下次進入做準備
                    entry.target.classList.remove('show');
                }
            });
        }, { threshold: 0.2 });

        sections.forEach(section => observer.observe(section));

        // 添加點擊導航按鈕的事件處理器
        const aboutUsButton = document.querySelector('.about-us-button');
        const howToButton = document.querySelector('.how-to-button');
        const featuresButton = document.querySelector('.features-button');

        aboutUsButton?.addEventListener('click', () => {
            const aboutSection = document.getElementById('about-us');
            triggerAnimation(aboutSection);
        });

        howToButton?.addEventListener('click', () => {
            const howToSection = document.getElementById('how-to');
            triggerAnimation(howToSection);
        });

        featuresButton?.addEventListener('click', () => {
            const featuresSection = document.getElementById('features');
            triggerAnimation(featuresSection);
        });

        // 清理函數
        return () => {
            observer.disconnect();
            aboutUsButton?.removeEventListener('click', triggerAnimation);
            howToButton?.removeEventListener('click', triggerAnimation);
            featuresButton?.removeEventListener('click', triggerAnimation);
        };
    }, []);
}

function Slideshow({ currentUser, onLoginSuccess, showOverlay: initialShowOverlay, onScroll }) {
    useRevealAnimation();
    const scrollTargetRef = useRef(null);
    const [showOverlay, setShowOverlay] = useState(initialShowOverlay);
    const [isSticky, setIsSticky] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const formRef = useRef(null);

    const handleScroll = () => {
        setShowOverlay(false);
        if (onScroll) onScroll();
        scrollTargetRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleShowForm = () => {
        setShowForm(true);
        // Scroll to form after a short delay to allow render
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    // 處理登入成功的回調
    const handleLoginSuccess = (email) => {
        if (onLoginSuccess) {
            onLoginSuccess(email);
        }
        setShowLoginModal(false);
    };

    // 處理登出
    const handleLogout = () => {
        setCurrentUser(null);
    };

    useEffect(() => {
        const checkScroll = () => {
            const scrollPosition = window.scrollY;
            const activationPoint = window.innerHeight * 0.8;

            if (scrollPosition > activationPoint) {
                setIsSticky(true);
            } else if (scrollPosition < 20) {
                setIsSticky(false);
            }
        };

        window.addEventListener('scroll', checkScroll);
        return () => window.removeEventListener('scroll', checkScroll);
    }, []);

    const images = [wedding01, wedding02, wedding03, wedding04, wedding05, wedding06, wedding07, wedding08, wedding09, wedding10, wedding11];
    const doubledImages = [...images, ...images];

    return (
        <>
            <div className={`slideshow-fullscreen ${isSticky ? 'sticky-mode' : ''}`}>
                <div className={`slideshow-marquee ${isSticky ? 'sticky-marquee' : ''}`}>
                    <div className="marquee-track">
                        {doubledImages.map((img, index) => (
                            <div className="slide" key={index}>
                                <img src={img} alt={`slide-${index}`} />
                            </div>
                        ))}
                    </div>
                </div>

                {showOverlay && (
                    <div className="overlay">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <button className="start-button" onClick={handleScroll}>
                                Start Creating My Wedding Invitation
                            </button>

                            {!currentUser && (
                                <button
                                    className="login-button"
                                    onClick={() => setShowLoginModal(true)}
                                    style={{
                                        marginTop: '40px',
                                        backgroundColor: 'transparent',
                                        color: 'white',
                                        border: 'none',
                                        fontSize: '16px',
                                        cursor: 'pointer',
                                        transition: 'color 0.3s ease',
                                        fontFamily: 'Tinos, serif',
                                        fontWeight: 400,
                                        padding: 0
                                    }}
                                    onMouseOver={(e) => e.target.style.color = '#ccc'}
                                    onMouseOut={(e) => e.target.style.color = 'white'}
                                >
                                    Login / Signup
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* 顯示登入模態窗 */}
                {showLoginModal && (
                    <LoginModal
                        onClose={() => setShowLoginModal(false)}
                        onLoginSuccess={handleLoginSuccess}
                    />
                )}

                <div className="nav-buttons-container">
                    <button className="nav-button about-us-button" onClick={() => {
                        document.getElementById('about-us')?.scrollIntoView({ behavior: 'smooth' });
                    }}>
                        <span>About Us</span>
                    </button>
                    <button className="nav-button how-to-button" onClick={() => {
                        document.getElementById('how-to')?.scrollIntoView({ behavior: 'smooth' });
                    }}>
                        <span>How to Use</span>
                    </button>

                    <button className="nav-button features-button" onClick={() => {
                        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                    }}>
                        <span>Features</span>
                    </button>
                </div>
            </div>

            <div className="slideshow-placeholder" style={{
                height: isSticky ? '100vh' : '0',
                transition: 'height 0.01s'
            }}></div>

            <div ref={scrollTargetRef} className="after-slide-content">
                <div id="about-us" className="section">
                    <div className="text">
                        <h2>About Us</h2>
                        <p>Lumière Weddings is a wedding consulting company dedicated to the art of wedding experiences. We weave together technology and emotion to create bespoke digital invitations for every couple. Each message becomes an extension of cherished memories; each story is delicately crafted with love. With us, a wedding invitation is more than just an announcement—it is a heartfelt expression of connection and meaning.</p>
                    </div>
                    <img src={wedding12} alt="About us" />
                </div>

                <div id="how-to" className="section reverse">
                    <div className="text">
                        <h2>How to Use</h2>
                        <p>Simply begin by entering your wedding details, then upload a CSV file of your guest list—including each guest's name, email address, and a personalized memory. Our system will automatically generate a unique Gmail invitation for each guest. You can preview and edit each message before sending, ensuring every word feels just right. A convenient status panel on the right allows you to track which invitations have been completed, helping you stay organized and stress-free.</p>
                    </div>
                    <img src={wedding13} alt="How to use" />
                </div>

                <div id="features" className="section">
                    <div className="text">
                        <h2>Features</h2>
                        <p>Designed with elegance and emotion in mind, our service transforms a digital task into a meaningful experience. Every invitation is thoughtfully crafted to reflect your personal connection with each guest. Through seamless automation, we eliminate tedious manual steps while preserving warmth and individuality. No technical skills are required, and every message is delivered securely and on time—so you can devote your full attention to celebrating love and creating lasting memories.</p>
                    </div>
                    <img src={wedding14} alt="Features" />
                </div>

                <div className="start-generating-container">
                    <button className="generate-button" onClick={handleShowForm}>
                        START GENERATING
                    </button>
                </div>

                {showForm && (
                    <div ref={formRef} className="form-container">
                        <Form />
                    </div>
                )}
            </div>
        </>
    );
}

export default Slideshow;