import './App.css';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/layout/Header/Header';
import Footer from './components/layout/Footer/Footer';
import ArcBackground from './components/layout/Background/ArcBackground';
import BlurBackground from './components/layout/Background/BlurBackground';
import ScrollToTop from './components/Scroll/ScrollToTop';
import { twMerge } from 'tailwind-merge';

function App() {
  const arcPages = ['/quiz', '/note'];
  const location = useLocation();
  const isArcPage = arcPages.some((path) => location.pathname.startsWith(path));

  // mainPageType: 'default' | 'fixed' 두 가지 타입만 사용
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
    </div>
  );
}

export default App;
