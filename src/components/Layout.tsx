import React, { useState } from 'react';
import { Layout as AntLayout, Menu, Avatar, Dropdown } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, Users, Building2, FileText, Euro, 
  LayoutDashboard, LogOut, Settings, UserCog, Calculator
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const { Header, Sider, Content } = AntLayout;

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems = [
    {
      key: '/app',
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: 'Tableau de bord',
    },
    {
      key: '/app/properties',
      icon: <Building2 className="w-5 h-5" />,
      label: 'Biens',
    },
    {
      key: '/app/tenants',
      icon: <Users className="w-5 h-5" />,
      label: 'Locataires',
    },
    {
      key: '/app/owners',
      icon: <Home className="w-5 h-5" />,
      label: 'Propriétaires',
    },
    {
      key: '/app/leases',
      icon: <FileText className="w-5 h-5" />,
      label: 'Baux',
    },
    {
      key: '/app/rents',
      icon: <Euro className="w-5 h-5" />,
      label: 'Loyers',
    },
    {
      key: '/app/accounting',
      icon: <Calculator className="w-5 h-5" />,
      label: 'Comptabilité',
    },
    {
      key: '/app/users',
      icon: <UserCog className="w-5 h-5" />,
      label: 'Utilisateurs',
    },
  ];

  const userMenu = [
    {
      key: 'profile',
      icon: <Settings className="w-4 h-4" />,
      label: 'Paramètres',
      onClick: () => navigate('/app/profile'),
    },
    {
      key: 'logout',
      icon: <LogOut className="w-4 h-4" />,
      label: 'Déconnexion',
      danger: true,
      onClick: logout,
    },
  ];

  return (
    <AntLayout className="min-h-screen">
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        className="bg-white border-r border-gray-200"
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          <h1 className={`text-blue-900 font-bold transition-all duration-200 ${collapsed ? 'text-xl' : 'text-2xl'}`}>
            {collapsed ? 'BS' : 'BabSouss.immo'}
          </h1>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          className="border-none"
        />
      </Sider>
      <AntLayout>
        <Header className="bg-white px-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            {menuItems.find(item => item.key === location.pathname)?.label || 'Paramètres'}
          </h2>
          <Dropdown menu={{ items: userMenu }} placement="bottomRight">
            <div className="flex items-center gap-3 cursor-pointer">
              <Avatar className="bg-blue-900">{user?.firstName?.[0]}</Avatar>
              <span className="text-gray-700">{user?.firstName} {user?.lastName}</span>
            </div>
          </Dropdown>
        </Header>
        <Content className="p-6 bg-gray-50">
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;