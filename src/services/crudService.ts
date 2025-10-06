export interface CrudService<T> {
  getAll: () => Promise<T[]>;
  create: (data: Omit<T, 'id'>) => Promise<T>;
  update: (id: number | string, data: Omit<T, 'id'>) => Promise<T>;
  remove: (id: number | string) => Promise<void>;
}

export interface CrudGet<T> {
  getAll: () => Promise<T[]>;
}