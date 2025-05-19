import { useNavigate } from 'react-router-dom';
import logo from '@/assets/images/logo.png';
import googleLogo from '@/assets/images/Google.png';

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className='h-full flex flex-col justify-center items-center mt-24 mb-24'>
      <div className='w-full max-w-sm mx-auto rounded-3xl shadow-sm bg-white p-8 flex flex-col items-center gap-6'>
        {/* 로고/타이틀 */}
        <div className='flex flex-col items-center gap-4'>
          <img
            src='/images/logo-lg.png'
            alt='Q-gen'
            className='h-[54px] mb-6  '
          />
          <h1 className='text-2xl font-bold text-gray-800 mb-0.5 text-center sr-only'>
            로그인
          </h1>
        </div>
        <p className='text-gray-500 text-center mb-4 text-base'>
          구글 계정으로 간편하게 로그인하세요.
        </p>
        {/* 구글 로그인 버튼 */}
        <button
          className='flex items-center justify-center w-full gap-3 py-3.5 px-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all text-gray-700 font-semibold text-base focus:outline-none cursor-pointer mt-4'
          onClick={() => {
            window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/google`;
          }}
        >
          <img src={googleLogo} alt='Google' className='w-6 h-6' />
          <span>구글 계정으로 로그인</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
