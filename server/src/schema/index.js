import { gql } from 'apollo-server-express';
import messageSchema from './message.js';
import userSchema from './user.js';

// default 스키마
// 미리 여기서 Query와 Mutation 타입 정의 '틀'을 만들어놓고 messageSchema와 userSchema에서는 'extend'라는 키워드를 통해 override(상속받아) 사용
const linkSchema = gql`
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
`;

// index.js의 역할: 위의 linkSchema와 함께 schema 폴더 내의 다른 스키마들을 모아서 한 번에 export 하는 역할
export default [linkSchema, messageSchema, userSchema];
