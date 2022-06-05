import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import fetcher from '../fetcher';
import MsgInput from './MsgInput';
import MsgItem from './MsgItem';

// const UserIds = ['roy', 'jay'];
// const getRandomUserId = () => UserIds[Math.round(Math.random())];

// // Array를 만든 뒤 fill로 빈 값을 아무 거나 넣어주면 map을 돌릴 수 있다.
// const originalMsgs = Array(50)
//   .fill(0)
//   .map((_, i) => ({
//     // value가 별로 안 중요할 경우 '_'로 처리
//     id: 50 - i,
//     userId: getRandomUserId(),
//     // * 1000: millisecond를 second 단위로 바꾸고
//     // * 60: 다시 분 단위로 바꿈
//     timestamp: 1234567890123 + (50 - i) * 1000 * 60, // 1분에 하나씩 보여짐
//     text: `${50 - i} mock text`,
//   }));

// server의 messages.json에 넣을 내용 콘솔에 출력하는 용도
// console.log(JSON.stringify(originalMsgs));

const MsgList = () => {
  // const {
  //   query: { userId = '' },
  // } = useRouter();
  // (Window) URL query의 userId가 대문자(userId)이든 소문자(userid)이든 상관없이 적용되도록
  const { query } = useRouter();
  const userId = query.userId || query.userid || '';

  // const [msgs, setMsgs] = useState(originalMsgs);
  const [msgs, setMsgs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  // const { userId } = query;

  // useEffect 내부가 아니면 async 바로 사용 가능
  const onCreate = async (text) => {
    const newMsg = await fetcher('post', '/messages', { text, userId });
    // 예외처리: newMsg(서버로부터 받아온 data가 없다면 에러 메시지를 띄우도록)
    if (!newMsg) throw Error('새 메시지를 생성하지 못했습니다.');

    // const newMsg = {
    //   id: msgs.length + 1,
    //   userId: getRandomUserId(),
    //   timestamp: Date.now(),
    //   text: `${msgs.length + 1} ${text}`,
    // };

    setMsgs((msgs) => [newMsg, ...msgs]);
  };

  const onUpdate = async (text, id) => {
    const newMsg = await fetcher('put', `/messages/${id}`, {
      text,
      userId,
      ...rest,
    });
    // 예외처리: newMsg(서버로부터 받아온 data가 없다면 에러 메시지를 띄우도록)
    if (!newMsg) throw Error('메시지를 수정하지 못했습니다.');

    // state 안에서 기존 msgs를 받아오게 함 => 좀 더 안정적으로 state 수정
    // Array.findIndex: 배열을 돌면서 조건에 해당하는 첫번째 값의 index를 반환
    setMsgs((msgs) => {
      const targetIndex = msgs.findIndex((msg) => msg.id === id);

      // targetIndex가 없을 수도 있음('-1') => 아무 것도 안 하고 msgs 배열 그대로 반환
      if (targetIndex < 0) return msgs;

      // otherwise msgs 배열에 새 메시지 추가하기 (수정)
      const newMsgs = [...msgs]; // 기존 배열 복사 (사본 만들기)
      // 사본을 조작
      newMsgs.splice(targetIndex, 1, newMsg);
      // newMsgs.splice(targetIndex, 1, {
      //   ...msgs[targetIndex], // 기존 targetIndex의 내용 그대로 가져오고,
      //   text, // text만 새 걸로 넣어줌
      // });
      return newMsgs;
    });

    // update가 끝나면 MsgInput 렌더링을 멈춤 (editingId를 null로 변경)
    setEditingId(null);
  };

  const onDelete = async (id) => {
    const receivedId = await fetcher('delete', `/messages/${id}`, {
      params: { userId },
    });

    // 삭제 시 network에는 삭제한 메시지의 id가 잘 뜨는데 뷰에서는 안 사라질 경우
    // => 뷰에 반영이 안 되는 것 => msgs 배열에 넣어주는 과정에서 문제가 있음
    // console.log(typeof receivedId, typeof id); // number string (둘이 타입이 다름)

    setMsgs((msgs) => {
      const targetIndex = msgs.findIndex(
        (msg) => msg.id === String(receivedId) // 한쪽의 타입을 맞춰준다.
      );

      if (targetIndex < 0) return msgs;

      // msgs 배열에서 특정 메시지 삭제하기
      const newMsgs = [...msgs]; // 기존 배열 복사 (사본 만들기)
      // 사본을 조작
      newMsgs.splice(targetIndex, 1);
      return newMsgs;
    });
  };

  // const onDelete = (id) => setMsgs([...msgs.filter((msg) => msg.id !== id)]);

  // useEffect 내에서는 async/await를 직접 호출하지 않도록 권장 => 함수를 별도로 만들어서 해당 함수를 useEffect 내에서 호출
  const getMessages = async () => {
    const msgs = await fetcher('get', '/messages');
    setMsgs(msgs);
  };

  useEffect(() => {
    getMessages();
  }, []);

  return (
    <>
      <h1>SIMPLE SNS</h1>
      {/* (URL에 지정된) userId가 없으면 아예 맨 위의 input창이 뜨지 않도록 함 */}
      {userId && <MsgInput mutate={onCreate} />}
      <ul className='messages'>
        {msgs.map((x) => (
          <MsgItem
            key={x.id}
            {...x}
            onUpdate={onUpdate}
            onDelete={() => onDelete(x.id)}
            startEdit={() => setEditingId(x.id)}
            isEditing={editingId === x.id}
            myId={userId}
          />
        ))}
      </ul>
    </>
  );
};

export default MsgList;
