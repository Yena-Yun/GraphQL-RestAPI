import { gql } from 'apollo-server-express';

// gql: 문자열 안의 graphql 내용을 자바스크립트 언어로 치환해주는 역할
// 문자열 내부의 type 정의 - 타입스크립트의 타입과 다르게 GraphQL 자체에서 제공하는 타입 정의
// ID - graphQL 타입의 한 종류, '고유한' 값이어야 한다는 뜻
// ! - 각 value가 필수 값임을 명시 (Query에서의 cursor의 ID는 안 올 수도 있는 값이기 때문에 '!'가 붙지 않음)
// timestamp가 13자리인데, graphQL에서는 13자리의 숫자를 인식하지 못하므로 Float로 선언
// Query 내 1번째 messages의 [Message!]! - 'Message가 반드시 있어야 하고 이 Message는 배열로 이루어져 있는데 이 배열도 꼭 있어야 함'
// Query 내 2번째 messages - 메시지를 1개씩 조회할 때 = ID값 꼭 필요 (뒤에 !)
// Mutation = '변화를 일으키다' - 생성, 수정, 삭제 (Query는 변화 없이 '조회'만 하는 것)
const messageSchema = gql`
  type Message {
    id: ID!
    text: String!
    user: User!
    timestamp: Float
  }

  extend type Query {
    messages: [Message!]! # getMessages
    message(id: ID!): Message! # getMessage
  }

  extend type Mutation {
    createMessage(text: String!, userId: ID!): Message!
    updateMessage(id: ID!, text: String!, userId: ID!): Message!
    deleteMessage(id: ID!, userId: ID!): ID!
  }
`;

// messageSchema는 graphQL로 통신했을 때의 '응답값(response)'
// => 이런 응답값이 오도록 resolver를 정의해주면 됨
export default messageSchema;
