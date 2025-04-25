import { model, Schema } from "mongoose";

const historySchema = new Schema(
  {
    userId: { type: String, required: true },
    imgUrl: { type: String, required: true },
    result: { type: String, required: true },
  },
  { timestamps: true }
);

const History = model("History", historySchema);
export default History;
