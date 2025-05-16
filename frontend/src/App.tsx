import './App.css';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/layout/Header/Header';
import Footer from './components/layout/Footer/Footer';
import ArcBackground from './components/layout/Background/ArcBackground';
import BlurBackground from './components/layout/Background/BlurBackground';
import ScrollToTop from './components/Scroll/ScrollToTop';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '@/hooks/useAuth';

function App() {
  useAuth(); // 앱 전체에서 한 번만 인증 동기화
  const arcPages = ['/quiz', '/note'];
  const location = useLocation();
  const isArcPage = arcPages.some((path) => location.pathname.startsWith(path));

  // mainPageType: 'default' | 'fixed' 두 가지 타입 사용
  let mainPageType: 'default' | 'fixed' = 'default';
  if (
    location.pathname.startsWith('/quiz') ||
    location.pathname.startsWith('/note')
  ) {
    mainPageType = 'fixed';
  }

  const BackgroundComponent = isArcPage ? ArcBackground : BlurBackground;

  return (
    <div className='flex flex-col w-full'>
      <ScrollToTop />
      <BackgroundComponent>
        <div
          className={twMerge(
            'flex flex-col flex-1 pb-4',
            mainPageType === 'fixed' ? 'h-screen' : ''
          )}
        >
          <Header />

          <main
            className={twMerge(
              'flex-1 py-4 min-h-0',
              mainPageType === 'fixed' ? 'h-full' : ''
            )}
          >
            <Outlet />
          </main>
        </div>
        <Footer />
      </BackgroundComponent>
      <ToastContainer
        position='top-right'
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
