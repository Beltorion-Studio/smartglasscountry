const inMemoryStore: { [key: string]: any } = {};

const putData = (key: string, value: any): void => {
  inMemoryStore[key] = value;
};

const getData = (key: string): any => {
  return inMemoryStore[key];
};

const updateData = (key: string, newValue: any): void => {
  inMemoryStore[key] = newValue;
};

const deleteData = (key: string): void => {
  delete inMemoryStore[key];
};

export const dbOperations = {
  putData,
  getData,
  updateData,
  deleteData,
};
