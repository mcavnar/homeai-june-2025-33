
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  FileText,
  AlertTriangle,
  Settings,
  Users,
  Handshake,
  ClipboardList,
  LogOut,
  User,
} from 'lucide-react';

const navigationItems = [
  {
    title: 'Dashboard',
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
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleAccountClick = () => {
    navigate('/account');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || 'User';
  const initials = getInitials(displayName);

  return (
    <Sidebar className="border-r bg-white">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl font-bold text-gray-900 px-3 py-4 mb-2">
            HomeAI
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

        {/* User Account Section */}
        <div className="mt-auto p-3 border-t">
          <div className={`${state === 'collapsed' ? 'flex flex-col items-center' : 'space-y-3'}`}>
            {/* User Info */}
            <div className={`flex items-center gap-3 ${state === 'collapsed' ? 'justify-center mb-2' : ''}`}>
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {state !== 'collapsed' && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {displayName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
              )}
            </div>

            {/* Account Actions */}
            <div className={`flex gap-1 ${state === 'collapsed' ? 'flex-col' : 'flex-row w-full'}`}>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAccountClick}
                className={`${state === 'collapsed' ? 'p-2' : 'flex-1'} text-gray-600 hover:text-gray-900`}
              >
                <User className="h-4 w-4" />
                {state !== 'collapsed' && <span className="ml-1">Account</span>}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className={`${state === 'collapsed' ? 'p-2' : 'flex-1'} text-gray-600 hover:text-gray-900`}
              >
                <LogOut className="h-4 w-4" />
                {state !== 'collapsed' && <span className="ml-1">Sign Out</span>}
              </Button>
            </div>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default ResultsSidebar;
