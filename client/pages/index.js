import MsgList from '../components/MsgList';
// import { fetcher } from '../fetcher';
import { fetcher } from '../queryClient';
import { GET_MESSAGES } from '../graphql/message';
import { GET_USERS } from '../graphql/user';

const Home = ({ smsgs, users }) => {
  return (
    <div>
      <h1>SIMPLE SNS</h1>
      <MsgList smsgs={smsgs} users={users} />
    </div>
  );
};

// 아래는 같은 index.js에 있으나 위의 Home 컴포넌트와는 별개의 로직
export const getServerSideProps = async () => {
  // const { messages: smsgs } = await fetcher(GET_MESSAGES);
  // const { users } = await fetcher(GET_USERS);

  // 위의 구조는 await로 인해 첫 번째 fetcher의 실행이 완료되어야 다음 fetcher로 넘어가는 직렬 구조(동기적) 방식이다.
  // 유의미하지는 않지만 어쨌거나 이론적으로 더 느려질 수 있는 구조이므로 Promise.all을 사용하여 다음과 같이 변경
  // => fetcher 요청을 둘 다 보내고, 응답이 messages와 users 모두 올 때까지 기다렸다가 다음 코드(return문) 실행
  const [{ messages: smsgs }, { users }] = await Promise.all([
    fetcher(GET_MESSAGES),
    fetcher(GET_USERS),
  ]);

  // 여기서 반환된 props는 다른 모든 컴포넌트(예: Home, MsgList)에서 사용 가능
  return {
    props: { smsgs, users },
  };
};

export default Home;
