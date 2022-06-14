import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from 'react-query';
import MsgInput from './MsgInput';
import MsgItem from './MsgItem';
// import fetcher from '../fetcher';
import { fetcher, QueryKeys } from '../queryClient';
import {
  GET_MESSAGES,
  CREATE_MESSAGE,
  UPDATE_MESSAGE,
  DELETE_MESSAGE,
} from '../graphql/message';
import useInfiniteScroll from '../hooks/useInfiniteScroll';

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

const MsgList = ({ smsgs, users }) => {
  // _app.js의 QueryClientProvider로 내려보낸 client를 전달받음
  // (QueryClientProvider로 감싸져 있는 컴포넌트에서는 다 받을 수 있음)
  const client = useQueryClient();

  // const {
  //   query: { userId = '' },
  // } = useRouter();
  // (Window) URL query의 userId가 대문자(userId)이든 소문자(userid)이든 상관없이 적용되도록
  const { query } = useRouter();
  const userId = query.userId || query.userid || '';

  // const [msgs, setMsgs] = useState(originalMsgs);
  const [msgs, setMsgs] = useState(smsgs);
  const [editingId, setEditingId] = useState(null);
  // const { userId } = query;

  // 무한스크롤
  const fetchMoreEl = useRef(null);
  // fetchMoreEl가 화면상에 노출되면 intersecting 상태를 true로 변경 (useInfiniteScroll의 반환값(boolean)에 의해)
  const intersecting = useInfiniteScroll(fetchMoreEl);

  const { mutate: onCreate } = useMutation(
    ({ text }) => fetcher(CREATE_MESSAGE, { text, userId }),
    {
      onSuccess: ({ createMessage }) => {
        // 기존 데이터(old)를 받아서 새로운 데이터를 넘겨준다.
        client.setQueryData(QueryKeys.MESSAGES, (old) => {
          return {
            // 여기 배열의 순서 중요! (createMessage가 2번째에 있으면 새로운 메시지 추가 시 새로고침해야 화면에 반영됨)
            messages: [createMessage, ...old.messages],
          };
        });
      },
    }
  );

  // // useEffect 내부가 아니면 async 바로 사용 가능
  // const onCreate = async (text) => {
  //   const newMsg = await fetcher('post', '/messages', { text, userId });
  //   // 예외처리: newMsg(서버로부터 받아온 data가 없다면 에러 메시지를 띄우도록)
  //   if (!newMsg) throw Error('새 메시지를 생성하지 못했습니다.');

  //   // const newMsg = {
  //   //   id: msgs.length + 1,
  //   //   userId: getRandomUserId(),
  //   //   timestamp: Date.now(),
  //   //   text: `${msgs.length + 1} ${text}`,
  //   // };

  //   setMsgs((msgs) => [newMsg, ...msgs]);
  // };

  const { mutate: onUpdate } = useMutation(
    ({ text, id }) => fetcher(UPDATE_MESSAGE, { text, id, userId }),
    {
      onSuccess: ({ updateMessage }) => {
        client.setQueryData(QueryKeys.MESSAGES, (old) => {
          const targetIndex = old.messages.findIndex(
            (msg) => msg.id === updateMessage.id
          );
          // targetIndex가 없을 수도 있음('-1') => 아무 것도 안 하고 msgs 배열 그대로 반환
          if (targetIndex < 0) return old;

          // otherwise msgs 배열에 새 메시지 추가하기 (수정)
          const newMsgs = [...old.messages]; // 기존 배열 복사 (사본 만들기)
          // 사본을 조작
          newMsgs.splice(targetIndex, 1, updateMessage);
          // newMsgs.splice(targetIndex, 1, {
          //   ...msgs[targetIndex], // 기존 targetIndex의 내용 그대로 가져오고,
          //   text, // text만 새 걸로 넣어줌
          // });
          return { messages: newMsgs };
        });

        //   // update가 끝나면 MsgInput 렌더링을 멈춤 (editingId를 null로 변경)
        setEditingId(null);
      },
    }
  );

  // const onUpdate = async (text, id) => {
  //   const newMsg = await fetcher('put', `/messages/${id}`, {
  //     text,
  //     userId,
  //     ...rest,
  //   });
  //   // 예외처리: newMsg(서버로부터 받아온 data가 없다면 에러 메시지를 띄우도록)
  //   if (!newMsg) throw Error('메시지를 수정하지 못했습니다.');

  //   // state 안에서 기존 msgs를 받아오게 함 => 좀 더 안정적으로 state 수정
  //   // Array.findIndex: 배열을 돌면서 조건에 해당하는 첫번째 값의 index를 반환
  //   setMsgs((msgs) => {
  //     const targetIndex = msgs.findIndex((msg) => msg.id === id);

  //     // targetIndex가 없을 수도 있음('-1') => 아무 것도 안 하고 msgs 배열 그대로 반환
  //     if (targetIndex < 0) return msgs;

  //     // otherwise msgs 배열에 새 메시지 추가하기 (수정)
  //     const newMsgs = [...msgs]; // 기존 배열 복사 (사본 만들기)
  //     // 사본을 조작
  //     newMsgs.splice(targetIndex, 1, newMsg);
  //     // newMsgs.splice(targetIndex, 1, {
  //     //   ...msgs[targetIndex], // 기존 targetIndex의 내용 그대로 가져오고,
  //     //   text, // text만 새 걸로 넣어줌
  //     // });
  //     return newMsgs;
  //   });

  //   // update가 끝나면 MsgInput 렌더링을 멈춤 (editingId를 null로 변경)
  //   setEditingId(null);
  // };

  const { mutate: onDelete } = useMutation(
    (id) => fetcher(DELETE_MESSAGE, { id, userId }),
    {
      // 'deleteMessage: deletedId' => 사용할 변수에 이곳 스코프에서만 사용할 별칭(alias)를 붙일 수 있다.
      onSuccess: ({ deleteMessage: deletedId }) => {
        client.setQueryData(QueryKeys.MESSAGES, (old) => {
          const targetIndex = old.messages.findIndex(
            (msg) => msg.id === deletedId
          );
          // targetIndex가 없을 수도 있음('-1') => 아무 것도 안 하고 msgs 배열 그대로 반환
          if (targetIndex < 0) return old;

          // otherwise msgs 배열에 새 메시지 추가하기 (수정)
          const newMsgs = [...old.messages]; // 기존 배열 복사 (사본 만들기)
          // 사본을 조작
          newMsgs.splice(targetIndex, 1);
          // newMsgs.splice(targetIndex, 1, {
          //   ...msgs[targetIndex], // 기존 targetIndex의 내용 그대로 가져오고,
          //   text, // text만 새 걸로 넣어줌
          // });
          return { messages: newMsgs };
        });
      },
    }
  );

  // const onDelete = async (id) => {
  //   const receivedId = await fetcher('delete', `/messages/${id}`, {
  //     params: { userId },
  //   });

  //   // 삭제 시 network에는 삭제한 메시지의 id가 잘 뜨는데 뷰에서는 안 사라질 경우
  //   // => 뷰에 반영이 안 되는 것 => msgs 배열에 넣어주는 과정에서 문제가 있음
  //   // console.log(typeof receivedId, typeof id); // number string (둘이 타입이 다름)

  //   setMsgs((msgs) => {
  //     const targetIndex = msgs.findIndex(
  //       (msg) => msg.id === String(receivedId) // 한쪽의 타입을 맞춰준다.
  //     );

  //     if (targetIndex < 0) return msgs;

  //     // msgs 배열에서 특정 메시지 삭제하기
  //     const newMsgs = [...msgs]; // 기존 배열 복사 (사본 만들기)
  //     // 사본을 조작
  //     newMsgs.splice(targetIndex, 1);
  //     return newMsgs;
  //   });
  // };

  // const onDelete = (id) => setMsgs([...msgs.filter((msg) => msg.id !== id)]);

  // Rest API의 단점: 사용자가 직접 서버로의 API를 호출하는 명령을 직접 구현해놓고,
  // 어떤 상황에 처할 때마다 호출하게끔 작성을 해줘야 함
  // GraphQL에서 제공하는 여러 가지 서드파티 라이브러리들(Apollo, react-query, swr 등)은 훅을 이용한다.
  // 예를 들어 react-query의 useQuery라는 훅을 사용하면
  // 적절한 시점에 어떤 변수가 변경되었을 때 알아서 서버로의 API를 호출
  // (useQuery 내부의 variables의 값이 변하면 그 때마다 새로 호출 == useEffect를 사용하는 느낌과 비슷하게 작성)

  // react-query에서 불러온 useQuery(GraphQL)를 아래의 getMessages(Rest API) 대신 사용!
  // useQuery에 커서 올리면 'UseQueryResult'라는 값을 반환함을 알 수 있음
  // GET_MESSAGES를 fetcher로 호출할 때 함수(() => )로 호출해야 하는 이유: 함수로 호출 안 하면 fetcher 함수가 필요할 때 그때그때 호출되지 않고 바로 호출되어 버리기 때문
  // => 완성된 함수(() => fetcher(GET_MESSAGES))가 와야지, 함수의 결과(fetcher(GET_MESSAGES))가 오면 안 됨
  // const { data, error, isError } = useQuery(QueryKeys.MESSAGES, () =>
  //   fetcher(GET_MESSAGES)
  // );

  // 무한스크롤을 위해 위의 useQuery 대신 useInfiniteQuery 사용
  const { data, error, isError, fetchNextPage, hasNextPage } = useInfiniteQuery(
    QueryKeys.MESSAGES,
    ({ pageParam = '' }) => fetcher(GET_MESSAGES, { cursor: pageParam }),
    {
      getNextPageParam: ({ messages }) => {
        return messages?.[messages.length - 1]?.id;
      },
    }
  );

  // 요청 전에는 클라이언트에 원래 있던 서버의 데이터(state, '옛 것')를 먼저 쓰고,
  // 이후에 서버에서 새로운 정보가 오면 기존의 데이터(messages 배열의 정보)와 비교
  // => 비교해서 다른 점이 있다면 새 것으로 갈아치우고, 변경이 없으면 기존의 것(stale)을 그대로 씀
  // 서버에서 가져온 정보가 이미 캐시에 담겨 있는 상황에서, 클라이언트에 접속하자마자 서버에 다시 요청할 때 캐시 정보를 활용해서 서로 비교한 후 새로 요청된 데이터에서 변경사항이 없으면 기존의 데이터 그대로 사용
  useEffect(() => {
    // useEffect의 특성상 맨 처음에는 무조건 1번 호출되고, 이후에는 data.messages가 변경될 때마다 호출 => 처음에 호출되는 것 때문에 아래가 2번 호출됨
    // => 2번 호출되는 상황 방지 (data?.messages가 없으면 아래 내용을 실행하지 않게 함)
    // if (!data?.messages) return;

    // react-query 이후 윗줄 변경
    if (!data?.pages) return;

    console.log('msgs changed'); // 페이지에 들어가자마자 2번 호출됨을 알 수 있다.

    // setMsgs(data?.messages || []);
    // 위에서 if문으로 한번 걸러주면 여기부터는 data.messages가 무조건 있는 상황이므로 다음처럼 작성해도 된다.
    // setMsgs(data.messages);

    // react-query 이후 윗줄 변경
    // data.pages는 키가 messages인 여러 배열을 하나로 합친 것
    // const data.pages = [ { messages: [...] }, { messages: [...] } ] => [...]
    // flatMap: depth 1단계에 대한 내용들을 하나로 합쳐줌
    const mergedMsgs = data.pages.flatMap((d) => d.messages);
    console.log({ mergedMsgs });
    setMsgs(mergedMsgs);
  }, [data?.pages]); // data.messages를 확인하여 변경사항이 있을 때만 내부문 실행

  if (isError) {
    console.error(error);
    return null;
  }

  // // useEffect 내에서는 async/await를 직접 호출하지 않도록 권장 => 함수를 별도로 만들고 해당 함수를 useEffect 내에서 호출
  // const getMessages = async () => {
  //   // 무한스크롤 인식
  //   // => params의 cursor 키에 msgs 배열의 맨 마지막 msg의 id값을 넘겨줌 (해당 msg가 있을 때만 || 아니면 cursor에 빈 문자열('') 반환)
  //   // (처음에는 마지막 msg가 없기 때문에 ''이 반환됨)
  //   const newMsgs = await fetcher('get', '/messages', {
  //     params: { cursor: msgs[msgs.length - 1]?.id || '' },
  //   });
  //   setMsgs([...msgs, ...newMsgs]);
  // };

  // // 최초에 한 번 getMessages 실행
  // useEffect(() => {
  //   getMessages();
  // }, []);

  // 이후 intersecting(= useInfiniteScroll의 반환값)이 true이면 getMessages 다시 호출 (=== 무한스크롤)
  useEffect(() => {
    // if (intersecting) getMessages(); // Rest API에서 사용
    if (intersecting && hasNextPage) fetchNextPage(); // GraphQL + react-query의 useInfiniteQuery 사용
  }, [intersecting, hasNextPage]);

  return (
    <>
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
            user={users.find((x) => userId === x.id)}
          />
        ))}
      </ul>
      <div ref={fetchMoreEl} />
    </>
  );
};

export default MsgList;
