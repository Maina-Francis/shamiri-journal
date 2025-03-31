
import { Outlet, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  BarChart2, 
  Settings, 
  LogOut
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Sidebar, SidebarContent, SidebarItem } from '@/components/ui/sidebar';
import Header from './Header';

const DashboardLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };
  
  const sidebarItems = [
    {
      title: 'Journal',
      icon: <BookOpen className="h-5 w-5" />,
      href: '/journal',
    },
    {
      title: 'Insights',
      icon: <BarChart2 className="h-5 w-5" />,
      href: '/insights',
    },
    {
      title: 'Settings',
      icon: <Settings className="h-5 w-5" />,
      href: '/settings',
    },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar className="hidden md:flex w-64 border-r">
        <SidebarContent>
          {sidebarItems.map((item) => (
            <SidebarItem 
              key={item.title}
              icon={item.icon}
              title={item.title}
              onClick={() => navigate(item.href)}
            />
          ))}
          <SidebarItem 
            icon={<LogOut className="h-5 w-5" />}
            title="Logout"
            onClick={handleLogout}
          />
        </SidebarContent>
      </Sidebar>
      
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto pt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
