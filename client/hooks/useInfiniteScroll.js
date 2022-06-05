import { useCallback, useEffect, useState, useRef } from 'react';

// targetEl: 스크롤이 최하단에 도달했는지 알려주는 useRef값
const useInfiniteScroll = (targetEl) => {
  const observerRef = useRef(null);
  const [intersecting, setIntersecting] = useState(false); // 최종 반환할 값

  // // entries는 배열 (여러 개 중 하나가 있으면 무한스크롤 발동)
  // const observer = new IntersectionObserver((entries) =>
  //   setIntersecting(
  //     // entries 중에서 일부가 하나라도 있으면(= some 메서드) intersecting을 true, 그렇지 않으면 false로 설정
  //     entries.some((entry) => entry.isIntersecting)
  //   )
  // );

  // 스크롤을 감시할 옵저버(Observer) 생성
  // 위의 observer는 추가 fetch할 데이터가 더 있던 없던 상관없이
  // targetEl에 닿을 때마다 계속해서 데이터를 불러오는 코드 => 안전장치를 한 getObserver로 교체
  // + useCallback으로 함수 메모이제이션 (= 의존성 배열의 값이 변하지 않는 한, 함수를 저장해놓고 그대로 활용)
  const getObserver = useCallback(() => {
    // 맨 처음에는 observerRef가 null로 비어있음 => IntersectionObserver 객체를 생성하여 observerRef.current에 '값'을 넣는다.
    // (값 내용보다는 그냥 안 비어있게 하는 목적에 가까움)
    if (!observerRef.current) {
      // IntersectionObserver 객체 내부에서 일어나는 일은 중요 => entries 배열을 꺼내서,
      observerRef.current = new IntersectionObserver((entries) =>
        setIntersecting(
          // entries 배열의 요소(entry) 중에 isIntersecting 상태가 true인 요소가 하나라도 있으면(= some 메서드) intersecting 상태를 true로 설정
          // (some 메서드는 true/false를 반환하기 때문에 isIntersecting 여부 결과값(boolean)을 some 메서드에 그대로 반영)
          entries.some((entry) => entry.isIntersecting)
        )
      );
    }

    // 이후로는 observerRef에 값이 있으므로(= null이 아니므로) 만들어져 있는 observerRef.current값을 그대로 반환
    return observerRef.current;
  }, [observerRef.current]);

  // observe 명령 내리기(어떤 것을 감시할 지 대상 지정)
  // 매개변수로 전달된 targetEl.current가 바뀔 때마다 실행
  useEffect(() => {
    // targetEl.current값이 있으면 위에서 만든 Observer를 통해 observe 명령 실행 (이때 observe 메서드의 인수값 = targetEl.current)
    if (targetEl.current) getObserver().observe(targetEl.current); // (= connect()와 동일)

    // useInfiniteScroll은 한 번 발동되면 다음 발동 때까지 더 이상 화면상에 존재하지 않아야 함 => 발동 때마다 정리 함수 실행
    return () => {
      getObserver().disconnect(); // disconnect() 메서드로 감시를 끝낸다.
    };
  }, [targetEl.current]);

  // 최종으로는 useState의 상태인 intersecting 반환 (= boolean)
  return intersecting;
};

export default useInfiniteScroll;
