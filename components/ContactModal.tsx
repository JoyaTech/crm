
import React from 'react';
import { Contact } from '../types';
import { XIcon } from './Icons';

interface ContactModalProps {
  contact: Contact | null;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ contact, onClose }) => {
  if (!contact) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-2xl border border-slate-700 w-full max-w-lg">
        <header className="p-4 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">{contact.fullName}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-700">
            <XIcon className="w-5 h-5 text-slate-400" />
          </button>
        </header>
        <main className="p-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-400">Email</p>
              <p className="text-sky-400">{contact.email}</p>
            </div>
            <div>
              <p className="text-slate-400">Phone</p>
              <p className="text-slate-200">{contact.phone}</p>
            </div>
            <div>
              <p className="text-slate-400">Company</p>
              <p className="text-slate-200">{contact.company}</p>
            </div>
            <div>
              <p className="text-slate-400">Title</p>
              <p className="text-slate-200">{contact.title}</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ContactModal;
