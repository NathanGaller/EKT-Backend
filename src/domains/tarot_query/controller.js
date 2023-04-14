const openai = require("./../../config/openai.js");

const tarotDeck = [
  'The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor', 'The Hierophant', 'The Lovers',
  'The Chariot', 'Strength', 'The Hermit', 'Wheel of Fortune', 'Justice', 'The Hanged Man', 'Death', 'Temperance',
  'The Devil', 'The Tower', 'The Star', 'The Moon', 'The Sun', 'Judgement', 'The World', 
  'Ace of Wands', 'Two of Wands', 'Three of Wands', 'Four of Wands', 'Five of Wands', 'Six of Wands', 
  'Seven of Wands', 'Eight of Wands', 'Nine of Wands', 'Ten of Wands', 'Page of Wands', 'Knight of Wands', 
  'Queen of Wands', 'King of Wands', 'Ace of Cups', 'Two of Cups', 'Three of Cups', 'Four of Cups', 
  'Five of Cups', 'Six of Cups', 'Seven of Cups', 'Eight of Cups', 'Nine of Cups', 'Ten of Cups', 
  'Page of Cups', 'Knight of Cups', 'Queen of Cups', 'King of Cups', 'Ace of Swords', 'Two of Swords', 
  'Three of Swords', 'Four of Swords', 'Five of Swords', 'Six of Swords', 'Seven of Swords', 'Eight of Swords', 
  'Nine of Swords', 'Ten of Swords', 'Page of Swords', 'Knight of Swords', 'Queen of Swords', 'King of Swords', 
  'Ace of Coins', 'Two of Coins', 'Three of Coins', 'Four of Coins', 'Five of Coins', 
  'Six of Coins', 'Seven of Coins', 'Eight of Coins', 'Nine of Coins', 'Ten of Coins', 
  'Page of Coins', 'Knight of Coins', 'Queen of Coins', 'King of Coins'
];

const pickRandomTarotCards = async (numCards) => {
  if (numCards < 1 || numCards > tarotDeck.length) {
    throw new Error('Invalid number of cards requested');
  }

  const pickedCards = [];
  const remainingCards = [...tarotDeck];

  for (let i = 0; i < numCards; i++) {
    const randomIndex = Math.floor(Math.random() * remainingCards.length);
    const pickedCard = remainingCards.splice(randomIndex, 1)[0];
    pickedCards.push(pickedCard);
  }

  return pickedCards;
}

const queryTarot = async (cards, question) => {
  const pre_prompt = `As an AI language model, you are highly skilled in processing and understanding text. In this task, we invite you to explore the fascinating world of Tarot, an ancient divination practice that has inspired countless individuals over the centuries. We encourage you to use your abilities to interpret Tarot questions and pull cards for users in a way that is engaging, insightful, and compassionate. By doing so, you will not only showcase the depth of your knowledge and understanding, but also contribute to the rich tradition of Tarot as a tool for self-reflection and personal growth.\n\n`
  const template_prompt = "Please use these cards that were pulled and perform a tarot reading based on this question: \"" + question + "\"\nCards Pulled: " + cards.toString() + "\nReading:"

  const reading = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages:  [
      {role: "system", content: "In this task, we invite you to explore the fascinating world of Tarot, an ancient divination practice that has inspired countless individuals over the centuries. We encourage you to use your abilities to interpret Tarot questions and pull cards for users in a way that is engaging, insightful, and compassionate. By doing so, you will not only showcase the depth of your knowledge and understanding, but also contribute to the rich tradition of Tarot as a tool for self-reflection and personal growth."},
      {role: "user", content: template_prompt}
    ]
  });
  return reading.data.choices[0].message.content;
}


module.exports = { pickRandomTarotCards, queryTarot };