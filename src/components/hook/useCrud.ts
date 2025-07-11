import { useState, useEffect, useCallback } from 'react';
import { CrudService } from '../../services/crudService';

export const useCrud = <T extends { id: number; activo?: boolean }>(service: CrudService<T>) => {
  const [items, setItems] = useState<T[]>([]);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');

  const loadItems = useCallback(async () => {
    try {
      const data = await service.getAll();
      setItems(data.filter(item => item.activo !== false));
    } catch (error) {
      console.error('Error al cargar los items:', error);
      setMessage('Error al cargar los datos.');
    }
  }, [service]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleSubmit = async (values: Omit<T, 'id'>) => {
    try {
      if (editingItem) {
        await service.update(editingItem.id, values);
        setMessage('Elemento actualizado con éxito.');
      } else {
        await service.create(values);
        setMessage('Elemento creado con éxito.');
      }
      setShowForm(false);
      setEditingItem(null);
      loadItems();
    } catch (err) {
      console.error(err);
      setMessage('Error al guardar el elemento.');
    } finally {
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleEdit = (item: T) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await service.remove(id);
      setMessage('Elemento eliminado con éxito.');
      loadItems();
    } catch (err) {
      console.error(err);
      setMessage('Error al eliminar el elemento.');
    } finally {
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
    setShowForm(false);
  };
  
  const handleCreateNew = () => {
    setEditingItem(null);
    setShowForm(true);
  }

  return {
    items,
    editingItem,
    showForm,
    message,
    fetchItems: loadItems,
    setMessage,
    actions: {
      handleEdit,
      handleDelete,
      handleSubmit,
      handleCancel,
      handleCreateNew,
    },
  };
};