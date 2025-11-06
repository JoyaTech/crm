import React, { useState, useEffect } from 'react';
import { Contact, User } from '../types';
import { XIcon, AlertTriangleIcon } from './Icons';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'fullName'> & { id?: string }) => { success: boolean, error?: string, existingContact?: Contact };
  contactToEdit: Contact | null;
  users: User[];
  currentUserId: string;
}

const initialFormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  title: '',
  source: 'Inbound' as Contact['source'],
  status: 'New' as Contact['status'],
  ownerId: '',
  tags: [],
  notes: '',
};

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, onSave, contactToEdit, users, currentUserId }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (contactToEdit) {
      setFormData({
        firstName: contactToEdit.firstName,
        lastName: contactToEdit.lastName,
        email: contactToEdit.email,
        phone: contactToEdit.phone,
        company: contactToEdit.company,
        title: contactToEdit.title,
        source: contactToEdit.source,
        status: contactToEdit.status,
        ownerId: contactToEdit.ownerId,
        tags: contactToEdit.tags,
        notes: contactToEdit.notes,
      });
    } else {
      setFormData({ ...initialFormState, ownerId: currentUserId });
    }
    setError(null);
  }, [contactToEdit, isOpen, currentUserId]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.firstName || !formData.lastName || !formData.email) {
        setError('שם פרטי, שם משפחה ואימייל הם שדות חובה.');
        return;
    }
    
    const result = onSave({ id: contactToEdit?.id, ...formData });
    if (!result.success && result.error) {
        setError(`${result.error} (קיים אצל: ${result.existingContact?.fullName})`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center" dir="rtl" onClick={onClose}>
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl border border-slate-700 m-4" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center p-4 border-b border-slate-700">
            <h2 className="text-xl font-bold text-white">
              {contactToEdit ? 'עריכת איש קשר' : 'איש קשר חדש'}
            </h2>
            <button type="button" onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-700">
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-4 flex items-center gap-3">
                    <AlertTriangleIcon className="w-5 h-5"/>
                    <span>{error}</span>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Input fields */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-slate-300 mb-1">שם פרטי</label>
                <input type="text" name="firstName" id="firstName" value={formData.firstName} onChange={handleChange} required className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-sky-500 focus:border-sky-500"/>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-slate-300 mb-1">שם משפחה</label>
                <input type="text" name="lastName" id="lastName" value={formData.lastName} onChange={handleChange} required className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-sky-500 focus:border-sky-500"/>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">אימייל</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-sky-500 focus:border-sky-500"/>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-1">טלפון</label>
                <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-sky-500 focus:border-sky-500"/>
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-slate-300 mb-1">חברה</label>
                <input type="text" name="company" id="company" value={formData.company} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-sky-500 focus:border-sky-500"/>
              </div>
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">תפקיד</label>
                <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-sky-500 focus:border-sky-500"/>
              </div>
               <div>
                <label htmlFor="ownerId" className="block text-sm font-medium text-slate-300 mb-1">בעלים</label>
                <select name="ownerId" id="ownerId" value={formData.ownerId} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-sky-500 focus:border-sky-500">
                  {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                </select>
              </div>
               <div>
                <label htmlFor="status" className="block text-sm font-medium text-slate-300 mb-1">סטטוס</label>
                <select name="status" id="status" value={formData.status} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-sky-500 focus:border-sky-500">
                  <option value="New">חדש</option>
                  <option value="Active">פעיל</option>
                  <option value="Inactive">לא פעיל</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="notes" className="block text-sm font-medium text-slate-300 mb-1">פתקים</label>
                <textarea name="notes" id="notes" value={formData.notes} onChange={handleChange} rows={3} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-sky-500 focus:border-sky-500"></textarea>
              </div>
            </div>
          </div>
          <div className="flex justify-end items-center p-4 bg-slate-800/50 border-t border-slate-700 rounded-b-xl gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-slate-600 text-white hover:bg-slate-500 transition-colors">
              ביטול
            </button>
            <button type="submit" className="px-4 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-700 transition-colors font-semibold">
              שמירה
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;
