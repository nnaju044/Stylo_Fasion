import nodemailer from "nodemailer";

const { EMAIL_USER, EMAIL_PASS } = process.env;
console.log(EMAIL_PASS,EMAIL_USER)

if (!EMAIL_USER || !EMAIL_PASS) {
    console.warn("EMAIL_USER or EMAIL_PASS environment variable is not set. Email sending will fail until configured.");
}

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
});

transporter.verify()
    .then(() => console.info("Email transporter verified and ready"))
    .catch(err => console.error("Email transporter verification failed:", err.message || err));

export const sendEmail = async ({ to, subject, html, text }) => {
    if (!EMAIL_USER || !EMAIL_PASS) {
        throw new Error("Email credentials are not configured (EMAIL_USER / EMAIL_PASS)");
    }

    try {
        const info = await transporter.sendMail({
            from: `"Stylo Fasion" <${EMAIL_USER}>`,
            to,
            subject,
            html,
            text,
        });

        return info;
    } catch (err) {
        console.error("sendEmail error:", err.message || err);
        throw err;
    }
};