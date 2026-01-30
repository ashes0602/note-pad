import mongoose from "mongoose";
const pageSchema = new mongoose.Schema({
  title:
   { type: String, required: true },
  content:
   { type: String, required: true },
  color:
   { type: String, required: true },
   textcolor:
   { type: String, required: true},
});
const Page = mongoose.model("Page", pageSchema);
export default Page;
