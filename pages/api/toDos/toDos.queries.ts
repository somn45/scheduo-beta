import ToDoModel from '@/models/ToDo';
import { UserId } from '../cookies/cookies.mutations';
import { ContextValue } from '../users/users.mutations';

export default {
  Query: {
    getToDos: async () => {
      const todos = await ToDoModel.find();
      return todos;
    },
  },
};
