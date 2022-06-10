import { gql } from 'apollo-server-express';

// users의 반환값 User의 경우, DB의 users.json에서 전체 유저가 객체에 담겨 있지만 GraphQL에서 객체를 반환하는 방법은 없어서 우선 배열로 반환 (나중에 resolver에서 객체로 바꿔주게 됨)
const userSchema = gql`
  type User {
    id: ID!
    nickname: String!
  }

  extend type Query {
    users: [User!]!
    user(id: ID!): User
  }
`;

export default userSchema;
