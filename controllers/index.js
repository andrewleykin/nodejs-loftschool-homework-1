const nodemailer = require('nodemailer');
const config = require('../config.json');
const db = require('../models/db')();

module.exports.getIndex = function (req, res) {
  const skills = db.get('skills');
  const products = db.get('products');
  res.render('pages/index', {data: {skills: skills, products: products}});
}

module.exports.sendForm = function(req,res,next) {
  //требуем наличия имени, обратной почты и текста
  if (!req.body.name || !req.body.email || !req.body.message) {
    //если что-либо не указано - сообщаем об этом
    return res.json({msg:'Все поля нужно заполнить!', status: 'Error'});
  }
  //инициализируем модуль для отправки писем и указываем данные из конфига
  const transporter = nodemailer.createTransport(config.mail.smtp);
  const mailOptions = {
    from: `"${req.body.name}" <${req.body.email}>`,
    to: 'katashi1328@mail.ru',
    subject: config.mail.subject,
    text:
      req.body.message.trim().slice(0, 500) +
      `\n Отправлено с: <${req.body.email}>`
  };
  //отправляем почту
  transporter.sendMail(mailOptions, function(error, info) {
    //если есть ошибки при отправке - сообщаем об этом
    if (error) {
      return res.json({msg:`При отправке письма произошла ошибка!: ${error}`, status: 'Error'});
    }
    const dbMsg = db.get('message');
    dbMsg.push({name: req.body.name, email: req.body.email, message: req.body.message});
    db.save();
    res.render('pages/index', {msg: 'Отправлено'});
  });
}