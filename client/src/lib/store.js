/* A simple redux store/actions/reducer implementation.
 * A true app would be more complex and separated into different files.
 */
import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { CollagesManagementSlice, sidebarSlice } from '../dataLogic/CollageManagementSlice.js'
const store = configureStore({
  reducer: {
    collagesManagement: CollagesManagementSlice.reducer,
    sidebarStates: sidebarSlice.reducer,
  },
})

export default store
