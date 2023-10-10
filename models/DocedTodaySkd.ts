import { IDocedTodaySkd } from '@/types/interfaces/todaySkds.interface';
import { Document, Model, Schema, model, models } from 'mongoose';

interface DBDocedTodaySkd extends IDocedTodaySkd {}

interface DBDocedTodaySkdDocument extends DBDocedTodaySkd, Document {}

interface DBDocedTodaySkdModel extends Model<DBDocedTodaySkdDocument> {}

const docedTodaySkdSchema: Schema<DBDocedTodaySkdDocument> = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  start: Date,
  end: Date,
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
