import { readDB } from '../dbController.js';

const getUsers = () => readDB('users');

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
