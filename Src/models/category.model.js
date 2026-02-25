import mongoose from"mongoose";
import { required } from "zod/mini";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required:true,
  },
  publicId: {
    type:String,
    required:true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

categorySchema.index({name:1},{unique:true,partialFilterExpression:{isDeleted:false}});

export default mongoose.model("Category", categorySchema);

