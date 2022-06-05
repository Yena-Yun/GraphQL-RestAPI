import { useCallback, useEffect, useState, useRef } from 'react';

const useInfiniteScroll = (targetEl) => {
  const observerRef = useRef(null);
  const [intersecting, setIntersecting] = useState(false);

  // // entries는 배열 (여러 개 중 하나가 있으면 무한스크롤 발동)
  // const observer = new IntersectionObserver((entries) =>
  //   setIntersecting(
  //     // entries 중에서 일부가 하나라도 있으면(= some 메서드) intersecting을 true, 그렇지 않으면 false로 설정
  //     entries.some((entry) => entry.isIntersecting)
  //   )
  // );

  // 위의 observer는 targetEl에 닿을 때마다 계속해서 데이터를 불러올 것이므로
  // 안전장치를 한 observer로 교체
  const getObserver = useCallback(() => {
    // observerRef가 없을 때에 한해서 무한스크롤 발동
    // 맨 처음에는 observerRef가 null이어서 여기가 실행됨
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver((entries) =>
        setIntersecting(
          // entries 중에서 일부가 하나라도 있으면(= some 메서드) intersecting을 true, 그렇지 않으면 false로 설정
          entries.some((entry) => entry.isIntersecting)
        )
      );
    }

    // 이후로는 observerRef가 있기 때문에 만들어진 observer를 그대로 반환
    return observerRef.current;
  }, [observerRef.current]);

  // observe 명령 (어떤 것을 감시할 지 대상 지정)
  useEffect(() => {
    // targetEl(= useRef값)의 current가 있을 때만 옵저버에 observe 명령 실행
    if (targetEl.current) getObserver().observe(targetEl.current);

    // 정리 함수 (useInfiniteScroll이 더 이상 화면 상에서 존재하지 않게 될 때)
    return () => {
      getObserver().disconnect();
    };
  }, [targetEl.current]);

  return intersecting;
};

export default useInfiniteScroll;
