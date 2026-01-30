import Page from "../models/page.js";

// CREATE
export const createPage = async (req, res) => {
  try {
    const { title, color, content,textcolor } = req.body;
    if (!title) return res.status(400).json({ message: "title is required" });

    const page = new Page({
      title,
      color,
      content,
      textcolor,
      // userId: req.user?._id  // add this later when auth is wired
    });
    const saved = await page.save();
    return res.status(201).json(saved);
  } catch (error) {
    console.error("❌ Error creating page:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// READ ALL
export const getPages = async (req, res) => {
  try {
    const pages = await Page.find().sort({ createdAt: -1 });
    return res.json(pages);
  } catch (error) {
    console.error("❌ Error fetching pages:", error);
    return res.status(500).json({ message: "Failed to fetch pages" });
  }
};

// READ ONE
export const getPageById = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ message: "Page not found" });
    return res.json(page);
  } catch (error) {
    console.error("❌ Error fetching page by ID:", error);
    return res.status(400).json({ message: "Invalid page id" });
  }
};

// UPDATE
export const updatePage = async (req, res) => {
  try {
    const { title, color, content,textcolor } = req.body;
    const pageId = req.params.id;

    const updated = await Page.findByIdAndUpdate(
      pageId,
      { title, color, content,textcolor },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Page not found" });
    return res.json(updated);
  } catch (error) {
    console.error("❌ Error during page update:", error);
    return res.status(400).json({ message: "Invalid page id" });
  }
};

// DELETE
export const deletePage = async (req, res) => {
  try {
    const deleted = await Page.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Page not found" });
    return res.json({ message: "Page deleted successfully" });
  } catch (error) {
    console.error("❌ Error during page deletion:", error);
    return res.status(400).json({ message: "Invalid page id" });
  }
};
