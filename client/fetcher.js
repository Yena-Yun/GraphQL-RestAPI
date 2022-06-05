import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000';

/**
 * baseURL을 지정하면
 * axios.get('http://localhost:8000/messages')를
 * axios.get('/messages')로 축약 가능
 */

// axios를 편하게 쓰기 위해 임의로 생성한 함수
// ...rest => method가 post나 put인 경우 업데이트나 수정에 필요한 data(text, userId 등)가 필요하지만 get, delete에서는 이러한 정보가 필요 없음
// => data처럼 있을 수도 없을 수도 있는 값을 처리하기 위해 ...rest 사용
const fetcher = async (method, url, ...rest) => {
  const res = await axios[method](url, ...rest);
  return res.data;
};

/**
 * get: axios.get(url[, config])
 * delete: axios.delete(url[, config])
 * post: axios.post(url, data[, config])
 * put: axios.put(url, data[, config])
 */

export default fetcher;
