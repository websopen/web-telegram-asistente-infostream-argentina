import React, { useState } from 'react';
import { X, Save, PlusCircle, Trash2 } from 'lucide-react';

interface PersonalizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'channel' | 'profile';
  categories: string[];
}

interface InputItem {
  value: string;
  category: string;
}

const PersonalizeModal: React.FC<PersonalizeModalProps> = ({ isOpen, onClose, type, categories }) => {
  const [items, setItems] = useState<InputItem[]>([{ value: '', category: categories[0] || '' }]);
  const [showDefaults, setShowDefaults] = useState(true);

  if (!isOpen) return null;

  const handleAddItem = () => {
    if (items.length < 20) {
      setItems([...items, { value: '', category: categories[0] || '' }]);
    }
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems.length ? newItems : [{ value: '', category: categories[0] || '' }]);
  };

  const handleChange = (field: keyof InputItem, text: string, index: number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: text };
    setItems(newItems);
  };

  const label = type === 'channel' ? 'Canal' : 'Perfil';
  const placeholder = type === 'channel' ? '@tucanal' : '@usuario';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gray-900 border border-yellow-500/30 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-800 shrink-0">
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded">PRO</span>
              Personalizar Feed
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          <p className="text-sm text-gray-400">
            Monitorea hasta 20 {type === 'channel' ? 'canales' : 'perfiles'} específicos.
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto no-scrollbar flex-1">
          
          {/* Default Switch */}
          <div className="bg-gray-800/50 rounded-xl p-4 mb-6 flex items-center justify-between border border-gray-700">
            <div>
              <h3 className="text-white font-medium">Contenido por defecto</h3>
              <p className="text-xs text-gray-400">Mostrar sugerencias automáticas de InfoStream</p>
            </div>
            <button 
              onClick={() => setShowDefaults(!showDefaults)}
              className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${showDefaults ? 'bg-green-500' : 'bg-gray-600'}`}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${showDefaults ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* List */}
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex gap-2 animate-in slide-in-from-left-2 duration-200 flex-col sm:flex-row">
                <div className="flex-1 flex gap-2">
                  {/* Input ID */}
                  <input
                    type="text"
                    value={item.value}
                    onChange={(e) => handleChange('value', e.target.value, index)}
                    placeholder={`${placeholder} ${index + 1}`}
                    className="w-full sm:w-[60%] bg-gray-950 border border-gray-700 rounded-lg px-3 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 transition-colors text-sm"
                  />
                  
                  {/* Category Select */}
                  <select
                    value={item.category}
                    onChange={(e) => handleChange('category', e.target.value, index)}
                    className="w-[40%] bg-gray-950 border border-gray-700 rounded-lg px-2 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors text-sm appearance-none"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Remove Button */}
                {items.length > 1 && (
                  <button 
                    onClick={() => handleRemoveItem(index)}
                    className="p-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors self-end sm:self-auto"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))}

            {items.length < 20 && (
              <button
                onClick={handleAddItem}
                className="w-full py-3 border-2 border-dashed border-gray-700 rounded-lg text-gray-500 hover:text-white hover:border-gray-500 transition-colors flex items-center justify-center gap-2 text-sm mt-4"
              >
                <PlusCircle size={20} /> Agregar otro {label} ({items.length}/20)
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-900 border-t border-gray-800 flex justify-end gap-3 shrink-0">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            Cancelar
          </button>
          <button 
            onClick={onClose}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-yellow-500/20 text-sm"
          >
            <Save size={18} /> Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalizeModal;