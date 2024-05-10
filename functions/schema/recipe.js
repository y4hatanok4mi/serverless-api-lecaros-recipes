
const mongoose = require("mongoose");
const { Schema } = mongoose;

const recipeSchema = new Schema ({
  name: {
    type: String,
    required: true,
  },
  cuisine: {
    type: String,
    required: true,
  },
  ingredients: {
    type: [String],
    required: true,
  },
  instructions: {
    type: [String],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  favorite: {
    type: Boolean,
  },
  username: String,
  password: String,
});

recipeSchema.pre("save", function (next) {
  const username = this.name.toLowerCase().replace(/\s/g, "");
  const password = `${this.name}${this.age}`;
  this.username = username;
  this.password = password;
  next();
});

module.exports = recipeSchema;