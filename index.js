var express = require('express');
var parser = require('body-parser');
var entry = express();
var path = require('path');

var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var db;

entry.use(parser.json());
entry.use(parser.urlencoded({extended: true}));
entry.use(express.static('client/build'));
entry.use(express.static('client/public'));


entry.post('/routes', function(req, res) {
  db.collection('routes').save(req.body, function(err, result){
    db.collection('routes').find().toArray(function(err, results){
      res.json(results);
    });
  });
});

entry.get('/routes', function(req, res){
  db.collection('routes').find().toArray(function(err, results){
    res.json(results);
  });
});

entry.put('/routes/:id/status', function(req, res){
  var id = req.params.id;

  db.collection('routes').update({'_id': new ObjectID(id)}, {
      $inc: {
        status: 1
      }
  });
});

entry.put('/routes/:id/:notes', function(req, res){
  var id = req.params.id;
  var notes = req.params.notes;
  // console.log(notes);

  db.collection('routes').update({'_id': new ObjectID(id)}, {
    $set: {notes: req.params.notes}
  });
  res.json({});
});

entry.post('/delete/:id', function(req, res){
  var id = req.params.id;
  db.collection('routes').deleteOne({'_id': new ObjectID(id)},function(err, result){
    db.collection('routes').find().toArray(function(err, results){
      res.json(results);
    });
  });
});

entry.post('/delete', function(req, res){
  db.collection('routes').remove({}, function(err, result){
    res.redirect('/');
  });
});

MongoClient.connect('mongodb://heroku_fhpvzqzt:j0at1selchl2be4rdauvjb9km@ds243325.mlab.com:43325/heroku_fhpvzqzt', function(err, database) {

  if(err) {
    console.log(err);
    return;
  }

  db = database;

  console.log('Connected to database');

  entry.listen(5000, function() {
    console.log('Listening on port 3000');
  });
});
