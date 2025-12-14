import { useLogto } from '@logto/react';
import { useState } from 'react';
import './index.module.scss';

const ApiTest = () => {
  const { getAccessToken, isAuthenticated } = useLogto();
  const [apiResponse, setApiResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');

  // 测试获取Access Token
  const handleGetToken = async () => {
    if (!isAuthenticated) {
      setApiResponse('❌ 请先登录');
      return;
    }

    try {
      setLoading(true);
      // 获取对应API资源的access token
      const accessToken = await getAccessToken('https://api.contextid.cn');
      setToken(accessToken || '未获取到token');
      console.log('Access Token:', accessToken);
    } catch (error) {
      console.error('获取token失败:', error);
      setToken('获取token失败: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // 测试调用后端API
  const handleCallApi = async () => {
    if (!isAuthenticated) {
      setApiResponse('❌ 请先登录');
      return;
    }

    try {
      setLoading(true);
      // 获取access token
      const accessToken = await getAccessToken('https://your-backend-api');
      
      if (!accessToken) {
        setApiResponse('❌ 无法获取access token');
        return;
      }

      // 调用后端API
      const response = await fetch('http://localhost:8081/api/v1/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        setApiResponse(`✅ API调用成功!\n\n状态码: ${response.status}\n响应数据:\n${JSON.stringify(data, null, 2)}`);
      } else {
        setApiResponse(`❌ API调用失败!\n\n状态码: ${response.status}\n错误信息:\n${JSON.stringify(data, null, 2)}`);
      }
    } catch (error) {
      console.error('API调用失败:', error);
      setApiResponse(`❌ API调用失败!\n\n错误信息: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>🔐 前后端鉴权测试</h1>
      
      <div className="section">
        <h2>1. 检查登录状态</h2>
        <p>登录状态: {isAuthenticated ? '✅ 已登录' : '❌ 未登录'}</p>
      </div>

      <div className="section">
        <h2>2. 获取Access Token</h2>
        <button 
          onClick={handleGetToken} 
          disabled={loading || !isAuthenticated}
          className="button"
        >
          {loading ? '获取中...' : '获取Access Token'}
        </button>
        {token && (
          <div className="token-display">
            <h3>Token内容:</h3>
            <textarea 
              value={token} 
              readOnly 
              rows={4}
              style={{ width: '100%', fontSize: '12px', fontFamily: 'monospace' }}
            />
            <p className="token-type">
              {token.startsWith('eyJ') ? '✅ 这是JWT格式的token' : '⚠️ 这可能是Opaque Token'}
            </p>
          </div>
        )}
      </div>

      <div className="section">
        <h2>3. 测试后端API调用</h2>
        <p>测试调用: <code>GET /api/v1/users/me</code></p>
        <button 
          onClick={handleCallApi} 
          disabled={loading || !isAuthenticated}
          className="button primary"
        >
          {loading ? '调用中...' : '调用后端API'}
        </button>
      </div>

      {apiResponse && (
        <div className="section">
          <h2>4. 测试结果</h2>
          <pre className="response-display">{apiResponse}</pre>
        </div>
      )}

      <div className="section">
        <h2>📋 测试说明</h2>
        <ul>
          <li>第一步：确认是否已登录</li>
          <li>第二步：点击获取Access Token，应该能看到以 <code>eyJ</code> 开头的JWT</li>
          <li>第三步：点击调用后端API，测试鉴权是否正常工作</li>
          <li>如果API调用成功，说明前后端鉴权配置正确</li>
        </ul>
      </div>
    </div>
  );
};

export default ApiTest;