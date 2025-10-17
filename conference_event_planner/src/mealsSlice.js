// mealsSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const mealsSlice = createSlice({
  name: 'meals',
  initialState: [
    { name: 'Breakfast', cost: 50, selected: false },
    { name: 'High Tea', cost: 25, selected: false },
    { name: 'Lunch', cost: 65, selected: false },
    { name: 'Dinner', cost: 70, selected: false },
  ],
  reducers: {
    toggleMealSelection: (state, action) => {
      const {payload} = action
      if(state[payload]){
         state[payload].selected = !state[payload].selected;
      }
    },
  },
});

export const { toggleMealSelection } = mealsSlice.actions;

export default mealsSlice.reducer;
