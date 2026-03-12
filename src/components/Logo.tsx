import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

export default function Logo({ className = "", showText = true }: { className?: string; showText?: boolean }) {
  const { direction } = useLanguage();
  const { theme } = useTheme();

  // choose correct file based on language direction and theme
  const lang = direction === 'rtl' ? 'ar' : 'en';
  const shade = theme === 'dark' ? 'dark' : 'light';
  const logoSrc = `/logo_${lang}_${shade}.png`;

  return (
    <div className={`flex items-center ${className}` + (showText ? '' : ' justify-center')}>
      <img src={logoSrc} alt="Takamul Al-Bayanat Logo" className="h-10" />
      {/* optionally show text next to logo if requested (currently unused but available) */}
    </div>
  );
}
