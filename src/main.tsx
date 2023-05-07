import PrivateRoute from '@/components/PrivateRoute.tsx';
import Login from '@/pages/Login';
import Main from '@/pages/Main';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';
import Chat from './pages/Chat';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* <Toaster containerClassName='bg-[color:var(--bg-color)] text-[color:var(--txt-color)]' /> */}
      <BrowserRouter>
        <Routes>
          <Route path='' element={<PrivateRoute />}>
            <Route path='' element={<Main />} />
            <Route
              path='chat/:chatId'
              element={
                <ErrorBoundary fallback={<p>Что-то пошло не так</p>}>
                  <Chat />
                </ErrorBoundary>
              }
            />
          </Route>
          <Route path='login' element={<Login />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
