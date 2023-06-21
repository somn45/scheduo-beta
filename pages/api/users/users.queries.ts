const USER_LIST = [{ userId: 'kim' }, { userId: 'chae' }];

export default {
  Query: {
    allUsers: () => {
      console.log('hello graphQL');
      return USER_LIST;
    },
  },
};
