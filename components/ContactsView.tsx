
import React from 'react';
import { useCRM } from '../contexts/CRMContext';
import { SearchIcon, PlusIcon } from './Icons';

const ContactsView: React.FC = () => {
  const { contacts } = useCRM();

  return (
    <div className="h-full flex flex-col">
      <header className="p-6 border-b border-slate-700 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Contacts</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search contacts..." 
              className="bg-slate-700 border border-slate-600 rounded-md pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-500">
            <PlusIcon className="w-4 h-4" />
            New Contact
          </button>
        </div>
      </header>
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="bg-slate-800 rounded-lg border border-slate-700">
          <table className="w-full text-left">
            <thead className="border-b border-slate-700">
              <tr>
                <th className="p-4 font-semibold text-slate-300">Name</th>
                <th className="p-4 font-semibold text-slate-300">Email</th>
                <th className="p-4 font-semibold text-slate-300">Company</th>
                <th className="p-4 font-semibold text-slate-300">Status</th>
                <th className="p-4 font-semibold text-slate-300">Source</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map(contact => (
                <tr key={contact.id} className="border-b border-slate-700 last:border-b-0 hover:bg-slate-700/50">
                  <td className="p-4 text-white font-medium">{contact.fullName}</td>
                  <td className="p-4 text-sky-400">{contact.email}</td>
                  <td className="p-4">{contact.company}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      contact.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-slate-600 text-slate-300'
                    }`}>{contact.status}</span>
                  </td>
                  <td className="p-4">{contact.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContactsView;
