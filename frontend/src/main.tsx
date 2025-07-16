// 프로덕션 환경에서 console 출력 무력화
if (process.env.NODE_ENV === 'production') {
  for (const method of ['log', 'warn', 'error', 'info', 'debug']) {
    // @ts-ignore
    console[method] = () => {};
  }
}

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './assets/styles/globals.css';
import './index.css';
import { router } from './routes/router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
