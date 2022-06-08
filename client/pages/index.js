import MsgList from '../components/MsgList';
import fetcher from '../fetcher';

const Home = ({ smsgs, users }) => (
  <>
    <h1>SIMPLE SNS</h1>
    <MsgList smsgs={smsgs} users={users} />
  </>
);

// 아래는 같은 index.js에 있으나 위의 Home 컴포넌트와는 별개의 로직
export const getServerSideProps = async () => {
  // smsgs = server msgs
  const smsgs = await fetcher('get', '/messages');
  const users = await fetcher('get', '/users');

  // 여기서 반환된 props는 다른 모든 컴포넌트(예: Home, MsgList)에서 사용 가능
  return {
    props: { smsgs, users },
  };
};

export default Home;
