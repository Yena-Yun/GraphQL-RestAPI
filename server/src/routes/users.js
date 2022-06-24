// LowDB 사용하면 readDB 필요 없어짐 (Rest API에서만, GraphQL에서는 필요)
import { readDB } from '../dbController.js';
// import db from '../dbController.js';

// LowDB 사용하면 getUsers가 다음과 같이 교체됨 (Rest API)
const getUsers = () => readDB('users');
// const getUsers = () => {
//   // 먼저 db 전체를 읽어옴
//   db.read();
//   // lowDB는 한번 불러오면 DB 데이터가 캐싱되어 있음 => 데이터가 있을 때와 없을 때를 구분 (안전장치 걸기)
//   db.data = db.data || { users: {} }; // db.data가 없으면 users를 빈 객체로 설정
//   return db.data.users;
// };

const usersRoute = [
  {
    method: 'get',
    route: '/users',
    handler: (req, res) => {
      const users = getUsers();
      res.send(users);
    },
  },
  {
    method: 'get',
    route: '/users/:id',
    handler: ({ params: { id } }, res) => {
      // id를 직접 사용하므로 try/catch로 에러 핸들링
      try {
        const users = getUsers();

        const user = users[id]; // 배열인 messages와 달리 users는 객체여서 id로 바로 가져오기 가능
        // 가져올 사용자가 없는 경우 예외처리
        if (!user) throw Error('사용자가 없습니다.');

        res.send(user); // 클라에 찾은 사용자정보 반환
      } catch (err) {
        res.status(500).send({ error: err });
      }
    },
  },
];

export default usersRoute;
