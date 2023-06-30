import { Model, Schema, model, models } from 'mongoose';

interface DBToDo {
  content: string;
  registrant: string;
  registeredAt: number;
  state: string;
}

export interface DBToDoModel extends Model<DBToDo> {}

const toDoSchema = new Schema({
  content: String,
  registrant: String,
  registeredAt: Number,
  state: String,
});

const ToDoModel =
  models.ToDo<DBToDo> || model<DBToDo, DBToDoModel>('ToDo', toDoSchema);

export default ToDoModel;
