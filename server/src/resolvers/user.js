// Rest API에서의 route 폴더의 users.js의 역할과 거의 비슷

// lowDB 사용 시 db를 models로 바꿈 (=> index.js의 context 내용대로)
const userResolver = {
  Query: {
    users: (parent, args, { models }) => Object.values(models.users),
    user: (parent, { id }, { models }) => models.users[id],
  },
};

export default userResolver;
