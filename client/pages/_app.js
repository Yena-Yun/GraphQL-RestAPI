import { useRef } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import './index.scss';

const App = ({ Component, pageProps }) => {
  // 무한스크롤 용도
  // 최초 1번만 작성하고 이후로는 계속 재사용할 수 있도록
  const clientRef = useRef(null);
  const getClient = () => {
    if (!clientRef.current) clientRef.current = new QueryClient();
    return clientRef.current;
  };

  // const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={getClient()}>
      <Component {...pageProps} />;
    </QueryClientProvider>
  );
};

App.getInitialProps = async ({ ctx, Component }) => {
  const pageProps = await Component.getInitialProps?.(ctx);
  return { pageProps };
};

export default App;
