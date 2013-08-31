/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Home' });
};

exports.canvas = function(req, res){
  res.render('canvas', { title: 'canvas' });
};