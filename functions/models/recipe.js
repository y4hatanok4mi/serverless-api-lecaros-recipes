const mongoose = require("mongoose");
const recipeSchema = require("../schema/recipe");

const RecipeInfo = mongoose.model("Recipe", recipeSchema);

module.exports = RecipeInfo;