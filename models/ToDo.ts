import db from '@/pages/api/db';
import { Model, Schema, Document, models } from 'mongoose';

interface DBToDo {
  content: string;
  registrant: string;
  registeredAt: number;
  state: string;
}

interface DBToDoDocument extends DBToDo, Document {}

interface DBToDoModel extends Model<DBToDoDocument> {
  findAllToDos: () => Promise<DBToDoDocument>;
  findToDo: (
    registrant: string,
    registeredAt: number
  ) => Promise<DBToDoDocument>;
  deleteToDo: (
    registrant: string,
    registeredAt: number
  ) => Promise<DBToDoDocument>;
}

const toDoSchema: Schema<DBToDoDocument> = new Schema({
  content: String,
  registrant: String,
  registeredAt: Number,
  state: String,
});

toDoSchema.statics.findAllToDos = async function () {
  return await this.find();
};

toDoSchema.statics.findToDo = async function (registrant, registeredAt) {
  return await this.findOne({ registrant, registeredAt });
};

toDoSchema.statics.findToDo = async function (registrant, registeredAt) {
  return await this.findOneAndDelete({ registrant, registeredAt });
};

const ToDoModel =
  (models.ToDo as DBToDoModel) ||
  db.model<DBToDoDocument, DBToDoModel>('ToDo', toDoSchema);

export default ToDoModel;
