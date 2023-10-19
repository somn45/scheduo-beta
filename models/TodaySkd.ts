import { TodaySchedule } from '@/types/interfaces/todaySkds.interface';
import { HydratedDocument, QueryWithHelpers } from 'mongoose';
import { Model, Schema, Document, models, model, Types } from 'mongoose';

interface DBTodaySchedule extends TodaySchedule {
  createdAt: number;
  sharingUsers: Types.ObjectId[];
}

interface DBTodaySkdDocument extends DBTodaySchedule, Document {}

interface TodaySkdQueryHelpers {
  allStateDone(): QueryWithHelpers<
    HydratedDocument<DBTodaySchedule>[],
    HydratedDocument<DBTodaySchedule>,
    TodaySkdQueryHelpers
  >;
}

interface DBTodaySkdModel
  extends Model<DBTodaySchedule, TodaySkdQueryHelpers, {}> {
  findTodaySkd: (author: string) => Promise<DBTodaySkdDocument>;
  findOneTodaySkd: (author: string) => Promise<DBTodaySkdDocument>;
  findByIdTodaySkd: (id: string) => Promise<DBTodaySkdDocument>;
  findFinishTodaySkd: (
    author: string,
    id: string
  ) => Promise<DBTodaySkdDocument>;
  findToDo: (
    registrant: string,
    registeredAt: number
  ) => Promise<DBTodaySkdDocument>;
  deleteToDo: (
    registrant: string,
    registeredAt: number
  ) => Promise<DBTodaySkdDocument>;
}

const todaySkdSchema: Schema<
  DBTodaySchedule,
  DBTodaySkdModel,
  {},
  TodaySkdQueryHelpers
> = new Schema({
  title: { type: String, required: true, maxlength: 80 },
  author: { type: String, required: true },
  sharingUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  createdAt: Number,
  toDos: [
    {
      content: { type: String, required: true },
      registeredAt: { type: Number, required: true },
      state: {
        type: String,
        required: true,
        enum: ['toDo', 'willDone', 'done'],
      },
    },
  ],
});

todaySkdSchema.pre('save', async function (next) {
  if (!this.createdAt) this.createdAt = Date.now();
  next();
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

todaySkdSchema.statics.findToDo = async function (author, registeredAt) {
  return await this.findOne({ author, registeredAt });
};

todaySkdSchema.statics.deleteToDo = async function (author, registeredAt) {
  return await this.findOneAndDelete({ author, registeredAt });
};

const TodaySkd =
  (models.TodaySkd as DBTodaySkdModel) ||
  model<DBTodaySchedule, DBTodaySkdModel>('TodaySkd', todaySkdSchema);

export default TodaySkd;
