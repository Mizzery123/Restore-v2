// A function that takes some state and action and return new state based on action without directly modifying existing state

import { createSlice } from "@reduxjs/toolkit"

export type CounterState = {
    data: number
}

const initialState: CounterState = {
    data: 42
}

export const counterSlice = createSlice({
    name:'counter',
    initialState,
    reducers: {
        increment: (state, action) => {
            state.data += action.payload //mutating state!
        },
        decrement: (state, action) => {
            state.data -= action.payload
        }
    }
})

export const {increment, decrement} = counterSlice.actions;

export function incrementLegacy(amount=1){
    return {
        type: 'increment',
        payload: amount
    }
}

export function decrementLegacy(amount=1){
    return {
        type: 'decrement',
        payload: amount
    }
}

export default function counterReducer(state= initialState, //Fyi only! Redux Toolkit can do this behind scenes and reduce boilerplate!
        action: {type: string, payload: number}){
    switch(action.type) {
        case 'increment':
            return {
                ...state, //Spread operator to spread existing state (Does not mutate data but create new piece of state from original state)
                data: state.data + action.payload
            }
        case 'decrement':
            return{
                ...state,
                data: state.data - action.payload
            }
            break;
        default:
            return state;
    }
}