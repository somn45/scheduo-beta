const USER_LIST = [{ name: 'kim' }, { name: 'chae' }];

export default {
  Query: {
    allUsers: () => {
      console.log('hello graphQL');
      return USER_LIST;
    },
  },
};
