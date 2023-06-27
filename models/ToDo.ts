import { Model, Schema, model, models } from 'mongoose';

interface DBToDo {
  content: string;
  registrant: string;
  registeredAt: Date;
  state: string;
}

interface DBToDoModel extends Model<DBToDo> {}

const toDoSchema = new Schema({
  content: String,
  registrant: String,
  registeredAt: Date,
  state: String,
});

const ToDoModel =
  models.ToDo<DBToDo> || model<DBToDo, DBToDoModel>('ToDo', toDoSchema);

export default ToDoModel;
