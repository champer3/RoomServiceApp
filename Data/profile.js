import {createSlice} from '@reduxjs/toolkit'

const profile = createSlice({
    name : 'profile',
    initialState: {
        profile : {
            firstName: '',
            lastName: '',
            phoneNumber: '+',
            email: '',
            language: 'English (United States)',
            password: '',
            payments: [],
            address: []
          },
    },
    reducers: {
        updateProfile : (state, action) => {state.profile = {...action.payload.id}}
    }
})

export const updateProfile = profile.actions.updateProfile
export default profile.reducer