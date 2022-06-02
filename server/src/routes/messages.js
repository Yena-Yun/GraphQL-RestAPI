import { readDB } from '../dbController.js'; // 뒤에 .js 붙여줘야
import { v4 } from 'uuid';

const getMsgs = () => readDB('messages');
const setMsgs = (data) => writeDB('messages', data);

const messagesRoute = [
  {
    // GET MESSAGES
    method: 'get',
    route: '/messages',
    handler: (req, res) => {
      const msgs = getMsgs();
      res.send(msgs); // res.send: 클라이언트(브라우저)에 값 반환
    },
  },
  {
    // GET MESSAGE (메시지 하나만 가져오는 경우)
    method: 'get',
    route: '/messages/:id',
    // req 안에 body, params, query가 있음 - 그 중에 여기서는 params만 사용
    handler: ({ params: { id } }, res) => {
      // id를 직접 사용할 때는 클라이언트와 서버 간에 id 싱크가 안 맞을 경우 에러 발생 가능 => try/catch 처리
      try {
        const msgs = getMsgs();

        const msg = msgs.find((m) => m.id === id); // '값'을 찾아야 하므로 find
        // 찾는 메시지가 없는 경우 예외처리
        if (!msg) throw Error('Not Found');

        res.send(msg); // 클라에 찾은 메시지 반환
      } catch (err) {
        // 이 경우에는 메시지를 찾지 못한 경우 하나에만 에러가 발생하므로 404로 처리
        res.status(404).send({ error: err });
        // ** url에 ~/messages/45 이런 식으로 특정 메시지를 가져올 때
        // url의 45는 문자열인 반면, DB json 파일의 id가 숫자라면 타입 정합성이 맞지 않아 못 가져옴(404 에러 발생)
        // => db의 id 값을 모두 문자열로 바꿔주면 해결
      }
    },
  },
  {
    // CREATE MESSAGE
    method: 'post',
    route: '/messages',
    // req 안에 body, params, query가 있음 - 그 중에 여기서는 body만 사용
    handler: ({ body }, res) => {
      const msgs = getMsgs();

      const newMsg = {
        id: v4(), // (= 'v4 버전의 unique한 id 생성')
        userId: body.userId,
        timestamp: Date.now(),
        text: body.text,
      };

      msgs.unshift(newMsg); // 원본 배열 맨 앞에 추가 (직접 수정)
      setMsgs(msgs); // 추가된 msgs로 DB 수정 (setMsgs === writeDB)

      res.send(newMsg); // 클라에 새로 만든 메시지 반환 (=> 요청 성공 시 새로 만든 메시지 반환)
    },
  },
  {
    // UPDATE MESSAGE
    method: 'put',
    route: '/messages/:id',
    handler: ({ body, params: { id } }, res) => {
      // id를 직접 사용할 때는 클라이언트와 서버 간에 id 싱크가 안 맞을 경우 에러 발생 가능 => try/catch 처리
      try {
        const msgs = getMsgs();

        const targetIndex = msgs.findIndex((msg) => msg.id === id); // '인덱스'를 찾아야 하므로 findIndex
        // 수정할 메시지가 없거나 사용자가 다를 경우 예외처리
        if (targetIndex < 0) throw '메시지가 없습니다.';
        if (msgs[targetIndex].userId !== body.userId)
          throw '사용자가 다릅니다.';

        // 위의 경우를 모두 통과한 경우에 한해서 새로운 메시지를 생성
        // (처음에 내가 짠 코드)
        // const newMsg = {
        //   id,
        //   userId: body.userId,
        //   timestamp: body.timestamp,
        //   text: body.text,
        // };

        // 기존의 내용 그대로 넣고 text만 바꿔준다. (spread 활용)
        const newMsg = { ...msgs[targetIndex], text: body.text };
        msgs.splice(targetIndex, 1, newMsg);
        setMsgs(msgs); // 수정된 메시지가 포함된 msgs 배열로 DB 수정

        res.send(newMsg); // 클라에 수정한 메시지 반환
      } catch (err) {
        // 에러가 있을 경우 status를 500으로 지정해주고 send로 에러메시지 띄움
        res.status(500).send({ error: err });
      }
    },
  },
  {
    // DELETE MESSAGE
    method: 'delete',
    route: '/messages/:id',
    handler: ({ body, params: { id } }, res) => {
      // id를 직접 사용할 때는 클라이언트와 서버 간에 id 싱크가 안 맞을 경우 에러 발생 가능 => try/catch 처리
      try {
        const msgs = getMsgs();

        const targetIndex = msgs.findIndex((msg) => msg.id === id); // 삭제할 메시지를 index로 가져옴
        // 삭제할 메시지가 없거나 사용자가 다른 경우 예외처리
        if (targetIndex < 0) throw '메시지가 없습니다.';
        if (msgs[targetIndex].userId !== body.userId)
          throw '사용자가 다릅니다.';

        msgs.splice(targetIndex, 1);
        setMsgs(msgs); // 특정 메시지가 삭제된 msgs 배열로 DB 수정

        res.send(id); // 삭제 성공 시 클라이언트에 삭제한 id만 넘겨줌
      } catch (err) {
        // 에러가 있을 경우 status를 500으로 지정해주고 send로 에러메시지 띄움
        res.status(500).send({ error: err });
      }
    },
  },
];

export default messagesRoute;
