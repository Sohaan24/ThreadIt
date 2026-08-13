const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // OR require("bcrypt") depending on what you installed
require("dotenv").config();

const User = require("./Models/UserModel"); 
const Post = require("./Models/PostModel");
const Comment = require("./Models/CommentModel");

const seedDatabase = async () => {
  try {
    // 1. Force the script to use the EXACT same URI as your backend
    const DB_URI = process.env.MONGO_URL; 
    if (!DB_URI) throw new Error("MONGO_URI is missing in .env file");

    console.log("Connecting to Database...");
    await mongoose.connect(DB_URI);
    console.log(`Connected to Database: ${mongoose.connection.name}`); // This will prove which DB you are in

    console.log("Wiping existing data...");
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});

    // 2. Hash the password manually because insertMany bypasses schema hooks
    console.log("Hashing passwords...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    console.log("Creating Users...");
    const usersData = [
      { username: "CosmicObserver", email: "space@science.com", password: hashedPassword },
      { username: "NeuroWeaver", email: "brain@science.com", password: hashedPassword },
      { username: "TechNihilist", email: "tech@future.com", password: hashedPassword },
      { username: "RuinsExplorer", email: "history@past.com", password: hashedPassword },
      { username: "AbyssalDiver", email: "ocean@deep.com", password: hashedPassword },
    ];
    const users = await User.insertMany(usersData);

    console.log("Creating Posts...");
    const postsData = [
      {
        caption: "Why does the arrow of time only go forward?",
        content: "Entropy dictates that closed systems move from order to disorder. But at a quantum level, most physics equations are entirely time-reversible. Why do we only experience time macroscopically in one direction?",
        author: users[0]._id, 
        commentCount: 0
      },
      {
        caption: "The sheer scale of the observable universe.",
        imageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1000&auto=format&fit=crop",
        author: users[0]._id,
        commentCount: 0
      },
      {
        caption: "We know more about the moon's surface than the abyssal plains.",
        imageUrl: "https://images.unsplash.com/photo-1582967265882-75d31484643b?q=80&w=1000&auto=format&fit=crop",
        author: users[4]._id, 
        commentCount: 0
      },
      {
        caption: "The Fermi Paradox and the Great Filter",
        content: "Statistically, the universe should be teeming with life. The fact that it is completely silent implies there is a 'Great Filter' that wipes out civilizations. Are we past the filter, or is it still ahead of us?",
        author: users[2]._id, 
        commentCount: 0
      },
      {
        caption: "Neural plasticity proves the brain can literally rewire itself.",
        content: "It blows my mind that if you lose your sight, the visual cortex doesn't just sit idle. It actually gets hijacked by your other senses like hearing and touch to process information.",
        author: users[1]._id, 
        commentCount: 0
      },
      {
        caption: "Roman Concrete vs. Modern Engineering",
        content: "Modern reinforced concrete lasts maybe 50-100 years before the steel rebar rusts and destroys it from the inside out. The Pantheon has stood for 2,000 years unreinforced. We traded longevity for tensile strength.",
        author: users[3]._id, 
        commentCount: 0
      },
      {
        caption: "The precision of ancient megalithic stonework",
        imageUrl: "https://images.unsplash.com/photo-1552832233-a62bc6572e27?q=80&w=1000&auto=format&fit=crop",
        author: users[3]._id,
        commentCount: 0
      },
      {
        caption: "The illusion of conscious decision making",
        content: "Studies using fMRI scanners show that your brain actually initiates a 'choice' up to 7 seconds before you are consciously aware of making it. Free will might just be our brain narrating what it already decided.",
        author: users[1]._id, 
        commentCount: 0
      },
      {
        caption: "Quantum computing architecture",
        imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop", 
        author: users[2]._id,
        commentCount: 0
      },
      {
        caption: "Rogue planets are the most terrifying concept in astronomy",
        imageUrl: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=1000&auto=format&fit=crop",
        author: users[0]._id,
        commentCount: 0
      }
    ];
    const posts = await Post.insertMany(postsData);

    console.log("Creating deeply nested comments...");
    
    const p1c1 = await Comment.create({ postId: posts[0]._id, author: users[2]._id, authorName: users[2].username, text: "Feynman's positron theory basically says antimatter is just regular matter moving backward in time." });
    const p1c2 = await Comment.create({ postId: posts[0]._id, author: users[1]._id, authorName: users[1].username, text: "Wait, does that imply the future already exists in a 'block universe' model?" });
    
    const p1c1_r1 = await Comment.create({ postId: posts[0]._id, parentId: p1c1._id, author: users[0]._id, authorName: users[0].username, text: "Exactly. At the quantum level, time symmetry exists. The math works perfectly in both directions." });
    const p1c1_r1_r1 = await Comment.create({ postId: posts[0]._id, parentId: p1c1_r1._id, author: users[2]._id, authorName: users[2].username, text: "But if the math works in reverse, why does an egg shatter but never reassemble itself?" });
    const p1c1_r1_r1_r1 = await Comment.create({ postId: posts[0]._id, parentId: p1c1_r1_r1._id, author: users[0]._id, authorName: users[0].username, text: "Because there is only one arrangement of atoms for a whole egg, but trillions of arrangements for a broken one. It's pure statistical probability." });

    const p4c1 = await Comment.create({ postId: posts[3]._id, author: users[0]._id, authorName: users[0].username, text: "I honestly think we are the first. Someone has to be the elder race in the galaxy." });
    const p4c1_r1 = await Comment.create({ postId: posts[3]._id, parentId: p4c1._id, author: users[2]._id, authorName: users[2].username, text: "Statistically impossible given the universe is 13.8 billion years old. We are late to the party." });
    const p4c1_r1_r1 = await Comment.create({ postId: posts[3]._id, parentId: p4c1_r1._id, author: users[1]._id, authorName: users[1].username, text: "Not if the conditions to jump from single-cell to multi-cellular life are a one-in-a-trillion lottery." });

    const p6c1 = await Comment.create({ postId: posts[5]._id, author: users[4]._id, authorName: users[4].username, text: "They used volcanic ash! The reactive silica prevented micro-cracks from spreading." });
    const p6c1_r1 = await Comment.create({ postId: posts[5]._id, parentId: p6c1._id, author: users[3]._id, authorName: users[3].username, text: "Not just that, seawater actually strengthened their harbor structures over time." });
    const p6c1_r1_r1 = await Comment.create({ postId: posts[5]._id, parentId: p6c1_r1._id, author: users[2]._id, authorName: users[2].username, text: "Imagine building something today that gets stronger when exposed to saltwater. Modern rebar just turns to dust." });

    await Post.findByIdAndUpdate(posts[0]._id, { commentCount: 5 });
    await Post.findByIdAndUpdate(posts[3]._id, { commentCount: 3 });
    await Post.findByIdAndUpdate(posts[5]._id, { commentCount: 3 });

    console.log("✅ Database seeded successfully!");
    process.exit(0);

  } catch (err) {
    console.error("❌ Seed Error: ", err);
    process.exit(1);
  }
};

seedDatabase();