// ─────────────────────────────────────────────────────────────
//  Recipe data types
// ─────────────────────────────────────────────────────────────

export interface RecipeStep {
  id: number;
  description: string;
  emoji: string;
  timerDuration?: number; // seconds, omit or 0 if no timer
}

export interface Recipe {
  id: string;          // unique string, e.g. "chicken-curry-001"
  name: string;        // display name
  emoji: string;       // single emoji representing the dish
  description: string; // short description shown on the recipe card
  steps: RecipeStep[];
}

// ─────────────────────────────────────────────────────────────
//  Built-in: Chicken Curry (converted from original cookingSteps)
// ─────────────────────────────────────────────────────────────

export const chickenCurryRecipe: Recipe = {
  id: "chicken-curry-builtin",
  name: "Chicken Curry",
  emoji: "🍗",
  description: "A rich and aromatic chicken curry with whole spices, ginger, and fried potatoes.",
  steps: [
    { id: 1,  emoji: "🔥", description: "Heat 4 tbsp cooking oil." },
    { id: 2,  emoji: "🧂", description: "Add 1/4 tsp salt and 1/4 tsp turmeric to the oil." },
    { id: 3,  emoji: "🥔", description: "Fry 2 medium potatoes (cut into chunks), then remove and set aside." },
    { id: 4,  emoji: "🧅", description: "Add 2 medium thinly sliced onions to the oil." },
    { id: 5,  emoji: "🌿", description: "Add 1/2 tsp salt, 7 cardamoms, 2 small cinnamon sticks, 8 cloves, 3 bay leaves, and 8-10 peppercorns. Fry until brown." },
    { id: 6,  emoji: "🫚", description: "Add 1 tbsp ginger paste." },
    { id: 7,  emoji: "🍗", description: "Add 1 kg chicken." },
    { id: 8,  emoji: "🌶️", description: "Add 3/4 tsp turmeric, 1/2 tsp red chili powder, 1 tsp Kashmiri red chili, and 1 tsp salt (to taste)." },
    { id: 9,  emoji: "⏱️", description: "Sauté for 5 minutes on medium heat.", timerDuration: 300 },
    { id: 10, emoji: "🫕", description: "Cover and cook for 5 minutes on low heat.", timerDuration: 300 },
    { id: 11, emoji: "🌿", description: "Uncover and add 1½ tsp coriander powder, 1 tsp cumin powder, and 1/2 tsp garam masala." },
    { id: 12, emoji: "🔥", description: "Cover and cook for 10 minutes on low heat, stirring occasionally.", timerDuration: 600 },
    { id: 13, emoji: "🥔", description: "Uncover and add the fried potatoes." },
    { id: 14, emoji: "💧", description: "Pour in 2 cups hot water." },
    { id: 15, emoji: "🫕", description: "Cover and cook for 12-15 minutes on low heat.", timerDuration: 780 },
    { id: 16, emoji: "✅", description: "Add 1/4 tsp roasted cumin and a small pinch of sugar. Serve hot." },
  ],
};

// ─────────────────────────────────────────────────────────────
//  Example JSON template shown in the import screen
// ─────────────────────────────────────────────────────────────

export const EXAMPLE_RECIPE_JSON = `{
  "id": "my-pasta-001",
  "name": "Creamy Pasta",
  "emoji": "🍝",
  "description": "Quick and creamy garlic pasta ready in 20 minutes.",
  "steps": [
    {
      "id": 1,
      "emoji": "💧",
      "description": "Boil a large pot of salted water."
    },
    {
      "id": 2,
      "emoji": "🍝",
      "description": "Cook 250g pasta until al dente.",
      "timerDuration": 480
    },
    {
      "id": 3,
      "emoji": "🧄",
      "description": "Sauté 4 minced garlic cloves in 2 tbsp butter for 1 minute.",
      "timerDuration": 60
    },
    {
      "id": 4,
      "emoji": "🍶",
      "description": "Add 200ml heavy cream and simmer for 3 minutes.",
      "timerDuration": 180
    },
    {
      "id": 5,
      "emoji": "🧀",
      "description": "Toss drained pasta with the sauce and grated parmesan. Serve immediately."
    }
  ]
}`;
