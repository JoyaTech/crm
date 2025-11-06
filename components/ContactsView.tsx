import React, { useState, useMemo } from 'react';
import { Contact, User } from '../types';
import { PlusIcon, FilterIcon, SearchIcon } from './Icons';

interface ContactsViewProps {
  contacts: Contact[];
  users: User[];
  onAddNew: () => void;
  onEdit: (contact: Contact) => void;
}

const ContactsView: React.FC<ContactsViewProps> = ({ contacts, users, onAddNew, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState({ key: 'fullName' as keyof Contact, order: 'asc' });

  const filteredAndSortedContacts = useMemo(() => {
    const filtered = contacts.filter(contact =>
      contact.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Create a shallow copy before sorting to avoid side effects
    const sorted = [...filtered].sort((a, b) => {
      const aVal = a[sort.key] as string | undefined ?? '';
      const bVal = b[sort.key] as string | undefined ?? '';
      if (aVal < bVal) return sort.order === 'asc' ? -1 : 1;
      if (aVal > bVal) return sort.order === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [contacts, searchTerm, sort]);

  const handleSort = (key: keyof Contact) => {
    if (sort.key === key) {
      setSort({ key, order: sort.order === 'asc' ? 'desc' : 'asc' });
    } else {
      setSort({ key, order: 'asc' });
    }
  };

  const SortIndicator: React.FC<{ sortKey: keyof Contact }> = ({ sortKey }) => {
    if (sort.key !== sortKey) return null;
    return <span className="ml-1">{sort.order === 'asc' ? '▲' : '▼'}</span>;
  };

  const getOwner = (ownerId: string) => users.find(u => u.id === ownerId);

  return (
    <div className="p-4 sm:p-6 md:p-8 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white mb-4 sm:mb-0">אנשי קשר</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="חיפוש אנשי קשר..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>
          <button className="flex items-center gap-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 font-bold py-2 px-4 rounded-lg transition-colors">
            <FilterIcon className="w-5 h-5" />
            <span>פילטר</span>
          </button>
          <button 
            onClick={onAddNew}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            <PlusIcon className="w-5 h-5" />
            <span>איש קשר חדש</span>
          </button>
        </div>
      </div>
      <div className="flex-grow overflow-auto bg-slate-800/50 border border-slate-700 rounded-xl">
        <table className="w-full text-sm text-left text-slate-400">
          <thead className="text-xs text-slate-300 uppercase bg-slate-900/70 sticky top-0">
            <tr>
              <th scope="col" className="p-4 w-12">
                <input type="checkbox" className="w-4 h-4 text-sky-600 bg-slate-700 border-slate-600 rounded focus:ring-sky-500" />
              </th>
              <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('fullName')}>
                שם <SortIndicator sortKey="fullName" />
              </th>
              <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('email')}>
                אימייל <SortIndicator sortKey="email" />
              </th>
              <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('company')}>
                חברה <SortIndicator sortKey="company" />
              </th>
              <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('ownerId')}>
                בעלים <SortIndicator sortKey="ownerId" />
              </th>
              <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('status')}>
                סטטוס <SortIndicator sortKey="status" />
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">עריכה</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedContacts.map(contact => {
              const owner = getOwner(contact.ownerId);
              return (
                <tr key={contact.id} className="bg-slate-800 border-b border-slate-700 hover:bg-slate-700/50">
                  <td className="w-4 p-4">
                    <input type="checkbox" className="w-4 h-4 text-sky-600 bg-slate-600 border-slate-500 rounded focus:ring-sky-500" />
                  </td>
                  <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">
                    {contact.fullName}
                  </th>
                  <td className="px-6 py-4">{contact.email}</td>
                  <td className="px-6 py-4">{contact.company}</td>
                  <td className="px-6 py-4">
                    {owner && (
                      <div className="flex items-center gap-2">
                        <div title={owner.name} className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-sky-300 text-xs font-bold ring-2 ring-slate-700">
                          {owner.name.charAt(0)}
                        </div>
                        {owner.name}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        contact.status === 'Active' ? 'bg-green-500/10 text-green-400' :
                        contact.status === 'New' ? 'bg-sky-500/10 text-sky-400' :
                        'bg-slate-600/20 text-slate-500'
                    }`}>
                      {contact.status === 'Active' ? 'פעיל' : contact.status === 'New' ? 'חדש' : 'לא פעיל'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => onEdit(contact)} className="font-medium text-sky-500 hover:underline">ערוך</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactsView;