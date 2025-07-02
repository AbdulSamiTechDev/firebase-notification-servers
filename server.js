require("dotenv").config();
const express = require("express");
const { sendNotification, getAccessToken } = require("./fcmService");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Simple endpoint to get access token
app.get("/api/get-token", async (req, res) => {
  try {
    const token = await getAccessToken();
    res.json({ 
      success: true, 
      accessToken: token 
    });
  } catch (error) {
    console.error("Error getting access token:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Notification endpoint
app.post("/api/send-notification", async (req, res) => {
  try {
    const { fcmToken, title, body, data } = req.body;
    
    if (!fcmToken || !title || !body) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields: fcmToken, title, body" 
      });
    }

    const result = await sendNotification(fcmToken, title, body, data);
    res.json({ 
      success: true, 
      message: "Notification sent successfully",
      data: result 
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Failed to send notification" 
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});