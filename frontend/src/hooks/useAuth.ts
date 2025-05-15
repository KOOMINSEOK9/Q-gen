import { useState, useEffect } from 'react';
import { getUserInfo, logout } from '@/apis/auth/auth';
import { useUserStore } from '@/stores/userStore';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const setUserId = useUserStore((s) => s.setUserId);
  const userId = useUserStore((s) => s.userId);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const response = await getUserInfo();
      setIsLoggedIn(response.data?.data?.login === true);
      setUserId(response.data?.data?.userId ?? null);
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
  };
};
