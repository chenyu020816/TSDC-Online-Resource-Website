import { createStore, combineReducers } from "redux";
import { selectedReducer } from "redux/reducers/selectedReducers";
import { CourseReducer } from "redux/reducers/CourseReducers";
import { KeywordReducer } from 'redux/reducers/KeywordReducers';
import { roadmapReducer } from 'redux/reducers/roadmapReducers';
import { planInfoReducer } from 'redux/reducers/planInfoReducers';
import { planTagsReducer } from 'redux/reducers/planTagsReducers';

const reducer = combineReducers({
    keyword: KeywordReducer,
    course: CourseReducer,
    roadmap: roadmapReducer,
    //selectedItem: selectedReducer,
    //planTags: planTagsReducer,
    //googleMap: googleMapReducer
});

const store = createStore(reducer);

export default store;
