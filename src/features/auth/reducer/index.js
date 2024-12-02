import {DATA_USER, GET_TOKEN, IS_CONNECTED} from '../../../constants';

const initialState = {
  dataUser: {},
  connection: true,
  token: '',
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case DATA_USER:
      return {
        ...state,
        dataUser: action.payload.dataUser,
      };
    case IS_CONNECTED:
      return {
        ...state,
        connection: action.payload.connection,
      };
    case GET_TOKEN:
      return {
        ...state,
        token: action.payload.token,
      };
    default:
      return state;
  }
};

export default authReducer;
