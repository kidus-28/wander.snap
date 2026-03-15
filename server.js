require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve ALL files directly from the current folder (no 'public' needed)
app.use(express.static(__dirname));

// Create uploads folder safely (if not exists)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer for profile picture upload
const storage = multer.diskStorage({
    destination: uploadsDir,
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Contact Form Endpoint
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: `New Message from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
        });
        res.json({ success: true, message: "Message sent successfully! ✨" });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: "Failed to send message" });
    }
});

// Profile Update Endpoint (photo upload)
app.post('/api/profile', upload.single('avatar'), (req, res) => {
    const newName = req.body.name;
    const avatarPath = req.file ? `/uploads/${req.file.filename}` : null;

    res.json({
        success: true,
        name: newName,
        avatar: avatarPath,
        message: "Profile updated successfully!"
    });
});

// Catch-all route: serve index.html for any path (makes it feel like a real site)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`🌍 WanderWorld backend running on http://localhost:${PORT}`);
    console.log(`Open your site at: http://localhost:${PORT}`);
});