import { useState, useEffect } from 'react';
import { getUserInfo, logout } from '@/apis/auth/auth';
import { useUserStore } from '@/stores/userStore';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const setUserId = useUserStore((s) => s.setUserId);
  const userId = useUserStore((s) => s.userId);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const response = await getUserInfo();
      console.log('userinfo 응답:', response.data);
      const login = response.data?.data?.login === true;
      const userId = response.data?.data?.userId ?? null;
      const userName = response.data?.data?.nickname ?? null;
      setUserName(userName);
      console.log('setIsLoggedIn:', login, 'setUserId:', userId);
      setIsLoggedIn(login);
      setUserId(userId);
    } catch (error) {
      setIsLoggedIn(false);
      setUserId(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      await checkLoginStatus();
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
      setIsLoggedIn(false);
      setUserId(null);
    }
  };

  return {
    isLoggedIn,
    isLoading,
    checkLoginStatus,
    handleLogout,
    userId,
    userName,
  };
};
