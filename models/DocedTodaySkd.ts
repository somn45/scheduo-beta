import { IDocedTodaySkd } from '@/types/interfaces/todaySkds.interface';
import { Document, Model, Schema, model, models } from 'mongoose';

interface DBDocedTodaySkd extends IDocedTodaySkd {}

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
