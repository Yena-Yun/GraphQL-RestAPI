import { useState } from 'react';
import MsgInput from './MsgInput';
import MsgItem from './MsgItem';

const UserIds = ['roy', 'jay'];
const getRandomUserId = () => UserIds[Math.round(Math.random())];

// Array를 만든 뒤 fill로 빈 값을 아무 거나 넣어주면 map을 돌릴 수 있다.
const originalMsgs = Array(50)
  .fill(0)
  .map((_, i) => ({
    // value가 별로 안 중요할 경우 '_'로 처리
    id: 50 - i,
    userId: getRandomUserId(),
    // * 1000: millisecond를 second 단위로 바꾸고
    // * 60: 다시 분 단위로 바꿈
    timestamp: 1234567890123 + (50 - i) * 1000 * 60, // 1분에 하나씩 보여짐
    text: `${50 - i} mock text`,
  }));

const MsgList = () => {
  const [msgs, setMsgs] = useState(originalMsgs);
  const [editingId, setEditingId] = useState(null);

  const onCreate = (text) => {
    const newMsg = {
      id: msgs.length + 1,
      userId: getRandomUserId(),
      timestamp: Date.now(),
      text: `${msgs.length + 1} ${text}`,
    };

    setMsgs((msgs) => [newMsg, ...msgs]);
  };

  const onUpdate = (text, id) => {
    // state 안에서 기존 msgs를 받아오게 함 => 좀 더 안정적으로 state 수정
    // Array.findIndex: 배열을 돌면서 조건에 해당하는 첫번째 값의 index를 반환
    setMsgs((msgs) => {
      const targetIndex = msgs.findIndex((msg) => msg.id === id);

      // targetIndex가 없을 수도 있음('-1') => 아무 것도 안 하고 msgs 배열 그대로 반환
      if (targetIndex < 0) return msgs;

      // otherwise msgs 배열에 새 메시지 추가하기 (수정)
      const newMsgs = [...msgs]; // 기존 배열 복사 (사본 만들기)
      // 사본을 조작
      newMsgs.splice(targetIndex, 1, {
        ...msgs[targetIndex], // 기존 targetIndex의 내용 그대로 가져오고,
        text, // text만 새 걸로 넣어줌
      });
      return newMsgs;
    });

    // update가 끝나면 MsgInput 렌더링을 멈춤 (editingId를 null로 변경)
    setEditingId(null);
  };

  const onDelete = (id) =>
    setMsgs((msgs) => {
      const targetIndex = msgs.findIndex((msg) => msg.id === id);

      if (targetIndex < 0) return msgs;

      // msgs 배열에서 특정 메시지 삭제하기
      const newMsgs = [...msgs]; // 기존 배열 복사 (사본 만들기)
      // 사본을 조작
      newMsgs.splice(targetIndex, 1);
      return newMsgs;
    });

  // const onDelete = (id) => setMsgs([...msgs.filter((msg) => msg.id !== id)]);

  return (
    <>
      <MsgInput mutate={onCreate} />
      <ul className='messages'>
        {msgs.map((x) => (
          <MsgItem
            key={x.id}
            {...x}
            onUpdate={onUpdate}
            onDelete={() => onDelete(x.id)}
            startEdit={() => setEditingId(x.id)}
            isEditing={editingId === x.id}
          />
        ))}
      </ul>
    </>
  );
};

export default MsgList;
