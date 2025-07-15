import { useState, useEffect, useCallback } from 'react';
import { CrudService } from '../../services/crudService';
import { getHumanReadableError } from '../../utils/errorUtils';
export type MessageState = {
  text: string;
  severity: 'success' | 'error';
};

export const useCrud = <T extends { id: number; activo?: boolean }>(service: CrudService<T>) => {
  const [items, setItems] = useState<T[]>([]);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState<MessageState | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);

  const [highlightedId, setHighlightedId] = useState<number | null>(null);

  const loadItems = useCallback(async () => {
    try {
      const data = await service.getAll();
      setItems(data.filter(item => item.activo !== false));
    } catch (error) {
      console.error('Error al cargar los items:', error);
      setMessage({ text: 'Error al cargar los datos.', severity: 'error' });
    }
  }, [service]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleSubmit = async (values: Omit<T, 'id'>) => {
    try {
      let changedItem: T;
      if (editingItem) {
        changedItem = await service.update(editingItem.id, values);
        setMessage({ text: 'Elemento actualizado con éxito.', severity: 'success' });
      } else {
        changedItem = await service.create(values);
        setMessage({ text: 'Elemento creado con éxito.', severity: 'success' });
      }
      setShowForm(false);
      setEditingItem(null);
      await loadItems();
      
      setHighlightedId(changedItem.id);
      setTimeout(() => setHighlightedId(null), 4000);

   } catch (err: any) {
    console.error("Error completo recibido:", err); // Mantenemos esto para depuración.

    // 👇 Usamos la función para obtener el mensaje limpio.
    const cleanError = getHumanReadableError(err);
    
    setMessage({ text: cleanError, severity: 'error' });
    setTimeout(() => setMessage(null), 8000); // Mensaje de error por 8 seg.
  }
};
  const handleEdit = (item: T) => {
    setEditingItem(item);
    setShowForm(true);
  };
  
  const handleDelete = (item: T) => {
    setIdToDelete(item.id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (idToDelete === null) return;
    try {
      await service.remove(idToDelete);
      setMessage({ text: 'Elemento eliminado con éxito.', severity: 'success' });
      loadItems();
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Error al eliminar el elemento.', severity: 'error' });
    } finally {
      setConfirmOpen(false);
      setIdToDelete(null);
      setTimeout(() => setMessage(null), 3000);
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
    confirmOpen,
    highlightedId,
    setConfirmOpen,
    confirmDelete,
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