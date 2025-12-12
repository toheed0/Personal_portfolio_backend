const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
const portfolioData = {
  name: "Touheed Hussain",
  skills: ["React", "Node.js", "Next.js","html","Css","javascript", "MongoDB", "TailwindCSS"],
  projects: [
     {
      
        title: "Architecture & Interior Design Website",
        description:
          "A high-end architecture & interior studio website with premium animations, smooth scroll, and luxury UI components.",
      },
      {
        title: "E-Commerce Web App",
        description:
          "A full-featured online store with product management, cart system, and responsive UI built using MERN Stack.",
      },
      {
        title: "Business Website (React)",
        description:
          "A professional business landing website with clean layout, modern UI and smooth animations using React + Tailwind.",
      },
      {
        title: "M-Collection E-Commerce Site",
        description:
          "I developed an eCommerce website named M-Collection using React, Tailwind CSS, and Redux Toolkit for a modern interface and smooth user experience. Its backend is built with Node.js, Express, and MongoDB (Mongoose) to ensure secure, fast, and efficient data management.",
      },
  ],
  experience: "Junior MERN Developer, Internships",
  education: "BSCS",
  contact: "toheedmughal370@gmail.com",
};


const API_URL = "https://api.groq.com/openai/v1/chat/completions";
const OPENAI_API_KEY = process.env.GROQ_API_KEY;

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

   const payload = {
  model: "llama-3.3-70b-versatile",
  messages: [
    {
      role: "system",
      content: `
        You are a portfolio assistant bot.
        Answer based ONLY on this portfolio data:
        ${JSON.stringify(portfolioData)}

        RULES:
        1. If the user asks "Who is this portfolio?" or any question about the owner, mention "Touheed Hussain".
        2. If the user asks for full details about projects, skills, experience, education, always include "Touheed Hussain" in the introduction.
        3. For simple skill or project questions, also  include the name.
        4. Always answer in a friendly and professional tone.
      `
    },
    { role: "user", content: message }
  ]
};


    const r = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const data = await r.json();

    // ---- FIX HERE ----
    if (!data.choices || !data.choices[0]) {
      console.error("Groq API Response Error:", data);
      return res.status(500).json({
        reply: "Sorry, AI se response nahi mila."
      });
    }

    const reply = data.choices[0].message.content;
    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Server crashed" });
  }
});
app.listen(process.env.PORT || 8000, ()=>{
    console.log(`Server running on port ${process.env.PORT || 5000}`)
});
