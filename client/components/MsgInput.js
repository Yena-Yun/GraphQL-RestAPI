import { useRef } from 'react';

// MsgInput은 MsgList(생성)와 MsgItem(수정) 둘 다에서 쓰임
// 생성일 때는 id가 필요없지만 수정일 때는 필요 => 없을 수도 있는 것은 undefined로 초기화
// 수정 시 기존 text를 넣어줄 때도 text가 없거나 빈 문자열일 수 있으므로 ''로 초기화 (타입이 명확하지 않은 경우만 undefined 사용)
const MsgInput = ({ mutate, text = '', id = undefined }) => {
  const textRef = useRef(null);

  const onSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const text = textRef.current.value;
    textRef.current.value = '';

    mutate(text, id);
  };

  return (
    <form className='messages__input' onSubmit={onSubmit}>
      <textarea
        ref={textRef}
        placeholder='내용을 입력하세요.'
        defaultValue={text} // textarea의 기본값은 defaultValue 속성 (input의 value X)
      />
      <button type='submit'>완료</button>
    </form>
  );
};

export default MsgInput;
