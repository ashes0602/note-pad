import Page from "../models/page.js";

// CREATE
export const createPage = async (req, res) => {
  try {
    const { title, color, content, textcolor } = req.body;
    
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }
    
    if (!color) {
      return res.status(400).json({ message: "Color is required" });
    }
    
    if (!textcolor) {
      return res.status(400).json({ message: "Text color is required" });
    }

    const page = new Page({
      title: title.trim(),
      color,
      content: content || "",
      textcolor,
    });
    
    const saved = await page.save();
    console.log("✅ Page created:", saved);
    return res.status(201).json(saved);
  } catch (error) {
    console.error("❌ Error creating page:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
};

export const getPages = async (req, res) => {
  try {
    const pages = await Page.find().sort({ createdAt: -1 });
    console.log(`✅ Retrieved ${pages.length} pages`);
    return res.json(pages);
  } catch (error) {
    console.error("❌ Error fetching pages:", error);
    return res.status(500).json({ message: "Failed to fetch pages" });
  }
};


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
    const { title, color, content, textcolor } = req.body;
    
    const updateFields = {};
    if (title !== undefined) updateFields.title = title.trim();
    if (color !== undefined) updateFields.color = color;
    if (content !== undefined) updateFields.content = content;
    if (textcolor !== undefined) updateFields.textcolor = textcolor;

    const updated = await Page.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Page not found" });
    console.log("✅ Page updated:", updated);
    return res.json(updated);
  } catch (error) {
    console.error("❌ Error during page update:", error);
    return res.status(400).json({ message: "Invalid page id or data" });
  }
};


export const deletePage = async (req, res) => {
  try {
    const deleted = await Page.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Page not found" });
    console.log("✅ Page deleted:", deleted._id);
    return res.json({ message: "Page deleted successfully" });
  } catch (error) {
    console.error("❌ Error during page deletion:", error);
    return res.status(400).json({ message: "Invalid page id" });
  }
};