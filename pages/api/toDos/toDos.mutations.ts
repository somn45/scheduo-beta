import ToDoModel from '@/models/ToDo';
import { ToDo } from '@/pages/schedules/todos';
import { GraphQLScalarType } from 'graphql';

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value) {
    if (value instanceof Date) return value.getTime();
    throw Error('GraphQL Date Scalar serializer expected a `Date` object');
  },
  parseValue(value) {
    if (typeof value === 'number') return new Date(value);
    throw Error('GraphQL Date Scalar parser expected a `number`');
  },
  parseLiteral() {
    return null;
  },
});

export default {
  Date: dateScalar,
  Mutation: {
    addToDo: async (
      _: unknown,
      { content, registrant, registeredAt, state }: ToDo
    ) => {
      const registeredDate = new Date(registeredAt);
      await ToDoModel.create({
        content,
        registrant,
        registeredAt: registeredDate,
        state,
      });
      return { content, registrant, registeredAt: registeredDate, state };
    },
  },
};
