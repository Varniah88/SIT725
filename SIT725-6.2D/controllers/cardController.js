const { getCards } = require('../collections/cardsCollections');

//GET cards
const fetchCards = async (req, res) => {
  try {
    const cards = await getCards();
    res.json(cards);
  } catch (err) {
    console.error('Error fetching cards:', err);
    res.status(500).send('Server error');
  }
};

module.exports = { fetchCards };
