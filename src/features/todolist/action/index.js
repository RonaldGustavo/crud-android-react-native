import {
  GET_DATA_DETAIL_TODOLIST,
  GET_DATA_TODOLIST,
  IS_LOADING_TODOLIST,
  PAGINATION_TODOLIST,
  iS_LOADING_DETAIL_TODOLIST,
} from '../../../constants';
import {getDataTodolistService, getDetailDataTodolistService} from '../service';

export const getDataTodolistAction = (page, limit, query, username) => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING_TODOLIST,
      payload: {
        isLoading: true,
      },
    });

    try {
      const data = await getDataTodolistService(page, limit, query, username);
      // console.log('data all', data);
      dispatch({
        type: GET_DATA_TODOLIST,
        payload: {
          isLoading: false,
          data: data.data,
        },
      });

      dispatch({
        type: PAGINATION_TODOLIST,
        payload: {
          pagination: data.pagination,
        },
      });
    } catch (error) {
      console.log('error action list', error);
    }
  };
};

export const getDataDetailTodolistAction = id => {
  return async dispatch => {
    dispatch({
      type: iS_LOADING_DETAIL_TODOLIST,
      payload: {
        isLoadingDetail: true,
      },
    });

    try {
      const data = await getDetailDataTodolistService(id);
      console.log('data detail', data);
      dispatch({
        type: GET_DATA_DETAIL_TODOLIST,
        payload: {
          dataDetail: data.data,
          isLoadingDetail: false,
        },
      });
    } catch (error) {
      console.log('error action Detail list', error);
    }
  };
};
