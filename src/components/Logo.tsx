import { useLanguage } from '@/context/LanguageContext';
import { useLogo } from '@/context/LogoContext';

export default function Logo({ className = "" }: { className?: string }) {
  const { direction } = useLanguage();
  const { logo } = useLogo();

  const defaultLogo = direction === 'rtl' ? '/logo_ar.png' : '/logo_en.png';
  const logoSrc = logo || defaultLogo;

  return (
    <div className={`flex items-center ${className}`}>
      <img src={logoSrc} alt="Logo" className="h-10 w-auto object-contain" />
    </div>
  );
}
