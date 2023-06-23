const USER_LIST = [{ userId: 'kim' }, { userId: 'chae' }];

export default {
  Query: {
    allUsers: () => {
      return USER_LIST;
    },
  },
};
