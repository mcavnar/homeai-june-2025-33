
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
    description: 'Overview and key metrics',
  },
  {
    title: 'Issues List',
    url: '/results/issues',
    icon: AlertTriangle,
    description: 'Detailed findings',
  },
  {
    title: 'Key Systems',
    url: '/results/systems',
    icon: Settings,
    description: 'Major systems assessment',
  },
  {
    title: 'Service Providers',
    url: '/results/providers',
    icon: Users,
    description: 'Recommended contractors',
  },
  {
    title: 'Negotiation',
    url: '/results/negotiation',
    icon: Handshake,
    description: 'Strategy and talking points',
  },
  {
    title: 'Inspection Report',
    url: '/results/report',
    icon: ClipboardList,
    description: 'Original report text',
  },
];

const ResultsSidebar = () => {
  const { state } = useSidebar();

  return (
    <Sidebar className="border-r bg-white">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Report Sections
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
                      <div className={state === 'collapsed' ? 'hidden' : 'flex flex-col'}>
                        <span>{item.title}</span>
                        <span className="text-xs text-gray-500">{item.description}</span>
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
