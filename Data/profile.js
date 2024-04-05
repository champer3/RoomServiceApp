import {createSlice} from '@reduxjs/toolkit'

export const profile = createSlice({
    name : 'profile',
    initialState: {
        profile : {
            firstName: '',
            lastName: '',
            phoneNumber: '+',
            email: '',
            language: 'English (United States)',
            address: []
          },
    },
    reducers: {
        updateProfile : (state, action) => {state.profile = {...action.payload.id}}
    }
})

export const updateProfile = profile.actions.updateProfile
export default profile.reducer