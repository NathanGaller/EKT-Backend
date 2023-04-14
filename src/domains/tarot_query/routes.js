const express = require('express');
const { body, validationResult } = require('express-validator');
const { queryTarot, pickRandomTarotCards } = require('./controller.js');
const { requireTokenThen, getUserFromToken } = require('./../../auth');
const { performTarotReading } = require("../tarot_reading/controller.js");
const TarotReading = require('../tarot_reading/model.js');

const tarotRouter = express.Router();

const formatNextAvailableTime = (nextAvailableTime) => {
  const hours = Math.floor(nextAvailableTime / (60 * 60 * 1000));
  const minutes = Math.floor((nextAvailableTime % (60 * 60 * 1000)) / (60 * 1000));

  if (hours > 0) {
    return `${hours} hour(s) and ${minutes} minute(s)`;
  } else {
    return `${minutes} minute(s)`;
  }
};

tarotRouter.post(
  '/',
  [
    body('numCards').isInt({ min: 1, max: 78 }).withMessage('Invalid number of cards requested'),
    body('question').isString().notEmpty().withMessage('Question is required'),
  ],
  requireTokenThen(async (req, res, decodedToken) => {
    try {
      const user = await getUserFromToken(decodedToken);
      const { numCards, question } = req.body;
      const now = new Date();

      if (user.tier === 'free') {
        const lastFreeReading = user.lastFreeReading;
        const timeSinceLastReading = now - lastFreeReading;

        if (!lastFreeReading || timeSinceLastReading >= 24 * 60 * 60 * 1000) {
          const { cards, reading } = await performTarotReading(user, numCards, question);
          user.lastFreeReading = now;
          await user.save();
          res.status(200).json({ cards, reading });
        } else {
          const nextAvailableTime = 24 * 60 * 60 * 1000 - timeSinceLastReading;
          const formattedTime = formatNextAvailableTime(nextAvailableTime);

          res.status(403).json({
            error: `You have already received your free daily Tarot reading. You can try again in ${formattedTime}.`,
            errorCode: 'ERR_DAILY_LIMIT_REACHED',
            nextAvailableTime: formattedTime,
          });
        }
      } else if (user.tier === 'paid') {
        const { cards, reading } = await performTarotReading(user, numCards, question);
        res.status(200).json({ cards, reading });
      } else {
        res.status(400).json({ message: 'Invalid user tier.' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: `An error occurred while performing the tarot reading: ${err}`,
      });
    }
  })
);

tarotRouter.get(
  '/readings', 
  requireTokenThen(async (req, res, decodedToken) => {
    try {
      const user = await getUserFromToken(decodedToken);

      const readings = await TarotReading.find({ user: user._id })
        .sort({ createdAt: -1 }) // Sort by most recent readings
        .exec();

      res.status(200).json({ readings });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: `An error occurred while fetching the tarot readings: ${err}`,
      });
    }
  })
);

module.exports = tarotRouter;