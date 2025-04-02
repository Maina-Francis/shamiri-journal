import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Menu, LayoutDashboard, BookOpen, Sparkles, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const handleLogoClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  const navigationItems = [
    { label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4 mr-2" />, onClick: () => navigate('/dashboard') },
    { label: 'Journal', icon: <BookOpen className="h-4 w-4 mr-2" />, onClick: () => navigate('/journal') },
    { label: 'Insights', icon: <Sparkles className="h-4 w-4 mr-2" />, onClick: () => navigate('/insights') },
    { label: 'Settings', icon: <Settings className="h-4 w-4 mr-2" />, onClick: () => navigate('/settings') },
    { label: 'Log out', icon: <LogOut className="h-4 w-4 mr-2" />, onClick: () => logout() }
  ];
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div 
              onClick={handleLogoClick}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <span className="text-2xl font-semibold bg-gradient-to-r from-purple-500 to-blue-600 bg-clip-text text-transparent">Shamiri Journal</span>
            </div>
          </div>
          
          <div className="flex items-center">
            {isAuthenticated ? (
              <>
                {/* Mobile hamburger menu */}
                {isMobile && (
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="mr-2">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[250px] sm:w-[300px] p-0">
                      <div className="flex flex-col h-full">
                        <div className="p-4 border-b">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src="" alt={user?.name || 'User'} />
                              <AvatarFallback>
                                {user?.name ? user.name.substring(0, 2).toUpperCase() : 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user?.name || 'User'}</p>
                              <p className="text-sm text-muted-foreground">{user?.email}</p>
                            </div>
                          </div>
                        </div>
                        <nav className="flex-1 p-4">
                          <ul className="space-y-2">
                            {navigationItems.map((item, index) => (
                              <li key={index}>
                                <Button 
                                  variant="ghost" 
                                  className="w-full justify-start" 
                                  onClick={item.onClick}
                                >
                                  {item.icon}
                                  {item.label}
                                </Button>
                              </li>
                            ))}
                          </ul>
                        </nav>
                      </div>
                    </SheetContent>
                  </Sheet>
                )}
                
                {/* Desktop dropdown menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt={user?.name || 'User'} />
                        <AvatarFallback>
                          {user?.name ? user.name.substring(0, 2).toUpperCase() : 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/journal')}>
                      Journal
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/insights')}>
                      Insights
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => logout()}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
