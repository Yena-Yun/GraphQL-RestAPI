// express 앱을 띄우기 위한 모든 내용이 포함된 곳
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
// import cors from 'cors'; // 2021년 7월 GraphQL 업데이트로 인해 더 이상 사용 x
// import messagesRoute from './routes/messages.js'; // 뒤에 .js 안 붙이면 에러 발생
// import usersRoute from './routes/users.js'; // (마찬가지)
import resolvers from './resolvers/index.js';
import schema from './schema/index.js';

// lowDB 사용하면 readDB 내용 교체됨
// import { readDB } from './dbController.js'; // GraphQL의 경우 readDB를 여기서 가져옴!
import db from './dbController.js';

const readDB = () => {
  db.read();
  return db.data; // messages와 user 데이터가 모두 들어있음
};

// express.urlencoded: 미들웨어, extended 옵션 설정 필수
// extended가 false이면 Node.js에 기본 내장된 querystring 모듈 사용, true이면 추가로 설치 필요한 qs 모듈 사용
// apollo-server를 설치하면 아래 2줄이 필요 없어짐
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json()); // express에서 json 형태로 사용하겠다고 선언

// cors 설정 (클라와 충돌 안 나도록)
// 2021년 7월 GraphQL 업데이트 이후 - cors는 아래에서 server 호출 시 미들웨어의 옵션으로 처리해주게 됨
// app.use(
//   cors({
//     origin: 'http://localhost:3000', // origin은 클라 주소로 설정
//     credentials: true, // 클라를 믿는다(?)
//   })
// );

// graphQL 정의
const server = new ApolloServer({
  // 타입 정의
  typeDefs: schema,
  // resolver = Rest API에서의 라우팅 담당**
  resolvers,
  // context의 models = DB (Rest API에서의 readDB 부분)
  context: {
    // db: {
    //   messages: readDB('messages'),
    //   users: readDB('users'),
    // },
    models: readDB(), // 여기서 키를 db라고 하면 위에서 불러온 db와 헷갈려서 resolvers에서 문제가 될 수 있음 => models로 교체
  },
});

const app = express(); // express를 실행해서 app 객체 생성
await server.start();
server.applyMiddleware({
  app,
  path: '/graphql',
  cors: {
    origin: ['http://localhost:3000', 'https://studio.apollographql.com'], // origin은 클라 주소로 설정
    credentials: true, // 클라를 믿는다(?)
  },
});

// app 사용 기본형태
// app.get('/', (res, req) => {
//   ...
// })

// spread 문법: 배열(messagesRoute), 객체(usersRoute) 둘 다 적용 가능
// const routes = [...messagesRoute, ...usersRoute];
// routes.forEach(({ method, route, handler }) => {
//   app[method](route, handler);
// });

// 서버 포트는 8000으로 지정 (localhost:8000에서 확인)
// app.listen(8000, () => {
//   console.log('Server listening on 8000...');
// });

// 2021년 7월 업데이트 이후 await 사용 가능해짐 - listen이 완료가 되었을 때 비로소 다음 줄을 실행
await app.listen({ port: 8000 });
console.log('Server listening on 8000...');
