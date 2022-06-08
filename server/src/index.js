// express 앱을 띄우기 위한 모든 내용이 포함된 곳
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import messagesRoute from './routes/messages.js'; // 뒤에 .js 안 붙이면 에러 발생
import usersRoute from './routes/users.js'; // (마찬가지)

const app = express(); // express를 실행해서 app 객체 생성

// express.urlencoded: 미들웨어, extended 옵션 설정 필수
// extended가 false이면 Node.js에 기본 내장된 querystring 모듈 사용, true이면 추가로 설치 필요한 qs 모듈 사용
// apollo-server를 설치하면 아래 2줄이 필요 없어짐
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json()); // express에서 json 형태로 사용하겠다고 선언

// cors 설정 (클라와 충돌 안 나도록)
app.use(
  cors({
    origin: 'http://localhost:3000', // origin은 클라 주소로 설정
    credentials: true, // 클라를 믿는다(?)
  })
);

// graphQL 정의
const server = new ApolloServer({
  // 타입 정의
  typeDefs: schema,
  // resolver = Rest API에서의 라우팅 담당**
  resolvers,
  // context의 models = DB
  context: {
    models: {
      messages: '',
      users: '',
    },
  },
});

server.applyMiddleware({ app, path: '/graphql' });

// app 사용 기본형태
// app.get('/', (res, req) => {
//   ...
// })

// spread 문법: 배열(messagesRoute), 객체(usersRoute) 둘 다 적용 가능
const routes = [...messagesRoute, ...usersRoute];
routes.forEach(({ method, route, handler }) => {
  app[method](route, handler);
});

// 서버 포트는 8000으로 지정 (localhost:8000에서 확인)
app.listen(8000, () => {
  console.log('Server listening on 8000...');
});
