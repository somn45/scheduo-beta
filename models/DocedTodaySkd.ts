import { Document, Model, Schema, model, models } from 'mongoose';

export interface DBDocedTodaySkd {
  title: string;
  author: string;
  start: number;
  end: number;
  docedToDos: Array<IDocedToDo>;
}

export interface IDocedToDo {
  content: string;
}

interface DBDocedTodaySkdDocument extends DBDocedTodaySkd, Document {}

interface DBDocedTodaySkdModel extends Model<DBDocedTodaySkdDocument> {}

const docedTodaySkdSchema: Schema<DBDocedTodaySkdDocument> = new Schema({
  title: String,
  author: String,
  start: Number,
  end: Number,
  docedToDos: [
    {
      content: String,
    },
  ],
});

const DocedTodaySkd =
  (models.DocedTodaySkd as DBDocedTodaySkdModel) ||
  model<DBDocedTodaySkdDocument, DBDocedTodaySkdModel>(
    'DocedTodaySkd',
    docedTodaySkdSchema
  );

export default DocedTodaySkd;
