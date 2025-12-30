import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
}

export const Header = ({ title, showBack = false, rightElement }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border safe-area-inset-top">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left */}
        <div className="w-10">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
          )}
        </div>

        {/* Center */}
        {title && (
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        )}

        {/* Right */}
        <div className="w-10 flex justify-end">
          {rightElement}
        </div>
      </div>
    </header>
  );
};

export default Header;
