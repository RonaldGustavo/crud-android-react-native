import {combineReducers} from 'redux';
import todolistReducer from '../../features/todolist/reducer';
import authReducer from '../../features/auth/reducer';

export default combineReducers({
  todolist: todolistReducer,
  auth: authReducer,
});
