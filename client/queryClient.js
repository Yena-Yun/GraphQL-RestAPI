// import axios from 'axios';
import { request } from 'graphql-request';

// axios.defaults.baseURL = 'http://localhost:8000';
const URL = 'http://localhost:8000/graphql';

/**
 * baseURL을 지정하면
 * axios.get('http://localhost:8000/messages')를
 * axios.get('/messages')로 축약 가능
 */

// axios를 편하게 쓰기 위해 임의로 생성한 함수
// ...rest => method가 post나 put인 경우 업데이트나 수정에 필요한 data(text, userId 등)가 필요하지만 get, delete에서는 이러한 정보가 필요 없음
// => data처럼 있을 수도 없을 수도 있는 값을 처리하기 위해 ...rest 사용
// const fetcher = async (method, url, ...rest) => {
//   const res = await axios[method](url, ...rest);
//   return res.data;
// };

// react-query를 붙이면서 위의 fetcher 내용 아예 갈아엎음
export const fetcher = (query, variables = {}) =>
  request(URL, query, variables);

// useQuery 사용 시 특정 기점을 기준으로 불러오는 QueryKeys 필요 (여기에 상수로 정의해놓음)
export const QueryKeys = {
  MESSAGES: 'MESSAGES',
  MESSAGE: 'MESSAGE',
  USERS: 'USERS',
  USER: 'USER',
};

/**
 * get: axios.get(url[, config])
 * delete: axios.delete(url[, config])
 * post: axios.post(url, data[, config])
 * put: axios.put(url, data[, config])
 */

// export default fetcher;
