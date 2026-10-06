import {
    createSlice
} from "@reduxjs/toolkit";

const initialstate = {
    job_feedback: [],
};

const CurrentJobFeedBack = createSlice({
    name: "current_job_feed_back",
    initialState: initialstate,

    reducers: {
        // update the job_feed back view by the feed from the payload
        updateCurrentJobFeedBack: (state, action) => {
            state.job_feedback = action.payload;
        },

        // delete a job-feedback view
        deleteCurrentJobFeedBack: (state, action) => {
            // getting passed payload
            const currentJobFeedBack = action.payload;
            // use filter to return new array that has not the passed payload based on ID
            state.job_feedback = state.job_feedback.filter(
                (feedback) => feedback._id !== currentJobFeedBack._id
            );
        },

        // nullify job and
        resetClearCurrentJobFeedBack: (state) => {
            state.job_feedback = null;
        },
    },
});

// exporting actions
export const {
    updateCurrentJobFeedBack,
    resetClearCurrentJobFeedBack,
    deleteCurrentJobFeedBack,
} = CurrentJobFeedBack.actions;

// exporting the main fun reducer
export default CurrentJobFeedBack.reducer;