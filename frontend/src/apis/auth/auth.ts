import axiosInstance from '../axiosInstance';

// 로그인 상태 확인
export const getUserInfo = async () => {
  return axiosInstance.get('/api/userinfo');
};

// 로그아웃
export const logout = async () => {
  return axiosInstance.post('/api/logout');
};
