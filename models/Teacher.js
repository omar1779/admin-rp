import mongoose, {model, models, Schema} from "mongoose";

/* const CategorySchema = new Schema({
  name: {type:String,required:true},
  parent: {type:mongoose.Types.ObjectId, ref:'Category'},
  properties: [{type:Object}]
});

export const Category = models?.Category || model('Category', CategorySchema); */

const TeacherSchema = new Schema({
  name: {
    type:String,
    required:true
  },
  description : {type:String},
  properties: [{type:Object}]
});

export const Teacher = models?.Teacher || model('Teacher', TeacherSchema);