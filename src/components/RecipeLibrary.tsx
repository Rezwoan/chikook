import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ChefHat, Play, BookOpen } from 'lucide-react';
import { useRecipeStore } from '../store/recipeStore';
import { useCookingStore } from '../store/cookingStore';
import type { Recipe } from '../data/recipes';
import RecipeImport from './RecipeImport';

interface RecipeLibraryProps {
  onStartCooking: () => void;
}

const RecipeLibrary: React.FC<RecipeLibraryProps> = ({ onStartCooking }) => {
  const { recipes, deleteRecipe, setActiveRecipe } = useRecipeStore();
  const loadRecipe = useCookingStore((state) => state.loadRecipe);
  const [showImport, setShowImport] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleCook = (recipe: Recipe) => {
    setActiveRecipe(recipe.id);
    loadRecipe(recipe.steps);
    onStartCooking();
  };

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      deleteRecipe(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      // Auto-cancel confirm after 3s
      setTimeout(() => setDeleteConfirm((c) => (c === id ? null : c)), 3000);
    }
  };

  const totalSteps = (r: Recipe) => r.steps.length;
  const timerSteps = (r: Recipe) => r.steps.filter((s) => s.timerDuration && s.timerDuration > 0).length;

  return (
    <div className="recipe-library">
      {/* Header */}
      <div className="library-header">
        <div className="library-hero">
          <div className="library-hero-icon">
            <ChefHat size={36} />
          </div>
          <div>
            <h1 className="library-title">My Recipes</h1>
            <p className="library-subtitle">{recipes.length} recipe{recipes.length !== 1 ? 's' : ''} saved</p>
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.92 }}
          className="library-import-btn"
          onClick={() => setShowImport(true)}
          aria-label="Import recipe"
        >
          <Plus size={20} />
          <span>Import Recipe</span>
        </motion.button>
      </div>

      {/* Recipe Grid */}
      <div className="recipe-grid">
        <AnimatePresence>
          {recipes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="recipe-empty"
            >
              <BookOpen size={48} />
              <h3>No recipes yet</h3>
              <p>Import a recipe using JSON to get started.</p>
              <motion.button
                whileTap={{ scale: 0.92 }}
                className="library-import-btn"
                onClick={() => setShowImport(true)}
              >
                <Plus size={18} />
                <span>Import your first recipe</span>
              </motion.button>
            </motion.div>
          ) : (
            recipes.map((recipe, i) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.06, type: 'spring', stiffness: 280, damping: 28 }}
                className="recipe-card"
              >
                <div className="recipe-card-top">
                  <div className="recipe-card-emoji">{recipe.emoji}</div>
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    className={`recipe-delete-btn${deleteConfirm === recipe.id ? ' confirm' : ''}`}
                    onClick={() => handleDelete(recipe.id)}
                    aria-label={deleteConfirm === recipe.id ? 'Confirm delete' : 'Delete recipe'}
                    title={deleteConfirm === recipe.id ? 'Tap again to confirm delete' : 'Delete recipe'}
                  >
                    <Trash2 size={16} />
                    {deleteConfirm === recipe.id && <span>Confirm?</span>}
                  </motion.button>
                </div>

                <div className="recipe-card-body">
                  <h2 className="recipe-card-name">{recipe.name}</h2>
                  <p className="recipe-card-desc">{recipe.description}</p>
                </div>

                <div className="recipe-card-meta">
                  <span className="recipe-meta-pill">
                    <span className="meta-dot steps-dot" />
                    {totalSteps(recipe)} steps
                  </span>
                  {timerSteps(recipe) > 0 && (
                    <span className="recipe-meta-pill">
                      <span className="meta-dot timer-dot" />
                      {timerSteps(recipe)} timer{timerSteps(recipe) !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="recipe-cook-btn"
                  onClick={() => handleCook(recipe)}
                >
                  <Play size={18} fill="currentColor" />
                  <span>Start Cooking</span>
                </motion.button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Import Modal */}
      <AnimatePresence>
        {showImport && (
          <RecipeImport onClose={() => setShowImport(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecipeLibrary;
