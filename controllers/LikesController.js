const db = require("../models");

module.exports = {
  findAll: function(req, res) {
    db.Likes
      .find(req.query)
      .sort({ date: -1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findById: function(req, res) {
    db.Likes
      .findOne({okta_id:req.params.id})
      .then(dbModel => {
        db.Snippets.findAll({}).then((err,result)=>{
          if(err) res.status(442).json(err)
          res.json(result)}
          )
      })
      .catch(err => res.status(422).json(err));
    
  },
  create: function(req, res) {
    let like = new db.Likes(req.body)
    like.save((err,data)=>{
      if(err) res.status(442).json(err)
      db.User
      .findOneAndUpdate({okta_id:req.body.author_id},
        {
          $push:{likes:req.body[0]}
        }
        )
      .then(result=>{
        db.Snippets
        .findOneAndUpdate({_id:req.body.post_id},{
          $push:{likes:req.body[0]}
        })
        .catch(err=>res.status(442).json(err))
      })
      .catch(err=>res.status(442).json(err))
    })
    db.Likes
      .create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  update: function(req, res) {
    db.Likes
      .findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  remove: function(req, res) {
    db.Likes
      .findOneAndDelete({ author_id: req.params.id })
      .then(dbModel => dbModel.remove())
      .then(dbModel => {
        db.Snippets
        .findAll({})
        .then(snippets=>res.json(snippets))
        .catch(err=>res.status(442).json(err))
      })
      .catch(err => res.json(err));
  }
};
