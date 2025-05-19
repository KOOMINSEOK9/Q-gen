import { useNavigate } from 'react-router-dom';
import logo from '@/assets/images/logo.png';
import googleLogo from '@/assets/images/Google.png';

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className='h-full flex flex-col justify-center items-center mt-24 mb-24'>
      <div className='w-full max-w-sm mx-auto rounded-3xl shadow-sm bg-white p-10 min-h-[371.5px] flex flex-col justify-center items-center'>
        {/* Q-gen 로고 */}
        <img
          src={logo}
          alt='Q-gen Logo'
          className='w-28 max-w-[140px] aspect-[3/2] mb-4 object-contain'
        />
        {/* 안내문구 */}
        <p className='text-gray-500 text-center mb-2 text-base mt-2'>
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
