import { useRef } from 'react';
import { dehydrate, QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';
import './index.scss';

const App = ({ Component, pageProps }) => {
  // 무한스크롤 용도
  // 최초 1번만 작성하고 이후로는 계속 재사용할 수 있도록
  const clientRef = useRef(null);
  const getClient = () => {
    if (!clientRef.current)
      clientRef.current = new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      });
    return clientRef.current;
  };

  // const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={getClient()}>
      {/* Hydrate: 서버에서 받아온 데이터를 데이터 없이 HTML만 남아 있는 클라이언트의 HTML에 '부어준다.' 그리고 서버사이드렌더링에서 온 데이터가 react-query의 캐시정보에 Hydrate를 통해 저장된다. */}
      <Hydrate state={pageProps.dehydratedState}>
        <Component {...pageProps} />;
      </Hydrate>
    </QueryClientProvider>
  );
};

App.getInitialProps = async ({ ctx, Component }) => {
  const pageProps = await Component.getInitialProps?.(ctx);
  return { pageProps };
};

export default App;
