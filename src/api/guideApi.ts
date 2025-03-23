// src/api/guideApi.ts
import express, { Request, Response } from "express";

const router = express.Router();

// Static guide data
const guides = [
  { id: 1, title: "Soil Preparation", content: "Details about soil preparation..." },
  { id: 2, title: "Seed Selection", content: "Information on selecting the right seeds..." },
  { id: 3, title: "Water Management", content: "Guidelines for water management..." },
  { id: 4, title: "Fertilizer Application", content: "How to apply fertilizers correctly..." },
];

// Endpoint to get all guides
router.get("/guides", (req: Request, res: Response) => {
  res.json(guides);
});

// Endpoint to get guide details by ID
router.get("/guides/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const guide = guides.find((g) => g.id === id);
  if (guide) {
    res.json(guide);
  } else {
    res.status(404).json({ error: "Guide not found" });
  }
});

export default router;
