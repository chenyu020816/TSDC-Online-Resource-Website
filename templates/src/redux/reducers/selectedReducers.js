import { ASYNC_STATUS_ERROR, ASYNC_STATUS_LOADED, ASYNC_STATUS_LOADING } from "utils/asyncStatus.constants";

export const CITY_SELECT_LOADING = "CITY_SELECT_LOADING";
export const CITY_SELECT_ERROR = "CITY_SELECT_ERROR";
export const CITY_SELECT_RESET = "CITY_SELECT_RESET";

export const SPOTS_SELECT_LOADING = "SPOTS_SELECT_LOADING";
export const SPOTS_SELECT_ERROR = "SPOTS_SELECT_ERROR";
export const SPOTS_SELECT_RESET = "SPOTS_SELECT_RESET";

export const TAGS_SELECT_LOADING = "TAGS_SELECT_LOADING";
export const TAGS_SELECT_ERROR = "TAGS_SELECT_ERROR";
export const TAGS_SELECT_RESET = "TAGS_SELECT_RESET";

export const CITY_SELECT = "CITY_SELECT"; // LOADED

export const SPOTS_SELECT = "SPOTS_SELECT"; // LOADED
export const SPOTS_REMOVE = "SPOTS_REMOVE"; // LOADED
export const SPOTS_INIT = "SPOTS_INIT"; // LOADED

export const TAGS_SELECT = "TAGS_SELECT"; // LOADED
export const TAGS_REMOVE = "TAGS_REMOVE"; // LOADED

// <--------- Defult Plan reducer --------------->
const DEFAULT_CREATE_PLAN_LIST = {
  selectedCity: [],
  selectedPlanSpot: [],
  selectedTagSpot: [],
  asyncStatusGetSelectedCity: ASYNC_STATUS_LOADED,
  asyncStatusGetSelectedPlanSpot: ASYNC_STATUS_LOADED,
  asyncStatusGetSelectedTagSpot: ASYNC_STATUS_LOADED,
};

export const selectedReducer = (state = DEFAULT_CREATE_PLAN_LIST, action) => {
  switch (action.type) {
    // [CreatePlan]：更新選取的景點
    case CITY_SELECT:
      return { ...state, selectedCity: action.payload, asyncStatusGetSelectedCity: ASYNC_STATUS_LOADED };
    // [CreatePlan]：新增選取的景點
    case SPOTS_SELECT:
      const selectSelectedPlanSpot = [...state.selectedPlanSpot];
      selectSelectedPlanSpot.push(action.payload)
      return { ...state, selectedPlanSpot: selectSelectedPlanSpot, asyncStatusGetSelectedPlanSpot: ASYNC_STATUS_LOADED };
    // [CreatePlan]：刪除已選取的景點
    case SPOTS_REMOVE:
      const arrayPlan = [...state.selectedPlanSpot];
      const updatedSelectedPlanSpot = arrayPlan.filter(item => item.name !== action.payload.name);
      return { ...state, selectedPlanSpot: updatedSelectedPlanSpot, asyncStatusGetSelectedPlanSpot: ASYNC_STATUS_LOADED };
    // [Plan]：初始化景點的清單
    case SPOTS_INIT:
      return { ...state, selectedPlanSpot: action.payload, asyncStatusGetSelectedPlanSpot: ASYNC_STATUS_LOADED };
    // [CreatePlan]：新增選取的標籤
    case TAGS_SELECT:
      const selectSelectedTags = [...state.selectedTagSpot];
      selectSelectedTags.push(action.payload)
      return { ...state, selectedTagSpot: selectSelectedTags };
    // [CreatePlan]：新增選取的標籤
    case TAGS_REMOVE:
      const arrayTag = [...state.selectedTagSpot];
      const updatedSelectedTags = arrayTag.filter(item => item !== action.payload);
      return { ...state, selectedTagSpot: updatedSelectedTags, asyncStatusGetSelectedCity: ASYNC_STATUS_LOADED };
    // STATUS：縣市別
    case CITY_SELECT_LOADING:
      return { ...state, selectedCity: [], asyncStatusGetSelectedCity: ASYNC_STATUS_LOADING };
    case CITY_SELECT_ERROR:
      return {
        ...state,
        asyncStatusGetSelectedCity: {
          ...ASYNC_STATUS_ERROR,
          error: action.payload,
        },
      };
    case CITY_SELECT_RESET:
      return { ...state, selectedCity: [] };
    // STATUS：景點
    case SPOTS_SELECT_LOADING:
      return { ...state, asyncStatusGetSelectedPlanSpot: ASYNC_STATUS_LOADING };
    case SPOTS_SELECT_ERROR:
      return {
        ...state,
        asyncStatusGetSelectedPlanSpot: {
          ...ASYNC_STATUS_ERROR,
          error: action.payload,
        },
      };
    case SPOTS_SELECT_RESET:
      return { ...state, selectedPlanSpot: [] };
    // STATUS：標籤
    case TAGS_SELECT_LOADING:
      return { ...state, selectedTagSpot: [], asyncStatusGetSelectedTagSpot: ASYNC_STATUS_LOADING };
    case TAGS_SELECT_ERROR:
      return {
        ...state,
        asyncStatusGetSelectedTagSpot: {
          ...ASYNC_STATUS_ERROR,
          error: action.payload,
        },
      };
    case TAGS_SELECT_RESET:
      return { ...state, selectedTagSpot: [] };
    default:
      return state;
  }
};
