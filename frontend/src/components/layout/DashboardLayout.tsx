import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  BookOpenText, 
  LineChart, 
  Settings, 
  LogOut,
  LayoutDashboard,
  Home,
  PieChart,
  BarChart3,
  NotebookPen,
  Lightbulb,
  Cog
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarProvider
} from '@/components/ui/sidebar';
import Header from './Header';

const DashboardLayout = () => {
  const { logout } = useAuth()!;
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };
  
  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };
  
  const sidebarItems = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5 text-primary" />,
      href: '/dashboard',
    },
    {
      title: 'Journal',
      icon: <NotebookPen className="h-5 w-5 text-pink-500" />,
      href: '/journal',
    },
    {
      title: 'Insights',
      icon: <LineChart className="h-5 w-5 text-indigo-500" />,
      href: '/insights',
    },
    {
      title: 'Settings',
      icon: <Cog className="h-5 w-5 text-gray-500" />,
      href: '/settings',
    },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="hidden md:flex w-64 border-r">
          <SidebarContent>
            <div className="px-3 py-4">
              <div className="flex items-center mb-6">
                <Home className="h-6 w-6 text-accent mr-2" />
                <h1 className="text-lg font-bold">Shamiri Journal</h1>
              </div>
              <SidebarMenu>
                {sidebarItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      icon={item.icon}
                      onClick={() => navigate(item.href)}
                      isActive={isActiveRoute(item.href)}
                      className={isActiveRoute(item.href) 
                        ? "bg-accent/10 text-accent font-medium" 
                        : "hover:bg-muted/50 transition-colors duration-200"}
                    >
                      {item.title}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    icon={<LogOut className="h-5 w-5 text-red-500" />}
                    onClick={handleLogout}
                    className="hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                  >
                    Logout
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-auto pt-16">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
