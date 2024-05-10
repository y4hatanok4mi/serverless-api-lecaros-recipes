const express = require("express");
const RecipeInfo = require("../models/recipe");

const router = express.Router();
//Get all recipe
router.get("/", async (req, res) => {
  try {
    const recipe = await RecipeInfo.find();
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get Single Recipe

router.get("/:id", getRecipe, (req, res) => {
  res.json(res.recipe);
});

//create Recipe
router.post("/", async (req, res) => {
  try {
    //validate the request
    if (!req.body.name || !req.body.age) {
      return res.status(400).json({ message: "Name and Ingredients are required" });
    }
    //check if recipe already exists
    const existingRecipe = await RecipeInfo.findOne({
      name: req.body.name,
    });
    if (existingRecipe) {
      return res.status(400).json({ message: "Recipe already exists!" });
    }

    const recipe = new RecipeInfo(req.body);
    const newRecipe = await recipe.save();
    res.status(201).json({ message: "Recipe created", recipe: newRecipe });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//update Recipe
router.patch("/:id", getRecipe, async (req, res) => {
  try {
    if (req.body.name != null) {
      res.recipe.name = req.body.name;
    }
    const updatedRecipe = await res.recipe.save();
    res.json({ message: "Recipe updated", recipe: updatedRecipe });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", getRecipe, async (req, res) => {
  try {
    const updatedRecipe = await RecipeInfo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.json({ message: "Recipe updated", recipe: updatedRecipe });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//delete Recipe
router.delete("/:id", getRecipe, async (req, res) => {
  try {
    await RecipeInfo.findByIdAndDelete(req.params.id);
    res.json({ message: "Recipe deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function getRecipe(req, res, next) {
  try {
    const recipe = await RecipeInfo.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.recipe = recipe;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get recipes by cuisine
router.get('/cuisine/:cuisine', (req, res) => {
  const { cuisine } = req.params;
  const filteredRecipes = recipeSchema.filter(r => r.cuisine.toLowerCase() === cuisine.toLowerCase());
  res.json(filteredRecipes);
});

// Search recipes by ingredients
router.get('/search', (req, res) => {
  const { ingredients } = req.query;
  const ingredientList = ingredients.split(',');
  const matchingRecipes = recipeSchema.filter(recipe => {
    return ingredientList.every(ingredient => recipe.ingredients.includes(ingredient.trim()));
  });
  res.json(matchingRecipes);
});

// Get favorite recipes
router.get('/favorites', (req, res) => {
  const favoriteRecipes = recipeSchema.filter(r => r.favorite);
  res.json(favoriteRecipes);
});

// Mark a recipe as favorite
router.put('/:id/favorite', (req, res) => {
  const { id } = req.params;
  const recipe = recipeSchema.find(r => r.id === parseInt(id));
  if (!recipe) return res.status(404).send('Recipe not found');
  recipe.favorite = true;
  res.json(recipe);
});

// Unmark a recipe as favorite
router.put('/:id/unfavorite', (req, res) => {
  const { id } = req.params;
  const recipe = recipeSchema.find(r => r.id === parseInt(id));
  if (!recipe) return res.status(404).send('Recipe not found');
  recipe.favorite = false;
  res.json(recipe);
});

module.exports = router;