import { Document, Model, Schema, model, models } from 'mongoose';
import { DocumentedTodayScheduleWithAuthor } from '@/types/interfaces/documentedTodaySchedules.interface';

interface DBDocedTodaySkd
  extends Omit<DocumentedTodayScheduleWithAuthor, '_id'> {}

interface DBDocedTodaySkdDocument extends DBDocedTodaySkd, Document {}

interface DBDocedTodaySkdModel extends Model<DBDocedTodaySkdDocument> {}

const docedTodaySkdSchema: Schema<DBDocedTodaySkdDocument> = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  start: Date,
  end: Date,
  sharingUsers: [
    {
      userId: { type: String, required: true },
      name: { type: String, required: true },
    },
  ],
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
