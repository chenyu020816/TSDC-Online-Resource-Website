import { createStore, combineReducers } from "redux";
import { selectedReducer } from "redux/reducers/selectedReducers";
import { spotsReducer } from "redux/reducers/spotsReducers";
import { tagsReducer } from 'redux/reducers/tagsReducers';
import { googleMapReducer } from 'redux/reducers/googleMapReducers';
import { planInfoReducer } from 'redux/reducers/planInfoReducers';
import { planTagsReducer } from 'redux/reducers/planTagsReducers';

const reducer = combineReducers({
    planInfo: planInfoReducer,
    selectedItem: selectedReducer,
    spots: spotsReducer,
    tags: tagsReducer,
    planTags: planTagsReducer,
    googleMap: googleMapReducer
});

const store = createStore(reducer);

export default store;
