const { pickRandomTarotCards, queryTarot } = require('../tarot_query/controller');
const TarotReading = require('./model.js');

const saveTarotReading = async (user, cards, question, reading) => {
  const now = new Date();
  const tarotReading = new TarotReading({
    user: user._id,
    question,
    reading,
    cards,
    createdAt: now,
  });
  await tarotReading.save();
  return tarotReading;
};

const performTarotReading = async (user, numCards, question) => {
  const cards = await pickRandomTarotCards(numCards);
  const reading = await queryTarot(cards, question);
  const tarotReading = await saveTarotReading(user, cards, question, reading);
  return { cards, reading, tarotReading };
};

module.exports = { performTarotReading }