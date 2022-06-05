import MsgInput from './MsgInput';

const MsgItem = ({
  id,
  userId,
  timestamp,
  text,
  onUpdate,
  onDelete,
  isEditing,
  startEdit,
  myId,
}) => {
  return (
    <li className='messages__item'>
      <h3>
        {userId}
        <sub>
          {new Date(timestamp).toLocaleString('ko-KR', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true, // 시간 앞에 '오전', '오후' 붙여서 구분
          })}
        </sub>
      </h3>

      {isEditing ? <MsgInput mutate={onUpdate} id={id} text={text} /> : text}

      {myId === userId && (
        <div className='messages__buttons'>
          <button onClick={startEdit}>수정</button>
          <button onClick={onDelete}>삭제</button>
        </div>
      )}
    </li>
  );
};

export default MsgItem;
