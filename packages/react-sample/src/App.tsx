import { LogtoProvider, type LogtoConfig, UserScope } from '@logto/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import RequireAuth from './RequireAuth';
import { appId, endpoint } from './consts';
import ApiTest from './pages/ApiTest';
import Callback from './pages/Callback';
import Home from './pages/Home';
import Organizations from './pages/Organizations';
import ProtectedResource from './pages/ProtectedResource';
import './App.module.scss';
import ReactQuery from './pages/ReactQuery';

export const App = () => {
  const config: LogtoConfig = {
    appId,
    endpoint,
    scopes: [
      UserScope.Email,
      UserScope.Phone,
      UserScope.CustomData,
      UserScope.Identities,
      UserScope.Organizations,
    ],
    resources: [
      'https://api.contextid.cn', // 对应Logto控制台中创建的API资源标识符
    ],
  };

  return (
    <BrowserRouter>
      <LogtoProvider config={config}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/protected" element={<RequireAuth />}>
            <Route index element={<ProtectedResource />} />
            <Route path="react-query" element={<ReactQuery />} />
            <Route path="organizations" element={<Organizations />} />
            <Route path="api-test" element={<ApiTest />} />
          </Route>
        </Routes>
      </LogtoProvider>
    </BrowserRouter>
  );
};
