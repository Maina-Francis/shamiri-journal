
import React from 'react';
import { Outlet } from 'react-router-dom';
import { 
  PenLine, 
  BarChart2, 
  Settings, 
  LogOut,
  Home
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully'
    });
    navigate('/');
  };

  const menuItems = [
    { 
      title: "Home", 
      url: "/", 
      icon: <Home className="h-4 w-4" /> 
    },
    { 
      title: "Journal", 
      url: "/journal", 
      icon: <PenLine className="h-4 w-4" /> 
    },
    { 
      title: "Insights", 
      url: "/insights", 
      icon: <BarChart2 className="h-4 w-4" /> 
    },
    { 
      title: "Settings", 
      url: "/settings", 
      icon: <Settings className="h-4 w-4" /> 
    }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader className="flex flex-col items-center justify-center py-4">
            <div className="flex items-center justify-center">
              <span className="text-lg font-semibold bg-gradient-to-r from-accent to-blue-700 bg-clip-text text-transparent">
                Shamiri Journal
              </span>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={window.location.pathname === item.url}
                        tooltip={item.title}
                      >
                        <a href={item.url} className="flex items-center gap-2">
                          {item.icon}
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className="p-4 border-t">
            {user && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={user.name} />
                    <AvatarFallback>
                      {user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate w-32">{user.email}</p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="h-8 w-8"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-1 p-6 pt-6">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
