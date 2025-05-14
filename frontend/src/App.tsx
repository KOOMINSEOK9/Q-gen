import './App.css';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/layout/Header/Header';
import Footer from './components/layout/Footer/Footer';
import ArcBackground from './components/layout/Background/ArcBackground';
import BlurBackground from './components/layout/Background/BlurBackground';
import ScrollToTop from './components/Scroll/ScrollToTop';

function App() {
  const arcPages = ['/quiz', '/incorrect'];
  const location = useLocation();
  const isArcPage = arcPages.some((path) => location.pathname.startsWith(path));

  const BackgroundComponent = isArcPage ? ArcBackground : BlurBackground;

  return (
    <div className='flex flex-col w-full'>
      <ScrollToTop />
      <BackgroundComponent>
        <div className='flex flex-col max-w-[1400px] mx-auto flex-1 pb-4'>
          <Header />
          <main className='flex-1 py-10 min-h-0'>
            <Outlet />
          </main>
          <Footer />
        </div>
      </BackgroundComponent>
    </div>
  );
}

export default App;
