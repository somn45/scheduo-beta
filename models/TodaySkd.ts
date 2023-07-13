import { Model, Schema, Document, models, model } from 'mongoose';

export interface DBTodaySkd {
  title: string;
  author: string;
  toDos: Array<IToDo>;
}

export interface IToDo {
  content: string;
  registeredAt: number;
  state: string;
}

interface DBTodaySkdDocument extends DBTodaySkd, Document {}

interface DBTodaySkdModel extends Model<DBTodaySkdDocument> {
  findTodaySkd: (author: string) => Promise<DBTodaySkdDocument>;
  findOneTodaySkd: (author: string) => Promise<DBTodaySkdDocument>;
  findByIdTodaySkd: (id: string) => Promise<DBTodaySkdDocument>;
  findAllToDos: () => Promise<DBTodaySkdDocument>;
  findToDo: (
    registrant: string,
    registeredAt: number
  ) => Promise<DBTodaySkdDocument>;
  deleteToDo: (
    registrant: string,
    registeredAt: number
  ) => Promise<DBTodaySkdDocument>;
}

const todaySkdSchema: Schema<DBTodaySkdDocument> = new Schema({
  title: String,
  author: String,
  toDos: [
    {
      content: String,
      registeredAt: Number,
      state: String,
    },
  ],
});

todaySkdSchema.statics.findTodaySkd = async function (author: string) {
  return await this.find({ author });
};

todaySkdSchema.statics.findOneTodaySkd = async function (author: string) {
  return await this.findOne({ author });
};

todaySkdSchema.statics.findByIdTodaySkd = async function (id: string) {
  return await this.findById(id);
};

todaySkdSchema.statics.findAllToDos = async function () {
  return await this.find();
};

todaySkdSchema.statics.findToDo = async function (author, registeredAt) {
  return await this.findOne({ author, registeredAt });
};

todaySkdSchema.statics.deleteToDo = async function (author, registeredAt) {
  return await this.findOneAndDelete({ author, registeredAt });
};

const TodaySkd =
  (models.TodaySkd as DBTodaySkdModel) ||
  model<DBTodaySkdDocument, DBTodaySkdModel>('TodaySkd', todaySkdSchema);

export default TodaySkd;
