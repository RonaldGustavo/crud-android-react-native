import {
  CHANGE_LIMIT,
  CHANGE_PAGE,
  CHANGE_QUERY,
  GET_DATA_DETAIL_OFFLINE_TODOLIST,
  GET_DATA_DETAIL_TODOLIST,
  GET_DATA_TODOLIST,
  IS_LOADING_TODOLIST,
  PAGINATION_DETAIL_TODOLIST,
  PAGINATION_TODOLIST,
  iS_LOADING_DETAIL_TODOLIST,
} from '../../../constants';

const initialState = {
  data: [],
  dataDetail: {},
  dataDetailOffline: {},
  isLoading: false,
  isLoadingDetail: false,
  pagination: {},
  paginationDetail: {},
  curPage: 1,
  limit: 5,
  keyword: '',
};

const todolistReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_DATA_TODOLIST:
      return {
        ...state,
        data: action.payload.data,
        isLoading: action.payload.isLoading,
      };
    case IS_LOADING_TODOLIST:
      return {
        ...state,
        isLoading: action.payload.isLoading,
      };
    case PAGINATION_TODOLIST:
      return {
        ...state,
        pagination: action.payload.pagination,
      };
    case PAGINATION_DETAIL_TODOLIST:
      return {
        ...state,
        paginationDetail: action.payload.paginationDetail,
      };
    case GET_DATA_DETAIL_TODOLIST:
      return {
        ...state,
        dataDetail: action.payload.dataDetail,
        isLoadingDetail: action.payload.isLoadingDetail,
      };
    case GET_DATA_DETAIL_OFFLINE_TODOLIST:
      return {
        ...state,
        dataDetailOffline: action.payload.dataDetailOffline,
      };
    case iS_LOADING_DETAIL_TODOLIST:
      return {
        ...state,
        isLoadingDetail: action.payload.isLoadingDetail,
      };
    case CHANGE_PAGE:
      return {
        ...state,
        curPage: action.payload.page,
      };
    case CHANGE_LIMIT:
      return {
        ...state,
        limit: action.payload.limit,
      };
    case CHANGE_QUERY:
      return {
        ...state,
        keyword: action.payload.keyword,
      };
    default:
      return state;
  }
};

export default todolistReducer;
