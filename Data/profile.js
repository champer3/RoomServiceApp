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
        updateProfile : (state, action) => {state.profile = {...action.payload.id}},
        resetProfile : (state) => {
            state.profile = {
                firstName: '',
                lastName: '',
                phoneNumber: '+',
                email: '',
                language: 'English (United States)',
                address: []
            };
        }
    }
})

export const { updateProfile, resetProfile } = profile.actions
export default profile.reducer