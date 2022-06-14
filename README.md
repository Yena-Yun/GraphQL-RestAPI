# GraphQL-RestAPI
인프런 풀스택 리액트 토이프로젝트 강의 (Next.js, GraphQL/RestAPI)

# 🍰 배운 내용
## 1. Client: 기본 기능 구현
1. Next.js 세팅 
2. 기본 message 관련 CRUD(생성, 조회, 수정, 삭제) 기능 구현

## 2. Server: 기본 DB 구현
3. express를 활용한 미니 DB 구현 -> messages 및 users data 관리

## 3. Client: REST API 통신 구현
4. 미니 로그인 기능 구현
   * userId가 url에 있을 때만 최상단의 input창 렌더링 (= 로그인 안 되면 메시지 생성 못하도록)
   * url에 지정된 userId의 메시지만 수정 및 삭제 가능 (= 로그인한 유저가 자신의 메시지만 수정 가능하도록)
5. axios 통신 관련 custom hook(fetcher.js) 작성하여 활용 <BR/> => fetcher 메서드를 MsgList의 각 CRUD 함수에 사용
6. routes 폴더 내용으로 관심사의 분리(SoC) <BR/> => 각 CRUD마다 axios에 들어갈 옵션을 따로 설정한 후 커스텀 훅(fetcher)을 입혀서 사용
7. Next.js의 useRouter 훅 사용 (query 객체를 통해 userId를 받아옴) 
8. props에 초기값 설정하는 법 <br/> => 자바스크립트 신(new)문법 / 예: { text = '', id = undefined }
9. 날짜 format 설정하기 <br/> => new Date로 date 객체로 변환 후 toLocaleString()의 옵션 활용
10. 무한스크롤 구현 <br/> => 처음에 모든 messages 데이터를 다 가져오지 않고 일부만 가져온 뒤 스크롤 위치에 따라 추가 fetch 하도록
11. 서버사이드렌더링 구현 <br/>
 => 처음에 받아오는 메시지가 서버쪽에서 렌더링 되도록 (첫 로딩 시 화면 깜박임 사라짐)

## 4. Server: GraphQL 구현
### Rest API와 비교한 GraphQL의 특징
* Rest API는 CRUD마다 각각 API URL이 달라짐 (Route 개념)
* GraphQL은 (예를 들면) '/graphql'이라는 API 하나로 CRUD API를 모두 처리 
  => resolvers가 Rest API에서의 routers 역할 담당
  
#### schema 정의
12. apollo-server-express 라이브러리의 gql 모듈을 통해 schema(graphQL 통신 시의 응답값) 설정
13. schema 폴더 내의 index.js에서 만든 스키마들과 index.js 내에서 정의한 linkSchema(default 스키마)를 모아 export
#### resolvers 정의
Rest API에서 사용한 routers 내용과 유사 <br/>
단, routers에서는 message와 user 각각 get/post/update/delete에 해당하는 axios의 옵션(method, route, handler)들을 <br/>
각 route마다 일일이 지정했지만 graphQL에서는 route는 /graphql 하나뿐이고 resolvers의 message 안에서<br/>
gql 모듈을 사용해 type 지정 후 get 내용은 Query, 그 외 post/update/delete 내용은 Mutation에 정의<br/>
=> 선언적으로 한 눈에 인수와 반환값을 알 수 있는 문법!

## 5. Client + Server: react-query 세팅, Rest API 코드를 GraphQL 코드로 바꾸기
* graphql-tag의 gql 모듈: client에서 GraphQL 문법을 자바스크립트 문법으로 변환
* client/graphql 경로에서 서버에 요청할 형태(request 형식) 정의하기
  * message.js: GET_MESSAGES, GET_MESSAGE, CREATE_MESSAGE, UPDATE_MESSAGE, DELETE_MESSAGE
  * user.js: GET_USERS, GET_USER

* _app.js에서 QueryClientProvider로 Component(프로젝트의 모든 컴포넌트)를 감싸고, <br/>
  ref에 QueryClient를 할당하는 getClient 함수를 client props에 할당
* 최상단 index.js에서는 기존의 fetcher 메서드의 인자인 method, url을 <br/>
  client/graphql 경로에서 gql로 형성한 request 형태(예: GET_MESSAGES)로 대체

[ 기존의 fetcher.js 변경사항 ]
* 파일명을 queryclient.js로 변경
* axios 대신 graphql-request의 request 모듈 사용
* 기존의 axios.defaults.baseURL 대신 대문자 URL 상수 선언 + 'http://localhost:8000' 뒤에 **/graphql** 경로 추가 <br/>
    => Rest API는 기본 url 뒤에 각각 CRUD에 맞는 서버를 호출할 경로를 매번 붙여주지만(/message, /user, /message/:id, ..), <br/>
       GraphQL은 '/graphql' 경로 하나로 모든 CRUD 호출을 처리
* axios 대신 request 모듈을 사용한 실행문으로 fetcher 함수 변경
