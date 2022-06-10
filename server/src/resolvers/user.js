// Rest API에서의 route 폴더의 users.js의 역할과 거의 비슷

const userResolver = {
  Query: {
    users: (parent, args, { db }) => Object.values(db.users),
    user: (parent, { id }, { db }) => db.users[id],
  },
};

export default userResolver;
