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
import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import PCRecommendModal from './components/common/PCRecommendModal/PCRecommendModal';
import StickyGuideButton from './components/common/StickyGuideButton/StickyGuideButton';
import GuideModal from './components/common/GuideModal/GuideModal';
import { useModalStore } from '@/stores/modalStore';
import { connectSSE, disconnectSSE } from '@/utils/sse';

function App() {
  const userId = useAuth().userId;
  const isConnected = useRef(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  // const [guideModalReady, setGuideModalReady] = useState<boolean | null>(null);

  const { showBasicGuideModal, setShowBasicGuideModal } = useModalStore();

  // const arcPages = ['/quiz', '/note'];
  const location = useLocation();

  // 페이지 타입 계산을 메모이제이션
  const { isArcPage, mainPageType } = useMemo(() => {
    const isArcPage =
      location.pathname.startsWith('/quiz') ||
      location.pathname.startsWith('/note') ||
      location.pathname.startsWith('/login');
    return {
      isArcPage,
      mainPageType: isArcPage ? 'fixed' : ('default' as const),
    };
  }, [location.pathname]);

  const showGuideButtonPaths = ['/generate', '/list', '/note'];
  // 현재 경로가 배열에 포함되는지 체크
  const shouldShowGuideButton = showGuideButtonPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  // SSE 연결 관리
  useEffect(() => {
    if (!userId || isConnected.current) return;

    connectSSE(userId);
    isConnected.current = true;

    return () => {
      if (isConnected.current) {
        disconnectSSE();
        isConnected.current = false;
      }
    };
  }, [userId]);

  // PC 추천 모달 상태 관리
  const [showPCRecommend, setShowPCRecommend] = useState(false);

  // 화면 크기 체크 로직을 메모이제이션
  const checkScreenWidth = useCallback(() => {
    const isSmallScreen = window.innerWidth <= 1024;
    const isPCVersion =
      new URLSearchParams(window.location.search).get('pc') === '1';
    setShowPCRecommend(isSmallScreen && !isPCVersion);
  }, []);

  const BackgroundComponent = isArcPage ? ArcBackground : BlurBackground;
  useEffect(() => {
    const alreadyChecked = localStorage.getItem('hidePCRecommend');
    if (alreadyChecked === 'true') {
      setShowPCRecommend(false);
      return;
    }
    checkScreenWidth();
    window.addEventListener('resize', checkScreenWidth);

    // 클린업
    return () => {
      window.removeEventListener('resize', checkScreenWidth);
    };
  }, []);

  // 최초접속 안내 모달(localStorage로 제어)
  // 최초접속 안내 모달(localStorage로 제어) - 초기 렌더링 시 한 번만 실행
  useEffect(() => {
    const showGuideModalCheck = localStorage.getItem('showGuideModal');
    // 'true'인 경우에만 모달을 표시 (명시적으로 'false'로 설정되지 않은 경우 처음 방문 사용자에게는 표시)
    setShowGuideModal(showGuideModalCheck !== 'false');
  }, []); // 빈 의존성 배열로 마운트 시 한 번만 실행

  // PC 권장 모달 닫기
  const handleClosePCRecommend = () => {
    localStorage.setItem('hidePCRecommend', 'true');
    setShowPCRecommend(false);
  };

  // StickyGuideButton 클릭 시 토글
  const handleToggleBasicGuideModal = () => {
    setShowBasicGuideModal(!showBasicGuideModal);
  };

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
              'flex-1 py-8 px-3 min-h-0',
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
        onClose={handleClosePCRecommend}
      />
      {/* 최초접속 안내 모달 - null 체크 추가 */}
      <GuideModal
        isOpen={showGuideModal}
        onClose={() => {
          setShowGuideModal(false);
        }}
      />
      {/* StickyGuideButton 클릭 시 토글되는 모달 */}
      <GuideModal
        mode='basic'
        isOpen={showBasicGuideModal}
        onClose={() => setShowBasicGuideModal(false)}
      />
      {shouldShowGuideButton && (
        <StickyGuideButton onClick={handleToggleBasicGuideModal} />
      )}
    </div>
  );
}

export default App;
