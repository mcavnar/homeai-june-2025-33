
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  FileText,
  AlertTriangle,
  Settings,
  Users,
  Handshake,
  ClipboardList,
} from 'lucide-react';

const navigationItems = [
  {
    title: 'Dashboard',
    url: '/demo-results/synopsis',
    icon: FileText,
  },
  {
    title: 'Issues List',
    url: '/demo-results/issues',
    icon: AlertTriangle,
  },
  {
    title: 'Key Systems',
    url: '/demo-results/systems',
    icon: Settings,
  },
  {
    title: 'Service Providers',
    url: '/demo-results/providers',
    icon: Users,
  },
  {
    title: 'Negotiation',
    url: '/demo-results/negotiation',
    icon: Handshake,
  },
  {
    title: 'Inspection Report',
    url: '/anonymous-upload',
    icon: ClipboardList,
  },
];

const DemoResultsSidebar = () => {
  const { state } = useSidebar();
  const navigate = useNavigate();

  const handleUploadReport = () => {
    navigate('/anonymous-upload');
  };

  return (
    <Sidebar className="border-r bg-white">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl font-bold text-gray-900 px-3 py-4 mb-2">
            HomeAi Demo
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <div className={state === 'collapsed' ? 'hidden' : 'block'}>
                        <span>{item.title}</span>
                      </div>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Demo CTA Section */}
        <div className="mt-auto p-3 border-t">
          <div className={`${state === 'collapsed' ? 'text-center' : 'space-y-3'}`}>
            <p className={`text-xs text-gray-500 ${state === 'collapsed' ? 'hidden' : 'block'}`}>
              This is a demo. Upload your real report to get started.
            </p>
            <Button
              onClick={handleUploadReport}
              variant="green"
              size={state === 'collapsed' ? 'sm' : 'default'}
              className={`${state === 'collapsed' ? 'w-8 h-8 p-0' : 'w-full'}`}
            >
              {state === 'collapsed' ? '↑' : 'Upload Your Report'}
            </Button>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default DemoResultsSidebar;
