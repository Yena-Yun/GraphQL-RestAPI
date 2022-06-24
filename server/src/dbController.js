// Node.js는 기본적으로 require 문법 사용
// => Node.js에서 ES6의 import 문법 사용하려면 package.json에 "type": "module" 한줄 추가
// import fs from 'fs'; // Node.js에서 제공하는 파일시스템이 모여있는 곳
// import { resolve } from 'path'; // 마찬가지로 Node.js에서 제공, 경로 설정을 수정하기 위함

// 위의 2줄을 lowDB가 대체
import { LowSync, JSONFileSync } from 'lowdb';

// db 폴더의 messages.json과 users.json을 src의 db.json에 한데 묶음 (객체 안에 각각 messages, users 프로퍼티 선언하고 value에 붙여넣음)
const adapter = new JSONFileSync('./src/db.json');
// JSONFileSync 객체(db.json)를 LowSync 객체에 넣어 db 생성
const db = new LowSync(adapter);

export default db;

// LowDB를 쓰면 아래 내용 필요없어짐
// const basePath = resolve(); // 현재 경로 가져오기

// // DB 객체 (파일이름)
// const filenames = {
//   messages: resolve(basePath, 'src/db/messages.json'),
//   users: resolve(basePath, 'src/db/users.json'),
// };

// // DB 조회하기 (target: 어느 DB 파일을 읽을지 결정)
// export const readDB = (target) => {
//   try {
//     // JSON.parse: 읽어온 DB 내용(문자열)을 브라우저가 해석 가능한 자바스크립트 객체로 바꿈
//     return JSON.parse(fs.readFileSync(filenames[target], 'utf-8')); // 읽어올 때 인코딩 명시해주지 않으면 깨져보일 수 있음
//   } catch (err) {
//     console.error(err);
//   }
// };

// // DB 수정하기 (data: 특정 DB 파일에 덮어쓸 새로운 데이터)
// export const writeDB = (target, data) => {
//   try {
//     // DB를 읽어올 필요는 없고(인코딩, JSON.parse 필요 x) 직접 접근해서 바로 수정
//     // JSON.stringify: 새로운 data를 json 파일에 병합할 수 있도록 문자열화
//     return fs.writeFileSync(filenames[target], JSON.stringify(data));
//   } catch (err) {
//     console.error(err);
//   }
// };
