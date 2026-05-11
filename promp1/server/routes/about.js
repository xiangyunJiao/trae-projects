import express from 'express';
import { about } from '../data/mockData.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json(about);
});

router.put('/', (req, res) => {
  const { name, bio, skills, email, github } = req.body;
  if (name) about.name = name;
  if (bio) about.bio = bio;
  if (skills) about.skills = skills;
  if (email) about.email = email;
  if (github) about.github = github;

  res.json(about);
});

export default router;
