import Realm from 'realm';

// Define your object model
export class TodolistCreate extends Realm.Object {
  static schema = {
    name: 'TodolistCreate',
    properties: {
      _id: 'string',
      user: 'string',
      activity: 'string',
      description: 'string',
      created_at: 'date',
      updated_at: 'date',
    },
    primaryKey: '_id',
  };
}

export class ToodlistUpdate extends Realm.Object {
  static schema = {
    name: 'TodolistUpdate',
    properties: {
      _id: 'string',
      user: 'string',
      activity: 'string',
      description: 'string',
      created_at: 'date',
      updated_at: 'date',
    },
    primaryKey: '_id',
  };
}

export class TodolistRead extends Realm.Object {
  static schema = {
    name: 'TodolistRead',
    properties: {
      _id: 'string',
      user: 'string',
      activity: 'string',
      description: 'string',
      created_at: 'date',
      updated_at: 'date',
    },
    primaryKey: '_id',
  };
}

export class TodolistDelete extends Realm.Object {
  static schema = {
    name: 'TodolistDelete',
    properties: {
      _id: 'string',
      user: 'string',
    },
    primaryKey: '_id',
  };
}
