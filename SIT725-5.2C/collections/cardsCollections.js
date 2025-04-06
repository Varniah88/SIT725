const Card = require('../models/Card');

// Function to seed sample data into the cards collection
const seedCards = async () => {
  const sampleCards = [
    {
      title: "Organic Dress",
      description: "Made from 100% organic cotton. Feel good while looking great!",
      image: "/images/dress.png",
      link: "/",
    },
    {
      title: "Summer Dress",
      description: "Ethical & Sustainble Flowy Summer Dress",
      image: "/images/summer-dresses.jpg",
      link: "/",
    },
    {
      title: "Sustainable Blazer",
      description: "Ethically made and perfect for any occasion.",
      image: "/images/suit.jpg",
      link: "/",
    },
    {
      title: "EcoWear Tees",
      description: "Stay warm while being kind to the planet.",
      image: "/images/shirt1.jpeg",
      link: "/",
    },
    {
      title: "White Threads",
      description: "Ultra-soft Dress made from renewable fibers.",
      image: "/images/ladiesdress.jpeg",
      link: "/",
    },
    {
      title: "EcoStitch Shirt",
      description: "Made from responsibly grown organic materials.",
      image: "/images/shirt.jpg",
      link: "/",
    },
  ];

  try {
    for (const card of sampleCards) {
      // Check if a card with the same title already exists
      const existingCard = await Card.findOne({ title: card.title });
      if (!existingCard) {
        await Card.create(card); // Insert only if it doesn't exist
      }
    }
    console.log("Sample cards seeded successfully!");
  } catch (err) {
    console.error("Error seeding cards:", err);
  }

};

// Function to retrieve all cards
const getCards = async () => {
  try {
    const cards = await Card.find();
    return cards;
  } catch (err) {
    console.error("Error retrieving cards:", err);
    throw err;
  }
};

module.exports = { seedCards, getCards };