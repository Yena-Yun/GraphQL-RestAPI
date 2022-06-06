import MsgList from '../components/MsgList';
import fetcher from '../fetcher';

const Home = ({ smsgs }) => (
  <>
    <h1>SIMPLE SNS</h1>
    <MsgList smsgs={smsgs} />
  </>
);

// 아래는 같은 index.js에 있으나 위의 Home 컴포넌트와는 별개의 로직
export const getServerSideProps = async () => {
  // smsgs = server msgs
  const smsgs = await fetcher('get', '/messages');

  // 여기서 props를 반환하면 다른 컴포넌트(Home)에서 smsgs를 props로 받아 사용할 수 있게 된다.
  return {
    props: { smsgs },
  };
};

export default Home;
