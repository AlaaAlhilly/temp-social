var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var LikeSchema = new Schema({
  author_id:Number,
  snippet_id:Number
});
var Likes = mongoose.model("Likes", LikeSchema);
module.exports = Likes;
