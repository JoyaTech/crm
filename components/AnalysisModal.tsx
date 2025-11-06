
import React from 'react';
import { Inquiry, AnalysisResult } from '../types';
import { XIcon, SparklesIcon, AlertTriangleIcon, ShieldCheckIcon, CalendarIcon, SheetIcon, FileTextIcon, FolderIcon, CheckCircleIcon } from './Icons';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiry: Inquiry | null;
  analysisResult: AnalysisResult | null;
  isLoading: boolean;
}

const AnalysisModal: React.FC<AnalysisModalProps> = ({ isOpen, onClose, inquiry, analysisResult, isLoading }) => {
    if (!isOpen) return null;

    const ActionItem: React.FC<{ icon: React.ReactNode; text: string; enabled: boolean }> = ({ icon, text, enabled }) => (
        <div className={`flex items-center gap-3 p-3 rounded-lg ${enabled ? 'bg-slate-700' : 'bg-slate-700/50 text-slate-500'}`}>
            {icon}
            <span className={enabled ? 'text-slate-200' : ''}>{text}</span>
            {enabled && <CheckCircleIcon className="w-5 h-5 text-green-400 ml-auto" />}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center" dir="rtl" onClick={onClose}>
            <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl border border-slate-700 m-4 flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-slate-700 flex-shrink-0">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <SparklesIcon className="w-6 h-6 text-sky-400" />
                        <span>ניתוח פנייה עם AI</span>
                    </h2>
                    <button type="button" onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-700">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-grow p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                            <SparklesIcon className="w-12 h-12 text-sky-400 animate-pulse" />
                            <p className="mt-4 text-lg text-slate-300">מנתח את הפנייה... זה עשוי לקחת מספר שניות.</p>
                        </div>
                    ) : analysisResult && inquiry ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 space-y-4">
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-2">{inquiry.subject}</h3>
                                    <div className="space-y-2 text-sm">
                                        <p><strong className="text-slate-400 font-medium">שם:</strong> <span className="text-slate-200">{inquiry.name}</span></p>
                                        <p><strong className="text-slate-400 font-medium">אימייל:</strong> <span className="text-slate-200">{inquiry.email}</span></p>
                                        {inquiry.phone && <p><strong className="text-slate-400 font-medium">טלפון:</strong> <span className="text-slate-200">{inquiry.phone}</span></p>}
                                        <p><strong className="text-slate-400 font-medium">תחום עניין:</strong> <span className="text-slate-200">{inquiry.service_interest}</span></p>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-700">
                                    <h4 className="text-base font-semibold text-slate-200 mb-2">תוכן הפנייה:</h4>
                                    <p className="text-sm text-slate-300 whitespace-pre-wrap bg-slate-800 p-3 rounded-md">{inquiry.message}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 text-center">
                                        <h4 className="text-sm font-medium text-slate-400 mb-1">פוטנציאל</h4>
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-base font-bold ${
                                            analysisResult.potential_score === 'high' ? 'bg-green-500/10 text-green-400' :
                                            analysisResult.potential_score === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                                            'bg-red-500/10 text-red-400'
                                        }`}>
                                            {analysisResult.potential_score === 'high' ? <ShieldCheckIcon className="w-5 h-5"/> : <AlertTriangleIcon className="w-5 h-5"/>}
                                            <span>{analysisResult.potential_score === 'high' ? 'גבוה' : analysisResult.potential_score === 'medium' ? 'בינוני' : 'נמוך'}</span>
                                        </div>
                                    </div>
                                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 text-center">
                                        <h4 className="text-sm font-medium text-slate-400 mb-1">מעורבות אנושית</h4>
                                        <p className={`text-base font-bold ${analysisResult.human_required ? 'text-sky-400' : 'text-slate-300'}`}>
                                            {analysisResult.human_required ? 'נדרשת' : 'לא נדרשת'}
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                                    <h4 className="font-semibold text-white mb-2">סיכום והמלצות</h4>
                                    <p className="text-sm text-slate-300">
                                        קטגוריה מוצעת: <span className="font-bold text-sky-300">{analysisResult.suggested_category}</span><br/>
                                        סטטוס מוצע: <span className="font-bold text-sky-300">{analysisResult.suggested_status === 'in_progress' ? 'בטיפול' : 'טופל'}</span>
                                    </p>
                                </div>
                                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                                    <h4 className="font-semibold text-white mb-3">תגובה מוצעת ({inquiry.language === 'he' ? 'עברית' : 'אנגלית'})</h4>
                                    <div className="bg-slate-800 p-3 rounded text-sm whitespace-pre-wrap max-h-40 overflow-y-auto">{analysisResult.auto_reply}</div>
                                </div>
                                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                                    <h4 className="font-semibold text-white mb-3">פעולות Google מוצעות</h4>
                                    <div className="space-y-2">
                                        <ActionItem icon={<CalendarIcon className="w-5 h-5 text-sky-400"/>} text="צור אירוע ביומן" enabled={analysisResult.google_action.calendar_event === 'yes'} />
                                        <ActionItem icon={<SheetIcon className="w-5 h-5 text-green-400"/>} text="תעד ב-Google Sheet" enabled={analysisResult.google_action.sheet_log === 'yes'} />
                                        <ActionItem icon={<FileTextIcon className="w-5 h-5 text-blue-400"/>} text="צור מסמך סיכום" enabled={analysisResult.google_action.create_doc_summary === 'yes'} />
                                        <ActionItem icon={<FolderIcon className="w-5 h-5 text-yellow-400"/>} text="שתף תיקייה ב-Drive" enabled={analysisResult.google_action.share_drive_folder === 'yes'} />
                                    </div>
                                    <h5 className="font-semibold text-slate-300 mt-4 mb-2 text-sm">הערות לצוות:</h5>
                                    <p className="text-sm text-slate-400 bg-slate-800 p-2 rounded">{analysisResult.google_action.notes}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                            <AlertTriangleIcon className="w-12 h-12 text-red-400" />
                            <p className="mt-4 text-lg text-slate-300">אירעה שגיאה בניתוח הפנייה.</p>
                        </div>
                    )}
                </div>

                <div className="flex-shrink-0 flex justify-end items-center p-4 bg-slate-800/50 border-t border-slate-700 rounded-b-xl gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-slate-600 text-white hover:bg-slate-500 transition-colors">
                        סגור
                    </button>
                    <button type="button" disabled={isLoading || !analysisResult} className="px-4 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-700 transition-colors font-semibold disabled:bg-slate-500 disabled:cursor-not-allowed">
                        בצע פעולות
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AnalysisModal;
