import mongoose from "mongoose";

const pageSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  content: { 
    type: String, 
    default: "" // Allow empty content initially
  },
  color: { 
    type: String, 
    required: true,
    default: "#fef3c7"
  },
  textcolor: { 
    type: String, 
    required: true,
    default: "#000000"
  },
}, {
  timestamps: true // Adds createdAt and updatedAt
});

const Page = mongoose.model("Page", pageSchema);
export default Page;