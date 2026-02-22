export interface CookingStep {
  id: number;
  description: string;
  timerDuration?: number; // in seconds (null if no timer needed)
  completed: boolean;
  iconType: string;
}

export const cookingSteps: CookingStep[] = [
  {
    id: 1,
    description: 'Heat 4 tbsp cooking oil.',
    completed: false,
    iconType: 'flame',
  },
  {
    id: 2,
    description: 'Add 1/4 tsp salt and 1/4 tsp turmeric to the oil.',
    completed: false,
    iconType: 'spice',
  },
  {
    id: 3,
    description: 'Fry 2 medium potatoes (cut into chunks), then remove and set aside.',
    completed: false,
    iconType: 'potato',
  },
  {
    id: 4,
    description: 'Add 2 medium thinly sliced onions to the oil.',
    completed: false,
    iconType: 'onion',
  },
  {
    id: 5,
    description: 'Add 1/2 tsp salt, 7 cardamoms, 2 small cinnamon sticks, 8 cloves, 3 bay leaves, and 8-10 peppercorns. Fry until brown.',
    completed: false,
    iconType: 'spices',
  },
  {
    id: 6,
    description: 'Add 1 tbsp ginger paste.',
    completed: false,
    iconType: 'ginger',
  },
  {
    id: 7,
    description: 'Add 1 kg chicken.',
    completed: false,
    iconType: 'chicken',
  },
  {
    id: 8,
    description: 'Add 3/4 tsp turmeric, 1/2 tsp red chili powder, 1 tsp Kashmiri red chili, and 1 tsp salt (to taste).',
    completed: false,
    iconType: 'spice-mix',
  },
  {
    id: 9,
    description: 'Sauté for 5 minutes on medium heat.',
    timerDuration: 300, // 5 minutes in seconds
    completed: false,
    iconType: 'timer',
  },
  {
    id: 10,
    description: 'Cover and cook for 5 minutes on low heat.',
    timerDuration: 300, // 5 minutes
    completed: false,
    iconType: 'pot-lid',
  },
  {
    id: 11,
    description: 'Uncover and add 1 1/2 tsp coriander powder, 1 tsp cumin powder, and 1/2 tsp garam masala.',
    completed: false,
    iconType: 'spice-powder',
  },
  {
    id: 12,
    description: 'Cover and cook for 10 minutes on low heat, stirring occasionally.',
    timerDuration: 600, // 10 minutes
    completed: false,
    iconType: 'cook',
  },
  {
    id: 13,
    description: 'Uncover and add the fried potatoes.',
    completed: false,
    iconType: 'add',
  },
  {
    id: 14,
    description: 'Pour in 2 cups hot water.',
    completed: false,
    iconType: 'water',
  },
  {
    id: 15,
    description: 'Cover and cook for 12-15 minutes on low heat.',
    timerDuration: 780, // 13 minutes (average of 12-15)
    completed: false,
    iconType: 'simmer',
  },
  {
    id: 16,
    description: 'Add 1/4 tsp roasted cumin and a small pinch of sugar.',
    completed: false,
    iconType: 'finish',
  },
];
