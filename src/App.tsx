import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ConfigProvider, App as AntApp } from 'antd';
import frFR from 'antd/locale/fr_FR';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import Tenants from './pages/Tenants';
import TenantDetail from './pages/TenantDetail';
import Owners from './pages/Owners';
import OwnerDetail from './pages/OwnerDetail';
import Leases from './pages/Leases';
import Rents from './pages/Rents';
import Users from './pages/Users';
import Accounting from './pages/Accounting';
import Profile from './pages/Profile';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { serializeData } from './utils/queryUtils';

// Create a client with proper data serialization
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 30000,
      cacheTime: 3600000,
      select: (data: any) => serializeData(data),
      onError: (error: any) => {
        console.error('Query error:', error);
      }
    },
    mutations: {
      onMutate: (variables: any) => serializeData(variables),
      onError: (error: any) => {
        console.error('Mutation error:', error);
      }
    }
  }
});

const theme = {
  token: {
    colorPrimary: '#1e40af',
    borderRadius: 6,
  },
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

function AppComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={theme} locale={frFR}>
        <AntApp>
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/app" element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Dashboard />} />
                  <Route path="properties" element={<Properties />} />
                  <Route path="tenants" element={<Tenants />} />
                  <Route path="tenants/:id" element={<TenantDetail />} />
                  <Route path="owners" element={<Owners />} />
                  <Route path="owners/:id" element={<OwnerDetail />} />
                  <Route path="leases" element={<Leases />} />
                  <Route path="rents" element={<Rents />} />
                  <Route path="users" element={<Users />} />
                  <Route path="accounting" element={<Accounting />} />
                  <Route path="profile" element={<Profile />} />
                </Route>
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </AntApp>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default AppComponent;