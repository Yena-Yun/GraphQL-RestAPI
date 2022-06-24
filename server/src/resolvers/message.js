// Rest API에서의 route 폴더의 messages.js의 역할과 거의 비슷

import { v4 } from 'uuid';
// GraphQL에서는 index.js의 server - context - models에서 DB를 불러오므로
// readDB가 필요 없음(db를 수정하는 writeDB만 필요)
// import { writeDB } from '../dbController.js';

// LowDB 사용하면 writeDB 없이 그냥 db.write() 쓰면 됨

const setMsgs = (data) => writeDB('messages', data);

/**
 * (출처: GraphQL 공식문서)
 * obj: parent 객체(root 쿼리 타입의 이전 객체). 거의 사용 x
 * args: Query에 필요한 인수 (parameter)
 * context: 로그인한 사용자 정보, DB 액세스 권한 등 중요한 정보를 담고 있는 객체
 */

// schema에서 타입을 지정한 내용들이 하나하나 어떻게 동작할 지 구체적으로 정의하는 역할
const messageResolver = {
  Query: {
    // 3번째 인수인 context 안에 db가 들어 있음 (index.js 참고)
    // obj라고 하면 일반적인 객체 같으니까 parent로 바꿈
    messages: (parent, { cursor = '' }, { db }) => {
      // console.log({ obj, args, context }); // 각각에 뭐가 들어있는지 나중에 확인할 용도
      const fromIndex = db.messages.findIndex((msg) => msg.id === cursor) + 1;

      // fromIndex부터 15개씩 가져옴 (무한스크롤)
      // db.messages가 없을 경우 빈 배열([]) 반환
      return db.messages?.slice(fromIndex, fromIndex + 15) || [];
    },
    // args 자리에 query에 필요한 파라미터 값(id)이 옴
    // id가 없을 경우를 대비하여 빈 문자열('')로 초기화
    message: (parent, { id = '' }, { db }) => {
      return db.messages.find((msg) => msg.id === id);
    },
  },
  Mutation: {
    createMessage: (parent, { text, userId }, { db }) => {
      // const msgs = getMsgs(); // getMsg()의 역할은 readDB (=> db를 직접 읽어오는 graphQL에서는 필요 x)

      const newMsg = {
        id: v4(), // v4 버전의 unique한 id 생성
        userId, // (body.userId 대신 받아온 userId)
        timestamp: Date.now(),
        text, // (body.text 대신 받아온 text)
      };

      // (msgs 대신 db.messages)
      db.messages.unshift(newMsg); // messages DB의 맨 앞에 새 메시지를 추가
      setMsgs(db.messages); // DB 수정 (setMsgs의 역할은 writeDB)

      return newMsg; // (요청 성공 시) 새로 만든 메시지 반환
    },
    updateMessage: (parent, { id, text, userId }, { db }) => {
      // const msgs = getMsgs();

      const targetIndex = db.messages.findIndex((msg) => msg.id === id); // '인덱스'를 찾아야 하므로 findIndex

      // 수정할 메시지가 없거나 사용자가 다를 경우 에러로 처리
      if (targetIndex < 0) throw Error('메시지가 없습니다.');
      if (db.messages[targetIndex].userId !== userId)
        throw Error('사용자가 다릅니다.');

      // 기존 내용 그대로 넣고 text만 새 걸로 교체 (=> spread 연산자 활용)
      const newMsg = { ...db.messages[targetIndex], text };
      // messages DB 배열에서 targetIndex의 요소를 1개 삭제하고 그 자리에 수정된 메시지(newMsg) 추가
      db.messages.splice(targetIndex, 1, newMsg);
      setMsgs(db.messages); // 새로 만들어진 배열로 DB 수정 (writeDB)

      return newMsg; // (요청 성공 시) 수정한 메시지 반환
    },
    deleteMessage: (parent, { id, userId }, { db }) => {
      // const msgs = getMsgs();

      const targetIndex = db.messages.findIndex((msg) => msg.id === id); // 삭제할 메시지를 index로 가져옴

      // 삭제할 메시지가 없거나 사용자가 다른 경우 에러로 처리
      if (targetIndex < 0) throw '메시지가 없습니다.';
      if (db.messages[targetIndex].userId !== userId)
        throw '사용자가 다릅니다.';

      // messages DB 배열에서 targetIndex의 요소를 1개 삭제
      db.messages.splice(targetIndex, 1);
      setMsgs(db.messages); // 수정된 배열로 DB 수정

      return id; // (삭제 성공 시) 삭제한 id 반환
    },
  },

  // messageResolver 안에 다음처럼 추가 정보(유저 관련)를 넣을 수 있다.
  Message: {
    // user라는 필드에 db.users[msg.userId] 값 반환
    user: (msg, args, { db }) => db.users[msg.userId],
  },
};

export default messageResolver;
