import db from '../config/db.js';
import mongoose from 'mongoose';

const FieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  label: { type: String },
  readOnly: { type: Boolean, default: false },
});

const FormSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fields: [FieldSchema],
});

const formBuilderModel = db.model('forms', FormSchema);

export default formBuilderModel;

/*
 type: String,
    name: String,
    label: String,
    placeholder: String,
    required: Boolean,
    options: [String],
    validation: {
      minLength: Number,
      maxLength: Number,
      pattern: String,
    },
* */
