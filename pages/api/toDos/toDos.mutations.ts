import ToDoModel from '@/models/ToDo';
import { IToDo } from '@/pages/schedules/todos';
import { GraphQLError, GraphQLScalarType } from 'graphql';
import { Model } from 'mongoose';

export interface UpdateToDoProps {
  content: string;
  registrant: string;
  registeredAt: number;
}

export interface DeleteToDoProps {
  registrant: string;
  registeredAt: number;
}

export default {
  Mutation: {
    addToDo: async (
      _: unknown,
      { content, registrant, registeredAt, state }: IToDo
    ) => {
      await ToDoModel.create({
        content,
        registrant,
        registeredAt,
        state,
      });
      return { content, registrant, registeredAt, state };
    },
    updateToDo: async (
      _: unknown,
      { content, registrant, registeredAt }: UpdateToDoProps
    ) => {
      const toDo = await ToDoModel.findToDo(registrant, registeredAt);
      if (!toDo)
        throw new GraphQLError('toDo not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      toDo.content = content;
      toDo.isNew = true;
      await toDo.save();
      return toDo;
    },
    deleteToDo: async (
      _: unknown,
      { registrant, registeredAt }: DeleteToDoProps
    ) => {
      const toDo = await ToDoModel.deleteToDo(registrant, registeredAt);
      if (!toDo)
        throw new GraphQLError('toDo not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      return toDo;
    },
  },
};