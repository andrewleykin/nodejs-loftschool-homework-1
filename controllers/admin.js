const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const db = require('../models/db')();
const skills = db.get('skills');

module.exports.getAdmin = function (req, res) {
  res.render('pages/admin', {data: {skills: skills}});
}

module.exports.sendSkills = function (req, res) {
  const newSkills = [];

  newSkills.push(req.body.age, req.body.concerts, req.body.cities, req.body.years);

  for(let i=0; i<newSkills.length; i++) {
    skills[i].number = newSkills[i];
  }

  res.render('pages/admin', {msgskill: 'Данные обновлены', data: {skills: skills}})
}

module.exports.sendUpload = function (req, res) {
  let form = new formidable.IncomingForm();
  let upload = path.join('./public', 'upload');
  let fileName;

  if (!fs.existsSync(upload)) {
    fs.mkdirSync(upload);
  }

  form.uploadDir = path.join(process.cwd(), upload);

  form.parse(req, function (err, fields, files) {
    if (err) {
      return next(err);
    }

    if (files.photo.name === '' || files.photo.size === 0) {
      return res.render('pages/admin', {msgfile: 'Нету картинки!', data: {skills: skills}});
    }

    if (!fields.name) {
      fs.unlink(files.photo.path);
      return res.render('pages/admin', {msgfile: 'Нету названия!', data: {skills: skills}});
    }

    if (!fields.price) {
      fs.unlink(files.photo.path);
      return res.render('pages/admin', {msgfile: 'Нету цены!', data: {skills: skills}});
    }

    fileName = path.join(upload, files.photo.name);

    fs.rename(files.photo.path, fileName, function (err) {
      if (err) {
        console.error(err);
        fs.unlink(fileName);
        fs.rename(files.photo.path, fileName);
      }
      let dir = fileName.substr(fileName.indexOf('\\'));
      let dbProducts = db.get('products');
      dbProducts.push({
        "src": dir,
        "name": fields.name,
        "price": fields.price
      });
      db.save();
      res.render('pages/admin', {msgfile: 'Картинка добавлена!', data: {skills: skills}});
    });
  })
}