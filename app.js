const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path'); // to deal with the file path
const nodemailer = require('nodemailer');

const app = express();

//view engine  setup 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//static folder
app.use('./public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
   res.render('./layouts/main');
});

app.post('/send', (req, res) => {
   const output = `
   <p>new contact request made</p>
   <h3>contact details</h3>
   <ul>
      <li>Name : ${req.body.name}</li>
   </ul>
   <h3>Message </h3>
   <p>${req.body.message}</p>
  `;

   // create reusable transporter object using the default SMTP transport
   let transporter = nodemailer.createTransport({
      secure: false, // true for 465, false for other ports
      host: '',
      port: 587,
      auth: {
         user: '',
         pass: ''
      },
      tls: {
         rejectUnauthorized: false
      }
   });

   // send mail with defined transport object
   let info = transporter.sendMail({
      from: '"Mohak Gadge" <>', // sender address
      to: "test@gmail.com", // list of receivers
      subject: "nodemailer sample", // Subject line
      text: "Hello world?", // plain text body
      html: output // html body
   });

   console.log("Message sent: %s", info.messageId);
   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

   // Preview only available when sending through an Ethereal account
   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
   res.render('./layouts/main', { msg: 'sent mail successfully' });
});

app.listen(3000, () => console.log("server started ...."));