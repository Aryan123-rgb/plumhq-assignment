import { Moon, Sun, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

interface NavbarProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onGoHome?: () => void;
}

const Navbar = ({ theme, onToggleTheme, onGoHome }: NavbarProps) => {
  const handleLogoClick = (e: React.MouseEvent) => {
    if (onGoHome) {
      e.preventDefault();
      onGoHome();
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b-2 border-border bg-card/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
        {/* Left side - App Name */}
        <Link 
          to="/" 
          onClick={handleLogoClick}
          className="font-retro text-lg tracking-wide retro-text-gradient sm:text-xl hover:opacity-80 transition-opacity cursor-pointer"
        >
          Quizify
        </Link>

        {/* Right side - Profile & Theme Toggle */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={onToggleTheme}
            className="h-9 w-9 border-2 transition-all hover:border-primary hover:bg-primary/10"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-retro-yellow" />
            ) : (
              <Moon className="h-4 w-4 text-retro-purple" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          <Avatar className="h-9 w-9 border-2 border-primary/30 transition-all hover:border-primary hover:scale-105">
            <AvatarFallback className="bg-muted text-muted-foreground">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
