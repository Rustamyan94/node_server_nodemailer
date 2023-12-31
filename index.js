const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
const cors = require("cors");

require("dotenv").config();

const app = express();

const PORT = 80; // 8080

app.use(express.static(path.resolve("../client/build")));
app.use(express.json());
app.use(cors());

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

app.get("*", (req, res) => {
  res.sendFile(path.resolve("../client/build", "index.html"));
});
app.post("/sendMail", (req, res) => {
  let mailOptions = {
    from: process.env.GMAIL,
    to: process.env.GMAIL,
    subject: "Заявка с сайта 'rosgoststroy1.ru'",
  };

  if (req.body.type == "callBack") {
    mailOptions.text = `Клиент оставил номер телефона и просит чтобы вы звонили его - ${req.body.tel}`;
  } else if (req.body.type == "callBackForm") {
    mailOptions.text = `Клиент заказал обратный звонок - имя: ${req.body.name}, время: ${req.body.time}, номер телефона: ${req.body.tel},`;
  } else if (req.body.type == "order") {
    mailOptions.html = `<div>
    <h3>Ваш заказ с сайта "rosgoststroy1.ru"</h3>
    ${req.body.shopItems
      .map(
        (item) =>
          `<p>${
            item.color + " " + item.title + " " + item.size + " " + item.count
          }  м2 с ценой ${item.price}₽</p>`
      )
      .join("")}

    <h4>Контакты</h4>
    <p>Имя - ${req.body.name}</p>
    <p>Номер телефона - ${req.body.tel}</p>
    <p>Емайл - ${req.body.email}</p>
</div>`;
  }

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("Error " + err);
      res.send({ status: 500, message: "Error " + err });
    } else {
      // console.log("Email sent successfully", data);
      res.send({ status: 200, message: "Email sent successfully", data });
    }
  });
  res.end();
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
