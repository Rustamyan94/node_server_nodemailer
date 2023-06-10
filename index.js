const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const port = 3000;
app.use(express.json());
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.GMAIL,
    pass: process.env.PASSWORD,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

app.get("/", (req, res) => {
  // res.send(process.env);
  res.end();
});
app.post("/sendMail", (req, res) => {
  let mailOptions = {
    from: process.env.GMAIL,
    to: process.env.GMAIL,
    subject: "Заявка с сайта 'rosgoststroy1.ru'",
    // text: "Hi from your nodemailer project",
  };
  console.log(req.body);
  if (req.body.type == "callBack") {
    mailOptions.text = `Клиент оставил номер телефона и просит чтобы вы звонили его - ${req.body.tel}`;
  } else if (req.body.type == "callBackForm") {
    mailOptions.text = `Клиент заказал обратный звонок - имя: ${req.body.name}, время: ${req.body.time}, номер телефона: ${req.body.tel},`;
  } else if (req.body.type == "order") {
    mailOptions.html = `<div>
    <h3>Ваш заказ с сайта "rosgoststroy1.ru"</h3>
    <p>${
      req.body.color +
      " " +
      req.body.title +
      " " +
      req.body.size +
      " " +
      req.body.count
    }  м2 с ценой ${req.body.price}₽</p>
    <br>
    <h4>Контакты</h4>
    <p>Имя - ${req.body.name}</p>
    <p>Номер телефона - ${req.body.tel}</p>
    <p>Емайл - ${req.body.email}</p>
</div>`;
  }

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Email sent successfully", data);
    }
  });
  res.end();
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
