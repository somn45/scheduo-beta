import { Document, Model, Schema, model, models } from 'mongoose';
import { EventWithAuthor } from '@/types/interfaces/documentedTodaySchedules.interface';

type IDocumentedTodaySchedule = EventWithAuthor;

interface DBDocedTodaySkd extends IDocumentedTodaySchedule {}

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
