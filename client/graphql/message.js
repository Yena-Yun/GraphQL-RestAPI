// graphql-tag: 클라 쪽에서 graphql 문법을 자바스크립트 문법으로 변환해주는 역할
import { gql } from 'graphql-tag';

// GraphQL playground에서 사용했던 문법 거의 그대로 사용
// 서버에 요청하는 형태 (= request 형식)
// 만약 timestamp를 삭제하면 서버에 요청할 때 'timestamp는 빼고 보내달라'는 의미가 됨
export const GET_MESSAGES = gql`
  query GET_MESSAGES {
    messages {
      id
      text
      userId
      timestamp
    }
  }
`;

export const GET_MESSAGE = gql`
  query GET_MESSAGES($id: ID!) {
    message(id: $id) {
      id
      text
      userId
      timestamp
    }
  }
`;

export const CREATE_MESSAGE = gql`
  mutation CREATE_MESSAGE($text: String!, $userId: ID!) {
    createMessage(text: $text, userId: $userId) {
      id
      text
      userId
      timestamp
    }
  }
`;

export const UPDATE_MESSAGE = gql`
  mutation UPDATE_MESSAGE($id: ID!, $text: String!, $userId: ID!) {
    updateMessage(id: $id, text: $text, userId: $userId) {
      id
      text
      userId
      timestamp
    }
  }
`;

// delete의 경우 서버에서 id만 넘어올 것이기 때문에 하나 뿐이라 굳이 객체로 요청 형식을 표시해줄 필요 없음
export const DELETE_MESSAGE = gql`
  mutation DELETE_MESSAGE($id: ID!, $userId: ID!) {
    deleteMessage(id: $id, userId: $userId)
  }
`;
