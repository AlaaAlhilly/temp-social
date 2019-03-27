const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const snippetsSchecma = new Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  lang: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  likes:[{
    type: Schema.Types.ObjectId,
    ref: "Likes"
  }],
  comments:[{
    id:{
      type: Schema.Types.ObjectId,
      ref: "Comments"
    },
    commenter:{
      type: Schema.Types.String,
      ref:"Comments"
    },
    date:{
      type: Schema.Types.Date,
      ref: "Comments"
    },
    pic:{
      type: Schema.Types.String,
      ref: "Comments"
    }
  }],
  author:{
    okta_id:{
      type:Schema.Types.String,
      ref:"User"
    },
    name:{
      type:Schema.Types.String,
      ref:"User"
    },
    pic:{
      type:Schema.Types.String,
      ref:"User"
    }
  }

});

const Snippets = mongoose.model("Snippets", snippetsSchecma);

module.exports = Snippets;
