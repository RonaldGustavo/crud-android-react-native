import axios from 'axios';

const baseUrl = '172.23.1.188';

const url = `http://${baseUrl}:8000/todolist`;

export const getDataTodolistService = async (page, limit, query, username) => {
  try {
    const response = await axios({
      url: `${url}/${username}?page=${page}&limit=${limit}&search=${query}`,
      method: 'GET',
    });
    const data = response.data;
    console.log('data service', data.data);
    return data;
  } catch (error) {
    console.log('error service get todolist', error);
    return error;
  }
};

export const getDetailDataTodolistService = async id => {
  try {
    const response = await axios({
      url: `${url}/detail/${id}`,
      method: 'GET',
    });
    console.log('data', response);
    const data = response;
    console.log('data Detail service', data);
    return data;
  } catch (error) {
    console.log('error service get Detail todolist', error);
    return error;
  }
};

export const createTodoListService = async body => {
  try {
    const response = await axios({
      url: `${url}`,
      method: 'POST',
      data: body,
    });

    const data = response.data;
    console.log('berhasil upload', data);
    return data;
  } catch (error) {
    console.log('error service create todolist', error);
    return error;
  }
};

export const updateTodoListService = async (body, id) => {
  try {
    const response = await axios({
      url: `${url}/${id}`,
      method: 'PUT',
      data: body,
    });

    const data = response.data;
    console.log('berhasil update', data);
    return data;
  } catch (error) {
    console.log('error service update todolist', error);
    return error;
  }
};

export const deleteTodoListService = async id => {
  try {
    const response = await axios({
      url: `${url}/${id}`,
      method: 'DELETE',
    });

    const data = response.data;
    console.log('success delete', data);
    return data;
  } catch (error) {
    console.log('error service delete todolist', error);
    return error;
  }
};
