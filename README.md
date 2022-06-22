# GraphQL-RestAPI
인프런 풀스택 리액트 토이프로젝트 강의 (Next.js, GraphQL/RestAPI)

# 🍰 배운 내용
## 1. Client: 기본 기능 구현
1. Next.js 세팅 
2. 기본 message 관련 CRUD(생성, 조회, 수정, 삭제) 기능 구현

## 2. Server: 기본 DB 구현
3. express를 활용한 미니 DB 구현 -> messages 및 users 데이터 관리

## 3. Client: REST API 통신 구현
4. 미니 로그인 구현
   * userId가 url에 포함되어 있을 때만 최상단의 input창 렌더링 (= 로그인 안 되면 메시지 추가 못하도록)
   * url에 포함된 userId(= 로그인한 유저)의 메시지만 수정 및 삭제되도록
5. axios 통신과 관련된 커스텀 훅(fetcher.js)을 작성하여 MsgList의 각 CRUD 함수에 사용
7. routes 폴더로 관심사 분리(SoC) <BR/> => 각 CRUD마다 axios에 들어갈 옵션을 따로 설정한 후 커스텀 훅(fetcher)을 입혀서 사용
8. Next.js의 useRouter 훅 사용 (=> query 객체를 통해 userId를 받아옴) 
9. ** props에 바로 초기값 설정하기 (JS new문법) <br/> 예: { text = ' ', id = undefined }
10. 날짜 format 설정 <br/> => new Date로 date 객체로 변환 후 toLocaleString()의 옵션 활용 <BR/>

  <img src="https://user-images.githubusercontent.com/68722179/174944821-134e9838-f2d1-4d0f-b432-d3d0be2b2b89.png" width="400" />

12. 무한스크롤 구현 <br/> => 처음에 모든 messages 데이터를 다 가져오지 않고 일부만 가져온 뒤 스크롤 위치에 따라 추가 fetch 하도록
13. 서버사이드렌더링 구현 <br/>
 => 처음에 받아오는 메시지가 서버쪽에서 렌더링 되도록 (=> 첫 로딩 시 화면 깜박임이 사라진다)

## 4. Server: GraphQL 구현
### Rest API vs. GraphQL
* Rest API는 CRUD마다 각각 API URL이 달라진다.
* GraphQL은 '/graphql'이라는 API 하나로 CRUD의 API를 모두 처리한다. (resolvers = Rest API의 router)
  
### schema 정의
12. apollo-server-express의 gql 모듈을 통해 schema(= graphQL 통신 시의 응답값 형태) 설정
13. schema 폴더의 index.js - 생성된 schema들과 linkSchema(default 스키마)를 한데 모아 export하는 역할

### resolvers 정의
GraphQL의 resolvers는 Rest API의 routers와 유사<br/>
단, Rest API에서는 message와 user 각각 get/post/update/delete에 해당하는 axios의 옵션(method, route, handler)들을<br/> 
각 route마다 일일이 지정하지만, GraphQL에서 route 경로는 '/graphql' 하나뿐
* GraphQL은 **gql 모듈**을 사용하여 type을 지정한 후, get은 Query에 나머지 post/update/delete는 Mutation에 정의<br/><BR/>
=> GraphQL이 Rest API보다 선언적으로 한 눈에 인수와 반환값을 알 수 있음

## 5. Client + Server: react-query 세팅, Rest API 코드를 GraphQL 코드로 바꾸기
* Server에서는 apollo-server-express의 gql 모듈을 사용하지만 Client에서는 graphql-tag의 gql 모듈 사용
  <br/>: client에서 GraphQL 문법을 JS 문법으로 변환
* client/graphql - graphQL 통신 시의 요청 형태 정의하기
  * message.js: GET_MESSAGES, GET_MESSAGE, CREATE_MESSAGE, UPDATE_MESSAGE, DELETE_MESSAGE
  * user.js: GET_USERS, GET_USER

* _app.js - QueryClientProvider로 Component(프로젝트의 모든 컴포넌트)를 감싸고, client props에 getClient 함수 할당 <br/>

  <img src="https://user-images.githubusercontent.com/68722179/174946983-74a71847-2a01-45aa-8edd-7c07af8f0e2e.png" width="400" />

  <img src="https://user-images.githubusercontent.com/68722179/174947032-3021b6bf-b01a-47dc-8d6c-a2dfa7c0aa96.png" width="700" />


* 최상단 index.js - 기존의 fetcher 메서드의 인자인 method, url을 <br/>client/graphql에서 gql 모듈로 형성한 요청 형식(예: GET_MESSAGES)으로 대체

[ 기존의 fetcher.js에서 변경된 사항 ]
* 파일명을 queryclient.js로 변경
* axios 대신 graphql-request의 request 모듈 사용
* baseURL('http://localhost:8000 ') 을 기존의 axios.defaults.baseURL 대신, 상수로 선언 후에 뒤에 **/graphql** 경로 추가 <br/>
    => Rest API는 기본 url 뒤에 각각 CRUD에 맞는 서버를 호출할 경로를 매번 붙여주지만(/message, /user, /message/:id, ..), <br/>
       GraphQL은 '/graphql' 경로 하나로 모든 CRUD 호출을 처리
