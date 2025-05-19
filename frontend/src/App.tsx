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
import { useEffect, useState } from 'react';
import PCRecommendModal from './components/common/PCRecommendModal/PCRecommendModal';
import StickyGuideButton from './components/common/StickyGuideButton/StickyGuideButton';
import GuideModal from './components/common/GuideModal/GuideModal';

function App() {
  useAuth(); // 앱 전체에서 한 번만 인증 동기화
  const [showPCRecommend, setShowPCRecommend] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const arcPages = ['/quiz', '/note'];
  const location = useLocation();
  const isArcPage = arcPages.some((path) => location.pathname.startsWith(path));

  // 보여줄 경로 배열 (원하는 경로로 수정)
  const showGuideButtonPaths = ['/generate', '/list', '/note'];
  // 현재 경로가 배열에 포함되는지 체크
  const shouldShowGuideButton = showGuideButtonPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  // mainPageType: 'default' | 'fixed' 두 가지 타입 사용
  let mainPageType: 'default' | 'fixed' = 'default';
  if (
    location.pathname.startsWith('/quiz') ||
    location.pathname.startsWith('/note') ||
    location.pathname.startsWith('/login')
  ) {
    mainPageType = 'fixed';
  }

  const BackgroundComponent = isArcPage ? ArcBackground : BlurBackground;

  useEffect(() => {
    // 화면 너비 체크 함수
    const checkScreenWidth = () => {
      const isSmallScreen = window.innerWidth <= 1024;
      // URL에 pc=1 파라미터가 있으면 모달을 표시하지 않음
      const isPCVersion =
        new URLSearchParams(window.location.search).get('pc') === '1';
      setShowPCRecommend(isSmallScreen && !isPCVersion);
    };

    // 초기 체크
    checkScreenWidth();

    // 화면 크기 변경 시 체크
    window.addEventListener('resize', checkScreenWidth);

    // 클린업
    return () => {
      window.removeEventListener('resize', checkScreenWidth);
    };
  }, []);

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
      <PCRecommendModal
        isOpen={showPCRecommend}
        onClose={() => setShowPCRecommend(false)}
      />
      <GuideModal
        mode='basic'
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
      />
      {shouldShowGuideButton && (
        <StickyGuideButton onClick={() => setShowGuideModal(true)} />
      )}
    </div>
  );
}

export default App;
