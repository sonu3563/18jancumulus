const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { Session, Activity } = require('../models/activityModel'); // Adjust the path accordingly
const { File } = require("../models/userUpload");
const Voice = require("../models/uservoiceUpload");
const { authenticateToken } = require("../routes/userRoutes");

const router = express.Router();

// API to fetch session and related activity details
// API to fetch all session history and related activity details
router.get('/history-details', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.user_id; // Extracted from token via middleware

        // Fetch all sessions for the user
        const sessions = await Session.find({ userId });

        // Fetch all activity logs
        const activities = await Activity.find({});

        // Store merged data in a single array
        let history = [];

        // Add session details to the history array
        sessions.forEach(session => {
            history.push({
                type: 'session',
                userId: session.userId,
                ip: session.ip,
                location: session.location,
                country: session.country,
                deviceId: session.deviceId,
                createdAt: session.createdAt, // Used for sorting
                lastActivityAt: session.lastActivityAt
            });
        });

        // Extract all unique fileIds and voiceIds from activities
        const fileIds = new Set();
        const voiceIds = new Set();

        activities.forEach(activity => {
            activity.fileActivities.forEach(fa => fileIds.add(fa.fileId.toString()));
            activity.voiceActivities.forEach(va => voiceIds.add(va.voiceId.toString()));
        });

        // Fetch all files & voices belonging to the user in a single query
        const userFiles = await File.find({ _id: { $in: Array.from(fileIds) }, user_id: userId });
        const userVoices = await Voice.find({ _id: { $in: Array.from(voiceIds) }, user_id: userId });

        const userFileIds = new Set(userFiles.map(file => file._id.toString()));
        const userVoiceIds = new Set(userVoices.map(voice => voice._id.toString()));

        // Process activity logs
        activities.forEach(activity => {
            let validFileActivities = activity.fileActivities.filter(fa => userFileIds.has(fa.fileId.toString()));
            let validVoiceActivities = activity.voiceActivities.filter(va => userVoiceIds.has(va.voiceId.toString()));

            if (validFileActivities.length > 0 || validVoiceActivities.length > 0) {
                history.push({
                    type: 'activity',
                    fileActivities: validFileActivities.map(fa => ({
                        fileId: fa.fileId,
                        action: fa.action,
                        timestamp: fa.timestamp,
                        toEmail: activity.toEmail
                    })),
                    voiceActivities: validVoiceActivities.map(va => ({
                        voiceId: va.voiceId,
                        action: va.action,
                        timestamp: va.timestamp,
                        toEmail: activity.toEmail
                    })),
                    createdAt: activity.createdAt // Used for sorting
                });
            }
        });

        // Sort the merged history array by createdAt (latest first)
        history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return res.json({ history });
    } catch (error) {
        console.error('Error fetching session and activity history:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
