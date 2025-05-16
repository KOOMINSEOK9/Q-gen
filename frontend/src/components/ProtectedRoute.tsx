import { Navigate } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const userId = useUserStore((s) => s.userId);
  // 필요시 zustand에 isLoading을 추가해서 사용할 수 있음
  // const isLoading = useUserStore((s) => s.isLoading);
  const isLoading = false;

  if (isLoading) return null;
  if (!userId) {
    return <Navigate to='/login' replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
