const nodemailer = require('nodemailer');

const mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "verifyactivationtest@gmail.com",
        pass: "verify123"
    },
});

const verify = {
    from: "verifyactivationtest@gmail.com",
    to: "perkasa.putra1404@gmail.com",
    subject: "testing our verify",
    text: "testing our first sender"
};

mailTransporter.sendMail(verify, (err) => {
    if (err) {
        console.log('it has an error', err)
    } else {
        console.log('email has sent!')
    }
})