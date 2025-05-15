import App from '@/App';
import Generate from '@/pages/Generate/Generate';
import List from '@/pages/List/List';
import Note from '@/pages/Note/Note';
import { createBrowserRouter } from 'react-router-dom';
import Quiz from '@/pages/Quiz/Quiz';
import QuizEnd from '@/pages/Quiz/QuizEnd';
import Login from '@/pages/Login/Login';
import Landing from '@/pages/Landing/Landing';
import ProtectedRoute from '@/components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: '/generate/:workBookId',
        element: (
          <ProtectedRoute>
            <Generate />
          </ProtectedRoute>
        ),
      },
      {
        path: '/quiz/:testPaperId',
        element: (
          <ProtectedRoute>
            <Quiz />
          </ProtectedRoute>
        ),
      },
      {
        path: '/quiz-end',
        element: (
          <ProtectedRoute>
            <QuizEnd />
          </ProtectedRoute>
        ),
      },
      {
        path: '/list',
        element: (
          <ProtectedRoute>
            <List />
          </ProtectedRoute>
        ),
      },
      {
        path: '/list/:workBookId',
        element: (
          <ProtectedRoute>
            <List />
          </ProtectedRoute>
        ),
      },
      {
        path: '/note/:workBookId/:testPaperId',
        element: (
          <ProtectedRoute>
            <Note />
          </ProtectedRoute>
        ),
      },
      {
        path: '/login',
        element: <Login />,
      },
    ],
  },
]);
