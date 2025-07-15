export interface CrudService<T> {
  getAll: () => Promise<T[]>;
  create: (data: Omit<T, 'id'>) => Promise<T>;
  update: (id: number, data: Omit<T, 'id'>) => Promise<T>;
  remove: (id: number) => Promise<void>;
}
