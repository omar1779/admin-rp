import mongoose, {model, Schema, models} from "mongoose";

/* const ProductSchema = new Schema({
  title: {type:String, required:true},
  description: String,
  price: {type: Number, required: true},
  images: [{type:String}],
  category: {type:mongoose.Types.ObjectId, ref:'Category'},
  properties: {type:Object},
}, {
  timestamps: true,
});

export const Product = models.Product || model('Product', ProductSchema); */

const VideosSchema = new Schema({
  title: {type:String, required:true},
  description: String,
  duration: {type: Number, required: true},
  videos: [{type:String}],
  teacher: {type:mongoose.Types.ObjectId, ref:'Teacher'},
  properties: {type:Object},
}, {
  timestamps: true,
});

export const Videos = models.Videos || model('Videos', VideosSchema);