var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var CommentsSchema = new Schema({
  body: {
    type: String
  },
  auther_id:Number,
  snippet_id:Number,
  author_name:String,
  auth_pic:String,
});
var Comments = mongoose.model("Comments", CommentsSchema);
module.exports = Comments;
