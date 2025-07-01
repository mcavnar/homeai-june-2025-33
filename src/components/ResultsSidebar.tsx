
import React from 'react';
import { NavLink } from 'react-router-dom';
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
    title: 'Synopsis',
    url: '/results/synopsis',
    icon: FileText,
  },
  {
    title: 'Issues List',
    url: '/results/issues',
    icon: AlertTriangle,
  },
  {
    title: 'Key Systems',
    url: '/results/systems',
    icon: Settings,
  },
  {
    title: 'Service Providers',
    url: '/results/providers',
    icon: Users,
  },
  {
    title: 'Negotiation',
    url: '/results/negotiation',
    icon: Handshake,
  },
  {
    title: 'Inspection Report',
    url: '/results/report',
    icon: ClipboardList,
  },
];

const ResultsSidebar = () => {
  const { state } = useSidebar();

  return (
    <Sidebar className="border-r bg-white">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl font-bold text-gray-900 px-3 py-4 mb-2">
            HomeAi
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
      </SidebarContent>
    </Sidebar>
  );
};

export default ResultsSidebar;
