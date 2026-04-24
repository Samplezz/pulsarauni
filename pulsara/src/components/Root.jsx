'use client';
import { useState, useEffect } from 'react';
import { getUser } from '@/lib/storage';
import SignupModal from '@/components/SignupModal';
import LandingPage from '@/components/LandingPage';
import AppShell from '@/components/AppShell';
import AdminPanel from '@/components/AdminPanel';
import { LanguageProvider } from '@/lib/i18n';

export default function Root() {
  const [mounted, setMounted] = useState(false);
  const [screen, setScreen] = useState('landing');
  const [showSignup, setShowSignup] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    setMounted(true);
    setScreen(localStorage.getItem('pulsara_screen_v2') || 'landing');
    setCurrentUser(getUser());
    
    function checkHash() {
      const hash = window.location.hash;
      setShowAdmin(hash === '#/adminpannelX');
    }
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  function enterApp() {
    const u = getUser();
    if (u) {
      setCurrentUser(u);
      setScreen('app');
      localStorage.setItem('pulsara_screen_v2', 'app');
    } else {
      setShowSignup(true);
    }
  }

  function handleSignupComplete(u) {
    setCurrentUser(u);
    setShowSignup(false);
    setScreen('app');
    localStorage.setItem('pulsara_screen_v2', 'app');
  }

  function doLogout() {
    setCurrentUser(null);
    setScreen('landing');
    localStorage.setItem('pulsara_screen_v2', 'landing');
  }

  if (!mounted) return null;

  // Admin panel accessed via #/adminpannelX — renders as full page
  if (showAdmin) {
    return <AdminPanel onClose={() => { window.location.hash = ''; }} />;
  }

  return (
    <LanguageProvider>
      {showSignup && <SignupModal onComplete={handleSignupComplete} />}
      {screen === 'landing' && <LandingPage onEnterApp={enterApp} onSignup={() => setShowSignup(true)} />}
      {screen === 'app' && currentUser && <AppShell myUser={currentUser.username} onLogout={doLogout} />}
      {screen === 'app' && !currentUser && <SignupModal onComplete={handleSignupComplete} />}
    </LanguageProvider>
  );
}
