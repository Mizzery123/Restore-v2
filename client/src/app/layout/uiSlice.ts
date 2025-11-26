// creates a small Redux “slice” that keeps track of whether the UI is loading or not.

import { createSlice } from "@reduxjs/toolkit";

const getInitialDarkMode = () => { 
  const storedDarkMode = localStorage.getItem('darkMode'); 
  //Retrieves the saved dark mode value from localStorage (if it exists)
  return storedDarkMode? JSON.parse(storedDarkMode) : true   
  // If a value was found, convert it back to boolean.
  // If not found, default to true (dark mode ON by default).
}

export const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        isLoading: false,
        darkMode: getInitialDarkMode()
    },
    reducers: {
        startLoading: (state) => {
            state.isLoading = true;
        },
        stopLoading: (state) => {
            state.isLoading = false;
        },
        setDarkMode: (state) => {
            localStorage.setItem('darkMode', JSON.stringify(!state.darkMode));  // Save the *new* value to localStorage
            state.darkMode = !state.darkMode
        }
    }
});

export const {startLoading, stopLoading, setDarkMode} = uiSlice.actions;