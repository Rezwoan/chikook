import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { chickenCurryRecipe } from '../data/recipes';
import type { Recipe } from '../data/recipes';

interface RecipeLibraryStore {
  recipes: Recipe[];
  activeRecipeId: string | null;

  // Actions
  importRecipe: (recipe: Recipe) => void;
  deleteRecipe: (id: string) => void;
  setActiveRecipe: (id: string) => void;
  clearActiveRecipe: () => void;
  getActiveRecipe: () => Recipe | null;
  updateRecipe: (recipe: Recipe) => void;
}

export const useRecipeStore = create<RecipeLibraryStore>()(
  persist(
    (set, get) => ({
      // Seed with the built-in chicken curry recipe
      recipes: [chickenCurryRecipe],
      activeRecipeId: null,

      importRecipe: (recipe: Recipe) => {
        set((state) => {
          // Replace if same id, otherwise append
          const exists = state.recipes.some((r) => r.id === recipe.id);
          return {
            recipes: exists
              ? state.recipes.map((r) => (r.id === recipe.id ? recipe : r))
              : [...state.recipes, recipe],
          };
        });
      },

      deleteRecipe: (id: string) => {
        set((state) => ({
          recipes: state.recipes.filter((r) => r.id !== id),
          activeRecipeId: state.activeRecipeId === id ? null : state.activeRecipeId,
        }));
      },

      setActiveRecipe: (id: string) => {
        set({ activeRecipeId: id });
      },

      clearActiveRecipe: () => {
        set({ activeRecipeId: null });
      },

      getActiveRecipe: () => {
        const { recipes, activeRecipeId } = get();
        if (!activeRecipeId) return null;
        return recipes.find((r) => r.id === activeRecipeId) ?? null;
      },

      updateRecipe: (recipe: Recipe) => {
        set((state) => ({
          recipes: state.recipes.map((r) => (r.id === recipe.id ? recipe : r)),
        }));
      },
    }),
    {
      name: 'recipe-library',
    }
  )
);
