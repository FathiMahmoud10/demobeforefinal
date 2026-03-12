import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Moon, Sun, Globe, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import Logo from '@/components/Logo';

export default function Login() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { t, direction, language, setLanguage } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  const isDark = theme === 'dark';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would validate credentials here
    navigate('/dashboard');
  };

  const setThemeMode = (mode: 'light' | 'dark') => {
    if (theme !== mode) {
      toggleTheme();
    }
    setIsThemeMenuOpen(false);
  };

  return (
    <div 
      className={`min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-500 ${
        isDark ? 'bg-gradient-to-b from-[#0a1930] to-[#050c18]' : 'bg-[#f1f5f9]'
      }`}
      dir={direction}
    >
      {/* Theme & Language Toggles */}
      <div className={`absolute top-4 ${direction === 'rtl' ? 'left-4' : 'right-4'} flex gap-2 z-50`}>
        <div className="relative">
          <button 
            onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
            className={`p-2 rounded-full transition-colors backdrop-blur-sm shadow-sm border ${
              isDark 
                ? 'bg-white/10 text-white hover:bg-white/20 border-white/20' 
                : 'bg-white text-gray-800 hover:bg-gray-100 border-gray-200'
            }`}
          >
            {isDark ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <AnimatePresence>
            {isThemeMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`absolute mt-2 w-40 rounded-lg shadow-lg border py-2 z-50 ${
                    direction === 'rtl' ? 'left-0' : 'right-0'
                } ${
                    isDark 
                      ? 'bg-[#1e293b] border-gray-700 text-white' 
                      : 'bg-white border-gray-200 text-gray-800'
                }`}
              >
                <button 
                  onClick={() => setThemeMode('light')}
                  className={`w-full px-4 py-2 text-sm hover:bg-opacity-10 hover:bg-gray-500 flex items-center justify-between ${!isDark ? 'text-[#10b981] font-bold' : ''}`}
                >
                  <span className="flex items-center gap-2">
                    <Sun size={16} />
                    <span>{t('light_mode')}</span>
                  </span>
                  {!isDark && <Check size={16} />}
                </button>
                <button 
                  onClick={() => setThemeMode('dark')}
                  className={`w-full px-4 py-2 text-sm hover:bg-opacity-10 hover:bg-gray-500 flex items-center justify-between ${isDark ? 'text-[#10b981] font-bold' : ''}`}
                >
                  <span className="flex items-center gap-2">
                    <Moon size={16} />
                    <span>{t('dark_mode')}</span>
                  </span>
                  {isDark && <Check size={16} />}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <button 
            onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
            className={`p-2 rounded-full transition-colors backdrop-blur-sm shadow-sm border ${
              isDark 
                ? 'bg-white/10 text-white hover:bg-white/20 border-white/20' 
                : 'bg-white text-gray-800 hover:bg-gray-100 border-gray-200'
            }`}
          >
            <Globe size={20} />
          </button>

          <AnimatePresence>
            {isLanguageMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`absolute mt-2 w-40 rounded-lg shadow-lg border py-2 z-50 ${
                    direction === 'rtl' ? 'left-0' : 'right-0'
                } ${
                    isDark 
                      ? 'bg-[#1e293b] border-gray-700 text-white' 
                      : 'bg-white border-gray-200 text-gray-800'
                }`}
              >
                <button 
                  onClick={() => { setLanguage('ar'); setIsLanguageMenuOpen(false); }}
                  className={`w-full px-4 py-2 text-sm hover:bg-opacity-10 hover:bg-gray-500 flex items-center justify-between ${language === 'ar' ? 'text-[#10b981] font-bold' : ''}`}
                >
                  <span className="flex items-center gap-2">
                    <span>العربية</span>
                  </span>
                  {language === 'ar' && <Check size={16} />}
                </button>
                <button 
                  onClick={() => { setLanguage('en'); setIsLanguageMenuOpen(false); }}
                  className={`w-full px-4 py-2 text-sm hover:bg-opacity-10 hover:bg-gray-500 flex items-center justify-between ${language === 'en' ? 'text-[#10b981] font-bold' : ''}`}
                >
                  <span className="flex items-center gap-2">
                    <span>English</span>
                  </span>
                  {language === 'en' && <Check size={16} />}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Header Outside Card */}
      <div className="flex flex-col items-center mb-6 z-10">
        <div className="mb-2 transform scale-125 transition-all duration-300">
           <Logo /> 
        </div>
        <h1 className={`text-3xl font-bold mt-4 transition-colors duration-300 ${isDark ? 'text-white' : 'text-[#0a1a44]'}`}>
          {t('login')}
        </h1>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden relative p-8 z-10 transition-colors duration-300 ${
          isDark ? 'bg-[#e2e8f0]' : 'bg-white'
        }`}
      >
        <h2 className={`text-lg font-bold mb-6 text-[#0a1a44] ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>{t('welcome_login_message')}</h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <div className={`absolute top-0 h-full w-12 flex items-center justify-center text-gray-500 ${direction === 'rtl' ? 'right-0' : 'left-0'}`}>
              <User size={20} />
            </div>
            <input 
              type="text" 
              placeholder={t('email')}
              className={`w-full h-12 border-none rounded-xl outline-none focus:ring-2 focus:ring-[#10b981]/20 transition-all placeholder-gray-500 text-[#0a1a44] ${
                isDark ? 'bg-[#cbd5e1]' : 'bg-[#f8fafc] border border-gray-100'
              } ${direction === 'rtl' ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4 text-left'}`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <div className={`absolute top-0 h-full w-12 flex items-center justify-center text-gray-500 ${direction === 'rtl' ? 'right-0' : 'left-0'}`}>
              <Lock size={20} />
            </div>
            <input 
              type="password" 
              placeholder={t('password')}
              className={`w-full h-12 border-none rounded-xl outline-none focus:ring-2 focus:ring-[#10b981]/20 transition-all placeholder-gray-500 text-[#0a1a44] ${
                isDark ? 'bg-[#cbd5e1]' : 'bg-[#f8fafc] border border-gray-100'
              } ${direction === 'rtl' ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4 text-left'}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-gray-400 focus:ring-[#10b981] accent-[#10b981]" 
              />
              <span className="font-medium text-[#0a1a44]">{t('remember_me')}</span>
            </label>
            
            <button 
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="font-bold hover:underline text-[#0a1a44]"
            >
              {t('forgot_password')}
            </button>
          </div>

          <button 
            type="submit"
            className="w-full h-12 text-white text-lg font-bold rounded-xl shadow-md hover:opacity-90 transition-all bg-[#10b981]"
          >
            {t('login_button')}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-300 pt-4">
          <p className="text-xs font-medium text-gray-600">
            {t('login_footer_text')}
          </p>
        </div>
      </motion.div>

      {/* Footer Outside Card */}
      <div className="mt-8 text-center z-10">
        <p className={`text-xs dir-ltr transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {t('copyright_text')}
        </p>
      </div>
    </div>
  );
}