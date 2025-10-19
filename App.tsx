
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Entry, Group, Category, CategoryExportData } from './types';
import { GoogleGenAI, Type } from '@google/genai';
import { iconComponents, iconNames, DefaultIcon, defaultIconName, GripVerticalIcon, ArrowUturnRightIcon, ArrowDownTrayIcon, ArrowUpTrayIcon, HeartIcon as HeartIconOutline } from './icons';
import { initialCategories, initialGroups, initialEntries } from './data';


// ICONS
const PlusIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const TrashIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
);

const SettingsIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const AiIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 21.75l-.648-1.188a2.25 2.25 0 01-1.47-1.47L12.964 18l1.188-.648a2.25 2.25 0 011.47-1.47l1.188-.648.648 1.188a2.25 2.25 0 011.47 1.47l.648 1.188-1.188.648a2.25 2.25 0 01-1.47 1.47z" /></svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CopyIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const TagIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" /></svg>
);

const HeartIconFilled = ({ className = "h-5 w-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-1.383-.597 15.25 15.25 0 01-1.5-1.127l-.114-.132c-.11-.128-.217-.258-.327-.395a1.2 1.2 0 01-.189-.256c-.023-.032-.05-.065-.076-.098C6.708 17.68 6 16.545 6 14.89c0-1.657 1.343-3 3-3s3 1.343 3 3c0 1.657-1.343 3-3 3a2.99 2.99 0 01-2.573-1.456l-.001-.002zM12 21.354l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.354z" />
    </svg>
);


// HOOK for LocalStorage
function useLocalStorage<T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

// TYPES
type AiProvider = 'gemini' | 'openai' | 'deepseek' | 'modelscope' | 'custom';
interface AiConfig {
    provider: AiProvider;
    apiKey: string;
    url: string;
    model: string;
}

// Type for AI organization result preview
type AiOrganizeResult = {
  categoryName: string;
  groups: {
    groupName: string;
    icon: string;
    entries: {
      name: string;
      definition: string;
      context: string;
      tags: string[];
    }[];
  }[];
}[];

const initialAiConfig: AiConfig = {
    provider: 'gemini',
    apiKey: '',
    url: '',
    model: 'gemini-2.5-flash',
};

const initialModelOptions: Record<AiProvider, string[]> = {
    gemini: ['gemini-2.5-flash'],
    openai: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    deepseek: [],
    modelscope: [],
    custom: [],
};


// COMPONENTS
const Modal = ({ isOpen, onClose, children, className }: { isOpen: boolean; onClose: () => void; children: React.ReactNode; className?: string }) => {
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div 
                className={`bg-white rounded-xl shadow-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar p-6 sm:p-8 ${className || 'max-w-2xl'}`}
                onClick={e => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};

interface EntryFormProps {
    onSave: (entry: Entry) => void;
    onCancel: () => void;
    onDelete: (id: string) => void;
    categories: Category[];
    groups: Group[];
    entryToEdit: Entry | null;
}

const EntryForm = ({ onSave, onCancel, onDelete, categories, groups, entryToEdit }: EntryFormProps) => {
    const [formData, setFormData] = useState({
        name: '',
        definition: '',
        context: '',
        groupId: '',
        tags: ''
    });
    const [copied, setCopied] = useState(false);

    const draftKey = useMemo(() => `entry-draft-${entryToEdit?.id || 'new'}`, [entryToEdit]);

    useEffect(() => {
        const initialFormData = {
            name: entryToEdit?.name || '',
            definition: entryToEdit?.definition || '',
            context: entryToEdit?.context || '',
            groupId: entryToEdit?.groupId || '',
            tags: entryToEdit?.tags.join(' ') || ''
        };

        const savedDraft = localStorage.getItem(draftKey);
        if (savedDraft) {
            if (window.confirm('发现未保存的草稿，要恢复吗？')) {
                setFormData(JSON.parse(savedDraft));
            } else {
                setFormData(initialFormData);
                localStorage.removeItem(draftKey);
            }
        } else {
            setFormData(initialFormData);
        }
    }, [entryToEdit, draftKey]);

    useEffect(() => {
        const hasData = Object.values(formData).some(value => value.length > 0);
        if (hasData) {
            localStorage.setItem(draftKey, JSON.stringify(formData));
        }
    }, [formData, draftKey]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCopyName = () => {
        if (formData.name) {
            navigator.clipboard.writeText(formData.name).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });
        }
    };

    const cleanupAndAction = useCallback((action: () => void) => {
        localStorage.removeItem(draftKey);
        action();
    }, [draftKey]);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        const finalEntry: Entry = {
            id: entryToEdit?.id || Date.now().toString(),
            name: formData.name,
            definition: formData.definition,
            context: formData.context,
            groupId: formData.groupId || null,
            tags: formData.tags.split(' ').filter(Boolean),
            createdAt: entryToEdit?.createdAt || Date.now(),
            isFavorite: entryToEdit?.isFavorite || false
        };
        cleanupAndAction(() => onSave(finalEntry));
    }, [formData, entryToEdit, onSave, cleanupAndAction]);
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const isCtrl = isMac ? e.metaKey : e.ctrlKey;
            if (isCtrl && e.key.toLowerCase() === 's') {
                e.preventDefault();
                const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
                handleSubmit(fakeEvent);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleSubmit]);

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">{entryToEdit ? '编辑条目' : '新建条目'}</h1>
                <div className="flex items-center space-x-2">
                    <button onClick={handleSubmit} className="px-4 py-2 bg-violet-500 text-white rounded-md hover:bg-violet-600 transition-colors text-sm font-semibold">保存</button>
                    <button onClick={() => cleanupAndAction(onCancel)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm font-semibold">取消</button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">条目名称</label>
                    <div className="relative">
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#C7E6FF] focus:border-blue-400 pr-10" required />
                        <button type="button" onClick={handleCopyName} title="复制名称" className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-700 transition-colors">
                            {copied ? <span className="text-xs text-green-600">已复制!</span> : <CopyIcon className="h-4 w-4" />}
                        </button>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">定义 / 含义</label>
                    <textarea name="definition" value={formData.definition} onChange={handleChange} rows={2} className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#C7E6FF] focus:border-blue-400" required></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">出处 / 来源 (可选)</label>
                    <textarea name="context" value={formData.context} onChange={handleChange} rows={3} className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#C7E6FF] focus:border-blue-400"></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">所属分组</label>
                    <select name="groupId" value={formData.groupId} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-[#C7E6FF] focus:border-blue-400">
                        <option value="">选择一个分组...</option>
                        {categories.map(category => (
                            <optgroup key={category.id} label={category.name}>
                                {groups
                                    .filter(g => g.categoryId === category.id)
                                    .map(group => <option key={group.id} value={group.id}>{group.name}</option>)
                                }
                            </optgroup>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">标签</label>
                    <input type="text" name="tags" value={formData.tags} onChange={handleChange} placeholder="添加标签，用空格分隔" className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#C7E6FF] focus:border-blue-400" />
                </div>
            </form>
            {entryToEdit && (
                 <div className="mt-8 border-t pt-6">
                    <button onClick={() => cleanupAndAction(() => onDelete(entryToEdit.id))} className="text-rose-600 hover:text-rose-800 text-sm">删除条目</button>
                </div>
            )}
        </div>
    );
};

// Fix: Added 'manual-dnd' to SortOption to fix TypeScript error and support manual sorting.
type SortOption = 'date-desc' | 'date-asc' | 'name-asc' | 'name-desc' | 'manual-dnd';

interface SettingsViewProps {
    aiConfig: AiConfig;
    setAiConfig: React.Dispatch<React.SetStateAction<AiConfig>>;
    modelOptions: Record<AiProvider, string[]>;
    setModelOptions: React.Dispatch<React.SetStateAction<Record<AiProvider, string[]>>>;
    onBack: () => void;
    onExport: () => void;
    onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClearAll: () => void;
}

const PRECONFIGURED_URLS: Partial<Record<AiProvider, string>> = {
    gemini: 'https://generativelanguage.googleapis.com',
    openai: 'https://api.openai.com',
    deepseek: 'https://api.deepseek.com',
    modelscope: 'https://api-inference.modelscope.cn',
};

const SettingsView = ({ aiConfig, setAiConfig, modelOptions, setModelOptions, onBack, onExport, onImport, onClearAll }: SettingsViewProps) => {
    const [localAiConfig, setLocalAiConfig] = useState<AiConfig>(aiConfig);
    const [isTesting, setIsTesting] = useState(false);
    const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        setLocalAiConfig(aiConfig);
    }, [aiConfig]);

    const handleAiConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFeedback(null);

        if (name === 'provider') {
            const newProvider = value as AiProvider;
            const newModel = modelOptions[newProvider]?.[0] || '';
            const newUrl = PRECONFIGURED_URLS[newProvider] || '';
            setLocalAiConfig(prev => ({ ...prev, provider: newProvider, model: newModel, url: newUrl }));
        } else {
            setLocalAiConfig(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleTestConnection = async () => {
        setIsTesting(true);
        setFeedback(null);

        const providerKey = localAiConfig.provider;
        const isGemini = providerKey === 'gemini';
        const apiKey = localAiConfig.apiKey.trim();
        const apiUrl = localAiConfig.url.trim();

        try {
            if (!apiKey) throw new Error('API 密钥不能为空');

            let modelsUrl: string;
            let headers: HeadersInit = {};
            
            if (isGemini) {
                 const baseUrl = apiUrl || 'https://generativelanguage.googleapis.com';
                 modelsUrl = `${baseUrl.replace(/\/+$/, '')}/v1beta/models?key=${encodeURIComponent(apiKey)}`;
            } else { // openai or compatible
                if (!apiUrl) throw new Error('API URL 不能为空');
                const baseUrl = apiUrl.replace(/\/+$/, '');
                modelsUrl = `${baseUrl}/v1/models`;
                headers['Authorization'] = `Bearer ${apiKey}`;
            }

            const modelsResponse = await fetch(modelsUrl, { headers });

            if (!modelsResponse.ok) {
                let errorMessage = `HTTP error! status: ${modelsResponse.status}`;
                try {
                    const errorData = await modelsResponse.json();
                    errorMessage = errorData.error?.message || JSON.stringify(errorData);
                } catch (e) {
                    errorMessage = modelsResponse.statusText;
                }
                throw new Error(errorMessage);
            }

            const modelsData = await modelsResponse.json();
            let availableModels: string[] = [];

            if (providerKey === 'gemini') {
                availableModels = (modelsData.models || [])
                    .filter((m: any) => m.supportedGenerationMethods.includes('generateContent'))
                    .map((m: any) => m.name.replace('models/', ''))
                    .filter((name: string) => !name.includes('embedding') && !name.includes('aqa'))
                    .sort((a:string, b:string) => {
                        if (a.includes('flash') && !b.includes('flash')) return -1;
                        if (!a.includes('flash') && b.includes('flash')) return 1;
                        if (a.includes('pro') && !b.includes('pro')) return -1;
                        if (!a.includes('pro') && b.includes('pro')) return 1;
                        return b.localeCompare(a);
                    });
            } else { // openai or compatible
                availableModels = (modelsData.data || [])
                    .map((m: any) => m.id)
                    .filter((id: string) => {
                        if (providerKey === 'openai') {
                            return id.toLowerCase().includes('gpt') || id.toLowerCase().includes('claude');
                        }
                        return true; // For custom, deepseek, modelscope, show all models
                    })
                    .sort()
                    .reverse();
            }

            if (availableModels.length === 0) {
                throw new Error('可以连接但无法获取模型列表。请检查 API 密钥权限。');
            }

            setModelOptions(prev => ({ ...prev, [providerKey]: availableModels }));
            if (!availableModels.includes(localAiConfig.model)) {
                setLocalAiConfig(prev => ({ ...prev, model: availableModels[0] }));
            }

            setFeedback({ message: '连接成功！模型列表已更新。', type: 'success' });

        } catch (err: any) {
            let userFriendlyMessage = err.message;
            if (userFriendlyMessage.includes('invalid argument')) {
                userFriendlyMessage += ' (这通常意味着 API 密钥无效或格式不正确，请检查并清除首尾空格后重试)';
            }
            setFeedback({ message: `连接失败: ${userFriendlyMessage}`, type: 'error' });
        } finally {
            setIsTesting(false);
        }
    };
    
    const handleSaveAiConfig = () => {
        const trimmedConfig = {
            ...localAiConfig,
            apiKey: localAiConfig.apiKey.trim(),
            url: localAiConfig.url.trim(),
        };
        setAiConfig(trimmedConfig);
        setLocalAiConfig(trimmedConfig);
        setFeedback({ message: 'AI 设置已保存！', type: 'success' });
        setTimeout(() => {
            setFeedback(prev => (prev?.message === 'AI 设置已保存！' ? null : prev));
        }, 3000);
    };

    const showUrlInput = true;
    const isUrlReadOnly = ['gemini', 'openai', 'deepseek', 'modelscope'].includes(localAiConfig.provider);

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">设置</h1>
                <button onClick={onBack} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm font-semibold">返回</button>
            </div>
            <div className="space-y-8">
                {/* Data Management */}
                <div className="p-4 border rounded-lg bg-gray-50/50">
                    <h3 className="font-semibold mb-2 text-gray-800">数据管理</h3>
                    <p className="text-sm text-gray-600 mb-4">您可以将所有数据导出为 JSON 文件进行备份，或从一个或多个备份文件合并导入数据。</p>
                    <div className="flex items-center space-x-2">
                        <button onClick={onExport} className="px-4 py-2 bg-violet-500 text-white rounded-md hover:bg-violet-600 text-sm font-medium">导出所有数据</button>
                        <label htmlFor="import-file" className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm font-medium">
                            合并导入数据
                        </label>
                        <input type="file" id="import-file" accept=".json" className="hidden" onChange={onImport} multiple />
                    </div>
                </div>

                {/* AI Settings */}
                <div className="p-4 border rounded-lg bg-gray-50/50">
                    <h3 className="font-semibold mb-2 text-gray-800">AI 设置</h3>
                    <p className="text-sm text-gray-600 mb-4">配置 AI 模型用于未来的智能功能。</p>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">模型提供商</label>
                            <select name="provider" value={localAiConfig.provider} onChange={handleAiConfigChange} className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-[#C7E6FF] focus:border-blue-400">
                                <option value="gemini">Google Gemini</option>
                                <option value="openai">OpenAI</option>
                                <option value="deepseek">DeepSeek</option>
                                <option value="modelscope">ModelScope 魔搭</option>
                                <option value="custom">自定义 (OpenAI 兼容)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">API 密钥</label>
                            <input type="password" name="apiKey" value={localAiConfig.apiKey} onChange={handleAiConfigChange} placeholder="请输入您的 API 密钥" className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#C7E6FF] focus:border-blue-400"/>
                        </div>
                        {showUrlInput && (
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                                <input 
                                    type="text" 
                                    name="url" 
                                    value={localAiConfig.url} 
                                    onChange={handleAiConfigChange} 
                                    placeholder="例如: https://api.example.com" 
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#C7E6FF] focus:border-blue-400 disabled:bg-gray-100"
                                    disabled={isUrlReadOnly}
                                />
                                {isUrlReadOnly && <p className="text-xs text-gray-500 mt-1">此提供商的 URL 是预设的。</p>}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">模型名称</label>
                            <select name="model" value={localAiConfig.model} onChange={handleAiConfigChange} className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-[#C7E6FF] focus:border-blue-400">
                            {(modelOptions[localAiConfig.provider] || []).map(model => (
                                <option key={model} value={model}>{model}</option>
                            ))}
                            </select>
                        </div>
                        <div className="flex items-center space-x-3 pt-2">
                            <button onClick={handleTestConnection} disabled={isTesting} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium disabled:bg-blue-300">
                                {isTesting ? '测试中...' : '测试连接'}
                            </button>
                            <button onClick={handleSaveAiConfig} className="px-4 py-2 bg-violet-500 text-white rounded-md hover:bg-violet-600 text-sm font-medium">保存设置</button>
                        </div>
                         {feedback && <p className={`text-sm mt-2 font-medium ${feedback.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{feedback.message}</p>}
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="p-4 border border-[#FFD6D0] bg-[#FFD6D0]/20 rounded-lg">
                    <h3 className="font-semibold text-rose-800 mb-2">危险区域</h3>
                    <p className="text-sm text-rose-700 mb-4">此操作不可逆，将永久删除您的所有数据。</p>
                    <button onClick={onClearAll} className="px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 text-sm font-medium">清空所有数据</button>
                </div>
            </div>
        </div>
    );
}

const EntryCard = ({ entry, groupName, IconComponent, onClick, onDelete, onToggleFavorite, onDragStart, onDragOver, onDrop, isDragOver, isSelected, onSelectToggle }: { entry: Entry; groupName: string; IconComponent: React.ElementType; onClick: () => void; onDelete: () => void; onToggleFavorite: () => void; onDragStart: (e: React.DragEvent) => void; onDragOver: (e: React.DragEvent) => void; onDrop: (e: React.DragEvent) => void; isDragOver: boolean; isSelected: boolean; onSelectToggle: (id: string) => void; }) => {
    const [copied, setCopied] = useState(false);
    const [isCopyAnimating, setIsCopyAnimating] = useState(false);
    const [isFavoriteAnimating, setIsFavoriteAnimating] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(entry.name);
        setCopied(true);
        setIsCopyAnimating(true);
        setTimeout(() => setCopied(false), 2000);
        setTimeout(() => setIsCopyAnimating(false), 300);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete();
    };

    const handleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsFavoriteAnimating(true);
        onToggleFavorite();
        setTimeout(() => setIsFavoriteAnimating(false), 300);
    };

    return (
        <div
            onClick={onClick}
            onDragOver={onDragOver}
            onDrop={onDrop}
            className={`animated-border-card group relative h-48 w-16 flex-shrink-0 hover:w-72 rounded-lg transition-all duration-300 ease-in-out hover:shadow-lg cursor-pointer overflow-hidden ${isDragOver ? 'ring-2 ring-blue-400 ring-offset-2' : ''} ${isSelected ? 'ring-2 ring-violet-500' : ''}`}
            role="button"
            aria-label={`查看条目 ${entry.name} 的详情`}
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
        >
             <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => {
                    e.stopPropagation();
                    onSelectToggle(entry.id);
                }}
                onClick={(e) => e.stopPropagation()}
                className="absolute top-2 left-2 z-20 h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500 cursor-pointer opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 ease-in-out delay-200"
                aria-label={`Select entry ${entry.name}`}
            />
            {/* Content wrapper with background and book-like elements */}
            <div className="absolute inset-[2px] bg-gray-50 border border-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                
                {/* Book Spine Decoration */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C7E6FF]/80 transition-all duration-300 group-hover:w-1.5 group-hover:bg-[#C7E6FF]" aria-hidden="true"></div>

                {/* Collapsed view: The Spine */}
                <div className="absolute inset-0 flex flex-col items-center justify-start pt-3 pl-2 pr-1 transition-opacity duration-200 ease-in-out group-hover:opacity-0 group-hover:invisible">
                    <div className="flex items-center space-x-1 text-gray-500 w-full min-w-0 mt-4">
                        <IconComponent className="h-3 w-3 flex-shrink-0" />
                        <span className="text-xs font-medium truncate">{groupName}</span>
                    </div>
                    <div className="flex-1 flex items-center justify-center w-full mt-2">
                        <h3 className="[writing-mode:vertical-rl] [text-orientation:upright] whitespace-nowrap text-center text-gray-700 font-semibold tracking-wider text-sm">
                            {entry.name}
                        </h3>
                    </div>
                </div>

                {/* Expanded view: The Book Cover */}
                <div className="w-full h-full p-4 pl-6 flex flex-col justify-between opacity-0 invisible transition-opacity duration-300 ease-in-out delay-200 group-hover:opacity-100 group-hover:visible relative">
                    <div className="absolute top-3 right-3 flex items-center space-x-1">
                        <div
                            draggable
                            onDragStart={onDragStart}
                            className="cursor-move p-1 text-gray-400 hover:text-gray-700"
                            title="拖拽排序"
                        >
                            <GripVerticalIcon className="h-4 w-4" />
                        </div>
                        <button onClick={handleFavorite} title="收藏" className={`p-1 transition-colors ${entry.isFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'}`}>
                            {entry.isFavorite ? <HeartIconFilled className={`h-4 w-4 ${isFavoriteAnimating ? 'animate-pop' : ''}`} /> : <HeartIconOutline className={`h-4 w-4 ${isFavoriteAnimating ? 'animate-pop' : ''}`} />}
                        </button>
                        <button onClick={handleCopy} title="复制名称" className="p-1 text-gray-400 hover:text-gray-700 transition-colors">
                            {copied ? <span className="text-xs text-green-600">已复制!</span> : <CopyIcon className={`h-4 w-4 ${isCopyAnimating ? 'animate-pop' : ''}`} />}
                        </button>
                        <button onClick={handleDelete} title="删除条目" className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                            <TrashIcon className="h-4 w-4" />
                        </button>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-800 mb-1 truncate pr-20">{entry.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">
                            <span className="font-semibold text-gray-700">所属分组: </span>{groupName}
                        </p>
                        <div className="flex text-xs text-gray-600">
                            <span className="font-semibold text-gray-700 mr-1 flex-shrink-0">定义 / 含义: </span>
                            <p className="line-clamp-3">{entry.definition}</p>
                        </div>
                        {entry.context && (
                            <div className="flex mt-2 text-xs text-gray-500 italic">
                                <span className="font-semibold not-italic text-gray-600 mr-1 flex-shrink-0">出处: </span>
                                <p className="line-clamp-2">{entry.context}</p>
                            </div>
                        )}
                    </div>
                    <div className="text-right text-xs text-gray-400 mt-2">
                        {new Date(entry.createdAt).toLocaleDateString()}
                    </div>
                </div>
            </div>
        </div>
    );
};

const AiPreview = ({ data, setData, iconNames }: { data: AiOrganizeResult, setData: React.Dispatch<React.SetStateAction<AiOrganizeResult | null>>, iconNames: string[] }) => {
    
    const handleCategoryNameChange = (catIndex: number, newName: string) => {
        const newData = [...data];
        newData[catIndex] = { ...newData[catIndex], categoryName: newName };
        setData(newData);
    };

    const handleGroupChange = (catIndex: number, groupIndex: number, field: string, value: string) => {
        const newData = [...data];
        const newGroups = [...newData[catIndex].groups];
        newGroups[groupIndex] = { ...newGroups[groupIndex], [field]: value };
        newData[catIndex] = { ...newData[catIndex], groups: newGroups };
        setData(newData);
    };

    const handleEntryChange = (catIndex: number, groupIndex: number, entryIndex: number, field: string, value: string | string[]) => {
        const newData = [...data];
        const newGroups = [...newData[catIndex].groups];
        const newEntries = [...newGroups[groupIndex].entries];
        newEntries[entryIndex] = { ...newEntries[entryIndex], [field]: value };
        newGroups[groupIndex] = { ...newGroups[groupIndex], entries: newEntries };
        newData[catIndex] = { ...newData[catIndex], groups: newGroups };
        setData(newData);
    };

    const removeEntry = (catIndex: number, groupIndex: number, entryIndex: number) => {
        const newData = JSON.parse(JSON.stringify(data)); // deep copy
        newData[catIndex].groups[groupIndex].entries.splice(entryIndex, 1);
        
        // if group becomes empty, remove group
        if(newData[catIndex].groups[groupIndex].entries.length === 0){
            newData[catIndex].groups.splice(groupIndex, 1);
        }
        
        // if category becomes empty, remove category
        if(newData[catIndex].groups.length === 0){
            newData.splice(catIndex, 1);
        }

        setData(newData);
    };

    return (
        <div className="space-y-6">
            {data.map((category, catIndex) => (
                <div key={catIndex} className="p-4 border rounded-lg bg-gray-50/50">
                    <label className="block text-sm font-medium text-gray-700 mb-1">分类名称</label>
                    <input type="text" value={category.categoryName} onChange={(e) => handleCategoryNameChange(catIndex, e.target.value)} className="w-full p-2 border border-gray-300 rounded-md font-semibold text-lg bg-white" />
                    
                    <div className="mt-4 space-y-4 pl-4 border-l-2">
                        {category.groups.map((group, groupIndex) => (
                            <div key={groupIndex} className="p-3 border rounded-md bg-white">
                                <div className="grid grid-cols-2 gap-4 mb-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">分组名称</label>
                                        <input type="text" value={group.groupName} onChange={(e) => handleGroupChange(catIndex, groupIndex, 'groupName', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded-md"/>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">图标</label>
                                        <select value={group.icon} onChange={(e) => handleGroupChange(catIndex, groupIndex, 'icon', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded-md bg-white">
                                            {iconNames.map(name => <option key={name} value={name}>{name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <h4 className="font-semibold mb-2 text-gray-600 text-sm">条目:</h4>
                                <div className="space-y-3">
                                    {group.entries.map((entry, entryIndex) => (
                                        <div key={entryIndex} className="p-3 border rounded relative bg-gray-50">
                                            <button onClick={() => removeEntry(catIndex, groupIndex, entryIndex)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><TrashIcon className="w-4 h-4" /></button>
                                            <div className="space-y-2">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">条目名称</label>
                                                    <input type="text" value={entry.name} onChange={(e) => handleEntryChange(catIndex, groupIndex, entryIndex, 'name', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded-md"/>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">定义</label>
                                                    <textarea value={entry.definition} onChange={(e) => handleEntryChange(catIndex, groupIndex, entryIndex, 'definition', e.target.value)} rows={2} className="w-full p-2 text-sm border border-gray-300 rounded-md"/>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">出处 (可选)</label>
                                                    <input type="text" value={entry.context} onChange={(e) => handleEntryChange(catIndex, groupIndex, entryIndex, 'context', e.target.value)} className="w-full p-2 text-sm border border-gray-300 rounded-md"/>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">标签 (空格分隔)</label>
                                                    <input type="text" value={entry.tags.join(' ')} onChange={(e) => handleEntryChange(catIndex, groupIndex, entryIndex, 'tags', e.target.value.split(' ').filter(Boolean))} className="w-full p-2 text-sm border border-gray-300 rounded-md"/>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};


// HOOK for window width
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width;
}

// APP
export default function App() {
    const [categories, setCategories] = useLocalStorage<Category[]>('categories', initialCategories);
    const [groups, setGroups] = useLocalStorage<Group[]>('groups', initialGroups);
    const [entries, setEntries] = useLocalStorage<Entry[]>('entries', initialEntries);
    const [aiConfig, setAiConfig] = useLocalStorage<AiConfig>('aiConfig', initialAiConfig);
    const [modelOptions, setModelOptions] = useLocalStorage<Record<AiProvider, string[]>>('modelOptions', initialModelOptions);
    
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
    const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupIcon, setNewGroupIcon] = useState<string>(defaultIconName);
    const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState<SortOption>('date-desc');
    const [filterTag, setFilterTag] = useState('');
    const [filterGroupId, setFilterGroupId] = useState('all');
    
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
    const [editingCategoryName, setEditingCategoryName] = useState('');
    const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
    const [editingGroupName, setEditingGroupName] = useState('');

    const iconPickerRef = useRef<HTMLDivElement>(null);
    const importCategoryInputRef = useRef<HTMLInputElement>(null);
    
    const [aiInputText, setAiInputText] = useState('');
    const [isAiProcessing, setIsAiProcessing] = useState(false);
    const [isAiPreviewModalOpen, setIsAiPreviewModalOpen] = useState(false);
    const [editableAiPreviewData, setEditableAiPreviewData] = useState<AiOrganizeResult | null>(null);
    
    // Drag and Drop State
    const [draggedItem, setDraggedItem] = useState<{ type: 'entry' | 'group', id: string } | null>(null);
    const [dragOverTarget, setDragOverTarget] = useState<{ type: string, id: string } | null>(null);

    // Batch Operations State
    const [selectedEntryIds, setSelectedEntryIds] = useState<string[]>([]);
    const [isBatchMoveOpen, setIsBatchMoveOpen] = useState(false);
    const [isBatchTagOpen, setIsBatchTagOpen] = useState(false);
    const [batchMoveGroupId, setBatchMoveGroupId] = useState<string | null>(null);
    const [tagsToAdd, setTagsToAdd] = useState('');
    const [tagsToRemove, setTagsToRemove] = useState('');

    // Context Menu State
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, categoryId: string } | null>(null);
    const contextMenuRef = useRef<HTMLDivElement>(null);
    
    // Undo/Redo State
    const historyRef = useRef<{ undo: Entry[][], redo: Entry[][] }>({ undo: [], redo: [] });
    const MAX_HISTORY_SIZE = 50;


    const windowWidth = useWindowWidth();

    const { CARDS_PER_ROW, RIGHT_TO_LEFT_COUNT } = useMemo(() => {
        const width = windowWidth;
        let cards = 12;
        if (width < 1024) cards = 8;      // lg breakpoint
        else if (width < 1536) cards = 10; // 2xl breakpoint

        const reversed = Math.max(2, Math.floor(cards / 3)); 
        
        return { CARDS_PER_ROW: cards, RIGHT_TO_LEFT_COUNT: reversed };
    }, [windowWidth]);

    const chunk = (arr: Entry[], size: number): Entry[][] =>
        Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
            arr.slice(i * size, i * size + size)
        );

    // History management for entries
    const updateEntries = useCallback((updater: (current: Entry[]) => Entry[], description: string) => {
        setEntries(current => {
            const newUndoStack = [...historyRef.current.undo, current];
            if (newUndoStack.length > MAX_HISTORY_SIZE) {
                newUndoStack.shift();
            }
            historyRef.current.undo = newUndoStack;
            historyRef.current.redo = [];
            return updater(current);
        });
    }, [setEntries]);

    const handleUndo = useCallback(() => {
        if (historyRef.current.undo.length === 0) return;
        const newUndoStack = [...historyRef.current.undo];
        const lastState = newUndoStack.pop();
        if (!lastState) return;

        historyRef.current.undo = newUndoStack;
        setEntries(current => {
            historyRef.current.redo = [...historyRef.current.redo, current];
            return lastState;
        });
    }, [setEntries]);

    const handleRedo = useCallback(() => {
        if (historyRef.current.redo.length === 0) return;
        const newRedoStack = [...historyRef.current.redo];
        const nextState = newRedoStack.pop();
        if (!nextState) return;

        historyRef.current.redo = newRedoStack;
        setEntries(current => {
            historyRef.current.undo = [...historyRef.current.undo, current];
            return nextState;
        });
    }, [setEntries]);
    
    const handleNewEntry = useCallback(() => {
        setEditingEntry(null);
        setIsFormOpen(true);
    }, []);

    // Global keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            const isEditingText = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable;
            
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const isCtrl = isMac ? e.metaKey : e.ctrlKey;

            if (isCtrl && e.key.toLowerCase() === 'z') {
                e.preventDefault();
                if (isEditingText) return; // Allow browser undo in text fields
                if (e.shiftKey) {
                    handleRedo();
                } else {
                    handleUndo();
                }
            } else if (isCtrl && e.key.toLowerCase() === 'y') {
                e.preventDefault();
                if (isEditingText) return;
                handleRedo();
            } else if (isCtrl && !isEditingText && e.key.toLowerCase() === 'n') {
                e.preventDefault();
                handleNewEntry();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleUndo, handleRedo, handleNewEntry]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (iconPickerRef.current && !iconPickerRef.current.contains(event.target as Node)) {
                setIsIconPickerOpen(false);
            }
            if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
                setContextMenu(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [iconPickerRef, contextMenuRef]);

    // Drag and Drop Handlers
    const handleDragStart = (e: React.DragEvent, type: 'entry' | 'group', id: string) => {
        const dragData = { type, id };
        setDraggedItem(dragData);
        e.dataTransfer.setData('application/json', JSON.stringify(dragData));
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, type: string, id: string) => {
        e.preventDefault();
        if (draggedItem) {
             if (draggedItem.type === 'entry' && (type === 'entry' || type === 'group') && draggedItem.id !== id) {
                setDragOverTarget({ type, id });
            } else if (draggedItem.type === 'group' && type === 'category' && id) {
                setDragOverTarget({ type, id });
            }
        }
    };
    
    const handleDragLeave = () => {
        setDragOverTarget(null);
    };

    const handleDrop = (e: React.DragEvent, dropTargetType: string, dropTargetId: string) => {
        e.preventDefault();
        setDragOverTarget(null);
        const draggedData = JSON.parse(e.dataTransfer.getData('application/json'));
        if (!draggedData) return;

        if (draggedData.type === 'entry') {
            const draggedEntryId = draggedData.id;
            if (dropTargetType === 'entry' && draggedEntryId !== dropTargetId) {
                updateEntries(currentEntries => {
                    const draggedIndex = currentEntries.findIndex(item => item.id === draggedEntryId);
                    const targetIndex = currentEntries.findIndex(item => item.id === dropTargetId);
                    if (draggedIndex === -1 || targetIndex === -1) return currentEntries;

                    const newEntries = [...currentEntries];
                    const [draggedEntry] = newEntries.splice(draggedIndex, 1);
                    const newTargetIndex = newEntries.findIndex(item => item.id === dropTargetId);
                    newEntries.splice(newTargetIndex, 0, draggedEntry);
                    return newEntries;
                }, 'Reorder Entry');
            }
            else if (dropTargetType === 'group') {
                updateEntries(currentEntries => currentEntries.map(entry => 
                    entry.id === draggedEntryId ? { ...entry, groupId: dropTargetId } : entry
                ), 'Move Entry');
            }
        }
        else if (draggedData.type === 'group') {
            const draggedGroupId = draggedData.id;
            if (dropTargetType === 'category') {
                setGroups(currentGroups => currentGroups.map(group => 
                    group.id === draggedGroupId ? { ...group, categoryId: dropTargetId } : group
                ));
            }
        }
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
        setDragOverTarget(null);
    };

    // Handlers
    const handleEditEntry = (entry: Entry) => {
        setEditingEntry(entry);
        setIsFormOpen(true);
    };

    const handleSaveEntry = useCallback((entry: Entry) => {
        updateEntries(prev => {
            const exists = prev.some(e => e.id === entry.id);
            if (exists) {
                return prev.map(e => (e.id === entry.id ? entry : e));
            } else {
                return [...prev, entry];
            }
        }, 'Save Entry');
        setIsFormOpen(false);
    }, [updateEntries]);

    const handleCancelForm = useCallback(() => setIsFormOpen(false), []);

    const handleDeleteEntry = useCallback((id: string) => {
        if(window.confirm('确定要删除此条目吗？')) {
            updateEntries(prev => prev.filter(e => e.id !== id), 'Delete Entry');
            setIsFormOpen(false);
        }
    }, [updateEntries]);
    
    const handleToggleFavorite = useCallback((entryId: string) => {
        updateEntries(prevEntries =>
            prevEntries.map(entry =>
                entry.id === entryId ? { ...entry, isFavorite: !entry.isFavorite } : entry
            ), 'Toggle Favorite'
        );
    }, [updateEntries]);

    const handleUnfavoriteAll = () => {
        if (window.confirm('确定要取消收藏所有条目吗？')) {
            updateEntries(prev => prev.map(e => ({ ...e, isFavorite: false })), 'Unfavorite All');
        }
    };

    const handleAddCategory = () => {
        if (newCategoryName.trim()) {
            const newCategory = { id: Date.now().toString(), name: newCategoryName.trim() };
            setCategories(prev => [...prev, newCategory]);
            setNewCategoryName('');
        }
    };

    const handleDeleteCategory = (id: string) => {
        if (window.confirm('确定要删除此分类吗？分类下的所有分组和条目也将被删除。')) {
            const groupIdsToDelete = groups.filter(g => g.categoryId === id).map(g => g.id);
            
            updateEntries(prev => prev.filter(e => !groupIdsToDelete.includes(e.groupId || '')), 'Delete Entries in Category');
            setGroups(prev => prev.filter(g => g.categoryId !== id));
            setCategories(prev => prev.filter(c => c.id !== id));
            
            setSelectedEntryIds(prev => prev.filter(entryId => !entries.find(e => e.id === entryId && groupIdsToDelete.includes(e.groupId || ''))));

            if (selectedCategoryId === id) {
                setSelectedCategoryId('all');
            }
        }
    };

    const handleAddGroup = () => {
        if (newGroupName.trim() && selectedCategoryId !== 'all' && selectedCategoryId !== 'favorites') {
            const newGroup: Group = { 
                id: Date.now().toString(), 
                name: newGroupName.trim(), 
                categoryId: selectedCategoryId,
                icon: newGroupIcon
            };
            setGroups(prev => [...prev, newGroup]);
            setNewGroupName('');
            setNewGroupIcon(defaultIconName);
        }
    };

    const handleDeleteGroup = (id: string) => {
        if(window.confirm('确定要删除此分组吗？分组下的条目将不会被删除，并变为“未分类”。')) {
            updateEntries(prev => prev.map(e => e.groupId === id ? { ...e, groupId: null } : e), 'Unassign Entries from Group');
            setGroups(prev => prev.filter(g => g.id !== id));
        }
    };

    const handleStartEditCategory = (category: Category) => {
        setEditingCategoryId(category.id);
        setEditingCategoryName(category.name);
    };

    const handleSaveCategoryName = (id: string) => {
        if (editingCategoryName.trim()) {
            setCategories(prev => prev.map(cat => 
                cat.id === id ? { ...cat, name: editingCategoryName.trim() } : cat
            ));
        }
        setEditingCategoryId(null);
    };

    const handleCategoryNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
        if (e.key === 'Enter') {
            handleSaveCategoryName(id);
        } else if (e.key === 'Escape') {
            setEditingCategoryId(null);
        }
    };

    const handleStartEditGroup = (group: Group) => {
        setEditingGroupId(group.id);
        setEditingGroupName(group.name);
    };

    const handleSaveGroupName = (id: string) => {
        if (editingGroupName.trim()) {
            setGroups(prev => prev.map(g => 
                g.id === id ? { ...g, name: editingGroupName.trim() } : g
            ));
        }
        setEditingGroupId(null);
    };

    const handleGroupNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
        if (e.key === 'Enter') {
            handleSaveGroupName(id);
        } else if (e.key === 'Escape') {
            setEditingGroupId(null);
        }
    };

    const handleAiOrganize = async () => {
        if (!aiConfig.apiKey) {
            alert('请先在设置中配置您的 AI 模型 API 密钥。');
            setIsSettingsOpen(true);
            return;
        }
        if (!aiInputText.trim()) {
            alert('请输入需要整理的内容。');
            return;
        }

        setIsAiProcessing(true);

        try {
            let jsonString: string;

            if (aiConfig.provider === 'gemini') {
                const ai = new GoogleGenAI({ apiKey: aiConfig.apiKey });
                const schema = {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            categoryName: { type: Type.STRING, description: "根据内容总结的分类名称" },
                            groups: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        groupName: { type: Type.STRING, description: "根据内容总结的分组名称" },
                                        icon: { type: Type.STRING, description: "从提供的列表中为该组选择一个最合适的图标名称" },
                                        entries: {
                                            type: Type.ARRAY,
                                            items: {
                                                type: Type.OBJECT,
                                                properties: {
                                                    name: { type: Type.STRING, description: "条目的核心名称" },
                                                    definition: { type: Type.STRING, description: "条目的定义或含义" },
                                                    context: { type: Type.STRING, description: "条目的出处或来源，如果原文未提供则留空" },
                                                    tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "至少三个与条目相关的标签" },
                                                },
                                                required: ['name', 'definition', 'tags'],
                                            },
                                        },
                                    },
                                    required: ['groupName', 'icon', 'entries'],
                                },
                            },
                        },
                        required: ['categoryName', 'groups'],
                    },
                };
                const prompt = `你是一个专业的知识整理助手。请分析以下文本，并将其中的信息结构化地整理成“分类 (Category)”、“分组 (Group)”和“条目 (Entry)”。严格按照提供的JSON Schema格式输出结果，不要添加任何额外的解释或说明。\n\n文本内容:\n---\n${aiInputText}\n---\n\n可用图标列表 (请为每个分组选择一个最合适的图标名称):\n${iconNames.join(', ')}\n\n请根据文本内容创建新的、有意义的分类和分组。每个条目应包含名称、定义、出处（可选）和至少三个相关的标签。输出必须是格式正确的 JSON 数组。`;
                
                const response = await ai.models.generateContent({
                    model: aiConfig.model || 'gemini-2.5-flash',
                    contents: prompt,
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: schema,
                    },
                });
                jsonString = response.text.trim();
            } else { // OpenAI compatible providers
                if (!aiConfig.url) {
                    throw new Error('AI Provider URL 未配置。请检查设置。');
                }
                const baseUrl = aiConfig.url.replace(/\/+$/, '');
                const apiUrl = `${baseUrl}/v1/chat/completions`;
                const prompt = `你是一个专业的知识整理助手。请分析以下文本，将其中的信息结构化地整理成“分类 (Category)”、“分组 (Group)”和“条目 (Entry)”。\n\n你的输出必须是一个单一的、格式完全正确的JSON对象。该对象应包含一个名为 "data" 的键，其值为一个分类数组。\n不要在JSON对象前后添加任何额外的解释、注释或markdown代码块 (如 \`\`\`json)。\n\n每个分类对象的结构如下:\n{\n  "categoryName": "string",\n  "groups": [\n    {\n      "groupName": "string",\n      "icon": "从下方提供的图标列表中选择最合适的图标名称",\n      "entries": [\n        {\n          "name": "string",\n          "definition": "string",\n          "context": "string (可选)",\n          "tags": ["string", "string", ...]\n        }\n      ]\n    }\n  ]\n}\n\n文本内容:\n---\n${aiInputText}\n---\n\n可用的图标列表:\n${iconNames.join(', ')}`;
                
                const body: any = {
                    model: aiConfig.model,
                    messages: [{ role: "user", content: prompt }],
                };

                // Add response_format for official OpenAI models for better reliability
                if (aiConfig.provider === 'openai') {
                    body.response_format = { type: "json_object" };
                }

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${aiConfig.apiKey}`
                    },
                    body: JSON.stringify(body)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`API 错误: ${errorData.error?.message || response.statusText}`);
                }
                const responseData = await response.json();
                jsonString = responseData.choices[0].message.content;
            }

            const parsedJson = JSON.parse(jsonString);
            let structuredData;

            if (aiConfig.provider === 'gemini') {
                structuredData = parsedJson;
            } else {
                if (parsedJson.data && Array.isArray(parsedJson.data)) {
                    structuredData = parsedJson.data;
                } else {
                    // Fallback for models that ignore the "data" key instruction
                    structuredData = Array.isArray(parsedJson) ? parsedJson : null;
                }
            }
            
            if (!Array.isArray(structuredData)) {
                throw new Error('AI 返回的数据格式不正确，不是一个数组。');
            }
            
            setEditableAiPreviewData(structuredData);
            setIsAiModalOpen(false);
            setIsAiPreviewModalOpen(true);
            setAiInputText('');


        } catch (err: any) {
            console.error("AI processing error:", err);
            alert(`AI 整理失败: ${err.message}`);
        } finally {
            setIsAiProcessing(false);
        }
    };
    
    const handleAcceptAiPreview = (finalData: AiOrganizeResult) => {
        if (!finalData) return;
        
        let firstNewCategoryId = '';
        let tempCategories = [...categories];
        let tempGroups = [...groups];
        let tempEntries: Entry[] = [];

        for (const categoryData of finalData) {
            if (!categoryData.categoryName || !Array.isArray(categoryData.groups) || categoryData.groups.length === 0) continue;

            let categoryId: string;
            const existingCategory = tempCategories.find(c => c.name === categoryData.categoryName);

            if (existingCategory) {
                categoryId = existingCategory.id;
            } else {
                categoryId = `cat-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
                tempCategories.push({ id: categoryId, name: categoryData.categoryName });
                if (!firstNewCategoryId) {
                    firstNewCategoryId = categoryId;
                }
            }

            for (const groupData of categoryData.groups) {
                if (!groupData.groupName || !Array.isArray(groupData.entries) || groupData.entries.length === 0) continue;
                
                let groupId: string;
                const existingGroup = tempGroups.find(g => g.categoryId === categoryId && g.name === groupData.groupName);

                if (existingGroup) {
                    groupId = existingGroup.id;
                } else {
                    groupId = `grp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
                    const validIcon = iconNames.includes(groupData.icon) ? groupData.icon : defaultIconName;
                    tempGroups.push({ id: groupId, name: groupData.groupName, categoryId: categoryId, icon: validIcon });
                }

                for (const entryData of groupData.entries) {
                    if (!entryData.name || !entryData.definition) continue;

                    const newEntry: Entry = {
                        id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                        name: entryData.name,
                        definition: entryData.definition,
                        context: entryData.context || '',
                        groupId: groupId,
                        tags: Array.isArray(entryData.tags) ? entryData.tags.filter(t => typeof t === 'string') : [],
                        createdAt: Date.now()
                    };
                    tempEntries.push(newEntry);
                }
            }
        }
        
        setCategories(tempCategories);
        setGroups(tempGroups);
        updateEntries(prev => [...prev, ...tempEntries], 'AI Organize');

        alert('AI 整理完成！');
        
        if(firstNewCategoryId) {
            setSelectedCategoryId(firstNewCategoryId);
        }
        
        setIsAiPreviewModalOpen(false);
        setEditableAiPreviewData(null);
    };

    const handleCancelAiPreview = () => {
        if (window.confirm('确定要放弃这些 AI 生成的内容吗？')) {
            setIsAiPreviewModalOpen(false);
            setEditableAiPreviewData(null);
        }
    };


    const handleExportData = () => {
        const data = {
            categories,
            groups,
            entries,
        };
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
        const link = document.createElement('a');
        link.href = jsonString;
        link.download = `inspiration_vault_backup_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    };

    const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        if (window.confirm(`即将合并导入 ${files.length} 个文件。这将添加新的分类、分组和条目，但不会删除或修改现有数据。确定要继续吗？`)) {
            let currentCategories = [...categories];
            let currentGroups = [...groups];
            let currentEntries = [...entries];
            
            let allEntriesToAdd: Entry[] = [];

            const fileReadPromises = Array.from(files).map(file => {
                return new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target?.result as string);
                    reader.onerror = (e) => reject(e);
                    reader.readAsText(file);
                });
            });

            try {
                const fileContents = await Promise.all(fileReadPromises);

                for (const text of fileContents) {
                    const data = JSON.parse(text);

                    // Basic validation
                    if (!Array.isArray(data.categories) || !Array.isArray(data.groups) || !Array.isArray(data.entries)) {
                        console.warn("Skipping invalid file format.");
                        continue;
                    }

                    const categoryIdMap = new Map<string, string>();
                    data.categories.forEach((importedCategory: Category) => {
                        const existingCategory = currentCategories.find(c => c.name === importedCategory.name);
                        if (existingCategory) {
                            categoryIdMap.set(importedCategory.id, existingCategory.id);
                        } else {
                            const newId = `cat-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
                            const newCategory = { ...importedCategory, id: newId };
                            currentCategories.push(newCategory);
                            categoryIdMap.set(importedCategory.id, newId);
                        }
                    });
                    
                    const groupIdMap = new Map<string, string>();
                     data.groups.forEach((importedGroup: Group) => {
                        const targetCategoryId = categoryIdMap.get(importedGroup.categoryId);
                        if (!targetCategoryId) return;

                        const existingGroup = currentGroups.find(g => g.name === importedGroup.name && g.categoryId === targetCategoryId);
                        if (existingGroup) {
                            groupIdMap.set(importedGroup.id, existingGroup.id);
                        } else {
                            const newId = `grp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
                            const newGroup = { ...importedGroup, id: newId, categoryId: targetCategoryId };
                            currentGroups.push(newGroup);
                            groupIdMap.set(importedGroup.id, newId);
                        }
                    });
                    
                    data.entries.forEach((importedEntry: Entry) => {
                        if (!importedEntry.groupId) return;
                        const targetGroupId = groupIdMap.get(importedEntry.groupId);
                        if (!targetGroupId) return;

                        const isDuplicate = currentEntries.some(e => e.name === importedEntry.name && e.groupId === targetGroupId) || allEntriesToAdd.some(e => e.name === importedEntry.name && e.groupId === targetGroupId);
                        
                        if (!isDuplicate) {
                            const newId = `entry-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
                            const newEntry = { ...importedEntry, id: newId, groupId: targetGroupId };
                            allEntriesToAdd.push(newEntry);
                        }
                    });
                }
                
                setCategories(currentCategories);
                setGroups(currentGroups);
                if (allEntriesToAdd.length > 0) {
                     updateEntries(prev => [...prev, ...allEntriesToAdd], 'Merge Import Data');
                }

                alert(`成功合并导入 ${files.length} 个文件！`);
                setIsSettingsOpen(false);
            } catch (error) {
                alert('导入失败，文件可能已损坏或格式不正确。');
                console.error("Import error:", error);
            }
        }
        event.target.value = '';
    };

    const handleClearAllData = () => {
        if (window.confirm('警告：此操作将永久删除所有分类、分组和条目。确定要继续吗？')) {
            if (window.confirm('这是最后一次确认。真的要清空所有数据吗？')) {
                setCategories([]);
                setGroups([]);
                setEntries([]);
                setAiConfig(initialAiConfig);
                setModelOptions(initialModelOptions);
                historyRef.current = { undo: [], redo: [] };
                alert('所有数据已清空。');
            }
        }
    };
    
    // Batch Operations Handlers
    const handleSelectToggle = (entryId: string) => {
        setSelectedEntryIds(prev =>
            prev.includes(entryId)
                ? prev.filter(id => id !== entryId)
                : [...prev, entryId]
        );
    };

    const handleDeselectAll = () => {
        setSelectedEntryIds([]);
    };

    const handleBatchDelete = () => {
        if (window.confirm(`确定要删除选中的 ${selectedEntryIds.length} 个条目吗？此操作不可撤销。`)) {
            updateEntries(prev => prev.filter(e => !selectedEntryIds.includes(e.id)), 'Batch Delete Entries');
            setSelectedEntryIds([]);
        }
    };

    const handleBatchMove = () => {
        if (batchMoveGroupId === null) return;
        updateEntries(prev => prev.map(entry => 
            selectedEntryIds.includes(entry.id)
                ? { ...entry, groupId: batchMoveGroupId }
                : entry
        ), 'Batch Move Entries');
        setIsBatchMoveOpen(false);
        setBatchMoveGroupId(null);
        setSelectedEntryIds([]);
    };

    const handleBatchTag = () => {
        const toAdd = tagsToAdd.split(' ').filter(Boolean);
        const toRemove = tagsToRemove.split(' ').filter(Boolean);

        updateEntries(prev => prev.map(entry => {
            if (selectedEntryIds.includes(entry.id)) {
                let newTags = new Set(entry.tags);
                toRemove.forEach(tag => newTags.delete(tag));
                toAdd.forEach(tag => newTags.add(tag));
                return { ...entry, tags: Array.from(newTags) };
            }
            return entry;
        }), 'Batch Tag Entries');

        setIsBatchTagOpen(false);
        setTagsToAdd('');
        setTagsToRemove('');
        setSelectedEntryIds([]);
    };

    // Context Menu Handlers
    const handleContextMenu = (e: React.MouseEvent, categoryId: string) => {
        e.preventDefault();
        setContextMenu({ x: e.pageX, y: e.pageY, categoryId });
    };

    const handleExportCategory = (categoryId: string) => {
        const category = categories.find(c => c.id === categoryId);
        if (!category) return;

        const groupsInCategory = groups.filter(g => g.categoryId === categoryId);
        const groupIds = groupsInCategory.map(g => g.id);
        const entriesInCategory = entries.filter(e => e.groupId && groupIds.includes(e.groupId));

        const data: CategoryExportData = {
            category,
            groups: groupsInCategory,
            entries: entriesInCategory,
        };

        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
        const link = document.createElement('a');
        link.href = jsonString;
        link.download = `${category.name}_export_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        setContextMenu(null);
    };

    const handleImportCategoryClick = () => {
        importCategoryInputRef.current?.click();
        setContextMenu(null);
    };

    const handleImportCategory = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        let categoriesToAdd: Category[] = [];
        let groupsToAdd: Group[] = [];
        let entriesToAdd: Entry[] = [];
        
        let tempCategories = [...categories];

        const fileReadPromises = Array.from(files).map(file => {
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target?.result as string);
                reader.onerror = (e) => reject(e);
                reader.readAsText(file);
            });
        });

        try {
            const fileContents = await Promise.all(fileReadPromises);
            
            for (const text of fileContents) {
                const data: CategoryExportData = JSON.parse(text);

                if (!data.category || !Array.isArray(data.groups) || !Array.isArray(data.entries)) {
                    console.warn("Skipping invalid category file format.");
                    continue;
                }

                let newCategory = { ...data.category };
                let newGroups = JSON.parse(JSON.stringify(data.groups));
                let newEntriesData = JSON.parse(JSON.stringify(data.entries));
                
                let newName = newCategory.name;
                while (tempCategories.some(c => c.name === newName)) {
                    newName = `${newName} (副本)`;
                }
                newCategory.name = newName;
                
                const newCategoryId = `cat-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
                newCategory.id = newCategoryId;

                const groupMap = new Map<string, string>();
                newGroups.forEach((g: Group) => {
                    const oldId = g.id;
                    const newId = `grp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
                    groupMap.set(oldId, newId);
                    g.id = newId;
                    g.categoryId = newCategoryId;
                });

                newEntriesData.forEach((e: Entry) => {
                    e.id = `entry-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
                    if (e.groupId) {
                        e.groupId = groupMap.get(e.groupId) || null;
                    }
                });

                categoriesToAdd.push(newCategory);
                groupsToAdd.push(...newGroups);
                entriesToAdd.push(...newEntriesData);
                
                tempCategories.push(newCategory);
            }
            
            if (categoriesToAdd.length > 0) {
                setCategories(prev => [...prev, ...categoriesToAdd]);
                setGroups(prev => [...prev, ...groupsToAdd]);
                updateEntries(prev => [...prev, ...entriesToAdd], `Import ${categoriesToAdd.length} Categories`);
                alert(`成功导入 ${categoriesToAdd.length} 个分类！`);
            }

        } catch (error: any) {
            alert(`导入失败: ${error.message}`);
            console.error("Category import error:", error);
        }

        event.target.value = '';
    };

    const groupMap = useMemo(() => new Map(groups.map(g => [g.id, g])), [groups]);

    const getGroupName = useCallback((groupId: string | null) => {
        if (!groupId) return '未分类';
        return groupMap.get(groupId)?.name || '未分类';
    }, [groupMap]);

    const getIconComponentByName = useCallback((iconName: string | undefined): React.ElementType => {
        if (iconName && iconComponents[iconName]) {
            return iconComponents[iconName];
        }
        return DefaultIcon;
    }, []);
    
    const filteredEntries = useMemo(() => {
        let baseEntries = [...entries];
        
        if (selectedCategoryId === 'favorites') {
            baseEntries = baseEntries.filter(entry => entry.isFavorite);
        }

        return baseEntries
            .filter(entry => {
                const nameMatch = !searchTerm || entry.name.toLowerCase().includes(searchTerm.toLowerCase());
                const tagMatch = !filterTag || entry.tags.some(tag => tag.toLowerCase().includes(filterTag.trim().toLowerCase()));
                const groupMatch = filterGroupId === 'all' || entry.groupId === filterGroupId;
                return nameMatch && tagMatch && groupMatch;
            });
    }, [entries, searchTerm, filterTag, filterGroupId, selectedCategoryId]);

    // Fix: Refactored sortEntries to handle 'manual-dnd' and added `entries` to dependency array.
    const sortEntries = useCallback((entriesToSort: Entry[]) => {
        return [...entriesToSort].sort((a, b) => {
            switch (sortOrder) {
                case 'date-asc': return a.createdAt - b.createdAt;
                case 'name-asc': return a.name.localeCompare(b.name);
                case 'name-desc': return b.name.localeCompare(b.name);
                case 'manual-dnd': return entries.indexOf(a) - entries.indexOf(b);
                case 'date-desc':
                default:
                    return b.createdAt - a.createdAt;
            }
        });
    }, [sortOrder, entries]);

    const groupsInCategory = useMemo(() => {
        if (selectedCategoryId === 'all' || selectedCategoryId === 'favorites') return [];
        return groups.filter(g => g.categoryId === selectedCategoryId);
    }, [groups, selectedCategoryId]);
    
    // Fix: Refactored entriesByGroup to use the improved sortEntries function, which fixes the error.
    const entriesByGroup = useMemo(() => {
        const container = new Map<string, Entry[]>();
        
        const groupsToList = (selectedCategoryId === 'all' || selectedCategoryId === 'favorites')
            ? groups 
            : groups.filter(g => g.categoryId === selectedCategoryId);

        groupsToList.forEach(group => container.set(group.id, []));

        filteredEntries.forEach(entry => {
            if (entry.groupId && container.has(entry.groupId)) {
                container.get(entry.groupId)!.push(entry);
            }
        });
        
        for(const [groupId, entriesInGroup] of container.entries()){
            container.set(groupId, sortEntries(entriesInGroup));
        }

        return container;
    }, [filteredEntries, groups, selectedCategoryId, sortEntries]);

    const entriesInAll = useMemo(() => {
        if (selectedCategoryId !== 'all' && selectedCategoryId !== 'favorites') return [];
        return sortEntries(filteredEntries);
    }, [filteredEntries, selectedCategoryId, sortEntries]);

    const currentCategoryName = useMemo(() => {
        if (selectedCategoryId === 'all') return '所有条目';
        if (selectedCategoryId === 'favorites') return '我的收藏';
        return categories.find(c => c.id === selectedCategoryId)?.name || '选择分类';
    }, [categories, selectedCategoryId]);
    
    const filterableGroups = useMemo(() => {
        if (selectedCategoryId === 'all') return groups;
        if (selectedCategoryId === 'favorites') return groups.filter(g => entries.some(e => e.isFavorite && e.groupId === g.id));
        return groups.filter(g => g.categoryId === selectedCategoryId);
    }, [groups, selectedCategoryId, entries]);

  return (
    <div className="h-screen bg-gray-50 text-gray-900">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex flex-col h-full">
        <header className="flex justify-between items-center mb-8 flex-shrink-0">
            <h1 className="text-3xl font-bold text-gray-800">灵感库</h1>
            <div className="flex items-center space-x-4">
                <button onClick={() => setIsAiModalOpen(true)} className="flex items-center text-sm font-semibold text-violet-800 bg-[#E4D0FF]/60 hover:bg-[#E4D0FF] px-3 py-2 rounded-md transition-colors">
                    <AiIcon className="h-4 w-4 mr-1.5" /> AI 整理
                </button>
                <button onClick={handleNewEntry} className="flex items-center text-sm font-semibold text-violet-800 bg-[#E4D0FF]/60 hover:bg-[#E4D0FF] px-3 py-2 rounded-md transition-colors">
                    <PlusIcon className="h-4 w-4 mr-1.5" /> 新建条目
                </button>
                <button onClick={() => setIsSettingsOpen(true)} className="text-gray-600 hover:text-violet-600"><SettingsIcon/></button>
            </div>
        </header>

        <div className="flex flex-col md:flex-row md:space-x-2 flex-1 min-h-0">
            {/* Sidebar */}
            <aside className="w-full md:w-72 flex-shrink-0 mb-8 md:mb-0 bg-white/60 p-6 rounded-xl shadow-lg border border-gray-200 flex flex-col">
                <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar -mr-3 pr-3">
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800 mb-4">分类</h2>
                            <div className="flex space-x-2 mb-3">
                                <input type="text" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="新建分类..." className="flex-grow p-2 text-sm border border-gray-300 rounded-md focus:ring-blue-400 focus:border-blue-400"/>
                                <button onClick={handleAddCategory} className="px-3 py-2 bg-violet-500 text-white rounded-md hover:bg-violet-600 transition-colors text-sm font-semibold">添加</button>
                            </div>
                            <ul className="space-y-1" onDragLeave={handleDragLeave}>
                                <li>
                                    <button onClick={() => setSelectedCategoryId('all')} className={`w-full text-left px-3 py-2 rounded-md text-base font-medium flex justify-between items-center transition-colors ${selectedCategoryId === 'all' ? 'bg-[#C7E6FF] text-blue-900' : 'text-gray-600 hover:bg-blue-100'}`}>
                                        <span className="truncate">所有条目</span>
                                        <span>{entries.length}</span>
                                    </button>
                                </li>
                                <li>
                                     <button onClick={() => setSelectedCategoryId('favorites')} className={`w-full text-left px-3 py-2 rounded-md text-base font-medium flex justify-between items-center transition-colors ${selectedCategoryId === 'favorites' ? 'bg-[#C7E6FF] text-blue-900' : 'text-gray-600 hover:bg-blue-100'}`}>
                                        <span className="truncate flex items-center"><HeartIconOutline className="w-4 h-4 mr-2" />我的收藏</span>
                                        <span>{entries.filter(e => e.isFavorite).length}</span>
                                    </button>
                                </li>

                                <div className="pt-2 !mt-3 border-t border-gray-200">
                                    {categories.map(cat => (
                                        <li 
                                            key={cat.id}
                                            onDragOver={(e) => handleDragOver(e, 'category', cat.id)}
                                            onDrop={(e) => handleDrop(e, 'category', cat.id)}
                                            className={`rounded-md transition-colors ${dragOverTarget?.type === 'category' && dragOverTarget.id === cat.id ? 'ring-2 ring-blue-400' : ''}`}
                                            onContextMenu={(e) => handleContextMenu(e, cat.id)}
                                            >
                                            {editingCategoryId === cat.id ? (
                                                <input
                                                    type="text"
                                                    value={editingCategoryName}
                                                    onChange={e => setEditingCategoryName(e.target.value)}
                                                    onBlur={() => handleSaveCategoryName(cat.id)}
                                                    onKeyDown={e => handleCategoryNameKeyDown(e, cat.id)}
                                                    className="w-full px-3 py-2 text-base font-medium border border-gray-300 rounded-md focus:ring-blue-400 focus:border-blue-400"
                                                    autoFocus
                                                />
                                            ) : (
                                                <button
                                                    onDoubleClick={() => handleStartEditCategory(cat)}
                                                    onClick={() => setSelectedCategoryId(cat.id)}
                                                    className={`w-full text-left px-3 py-2 rounded-md text-base font-medium flex justify-between items-center ${selectedCategoryId === cat.id ? 'bg-[#C7E6FF] text-blue-900' : 'text-gray-600 hover:bg-blue-100'}`}>
                                                    <span className="truncate">{cat.name}</span>
                                                    <span>{entries.filter(e => groups.some(g => g.id === e.groupId && g.categoryId === cat.id)).length}</span>
                                                </button>
                                            )}
                                        </li>
                                    ))}
                                </div>
                            </ul>
                        </div>
                    </div>
                </div>
            </aside>

             {/* Main Content */}
            <main className="flex-1 min-w-0 relative" onDragEnd={handleDragEnd}>
                <div className="bg-white/60 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-bold text-gray-800">{currentCategoryName}</h1>
                            {selectedCategoryId === 'favorites' && entries.some(e => e.isFavorite) && (
                                <button
                                    onClick={handleUnfavoriteAll}
                                    className="px-3 py-1 bg-rose-100 text-rose-700 rounded-md hover:bg-rose-200 transition-colors text-sm font-semibold"
                                >
                                    全部取消收藏
                                </button>
                            )}
                        </div>
                        {selectedCategoryId !== 'all' && selectedCategoryId !== 'favorites' && (
                            <button onClick={() => handleDeleteCategory(selectedCategoryId)} className="text-gray-400 hover:text-red-500"><TrashIcon className="w-4 h-4" /></button>
                        )}
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative w-full md:w-2/5">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon /></div>
                            <input type="text" placeholder="搜索条目名称..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full p-3 pl-10 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"/>
                        </div>
                        <input type="text" placeholder="筛选标签..." value={filterTag} onChange={e => setFilterTag(e.target.value)} className="w-full md:w-1/5 p-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"/>
                        <select 
                            value={filterGroupId}
                            onChange={e => setFilterGroupId(e.target.value)}
                            className="w-full md:w-1/5 p-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm text-gray-600 font-medium"
                        >
                            <option value="all">所有分组</option>
                            {filterableGroups.map(group => (
                                <option key={group.id} value={group.id}>{group.name}</option>
                            ))}
                        </select>
                        {/* Fix: Added 'manual-dnd' option to allow users to select manual sorting. */}
                        <select 
                            id="sort-order"
                            value={sortOrder}
                            onChange={e => setSortOrder(e.target.value as SortOption)}
                            className="w-full md:w-1/5 p-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm text-gray-600 font-medium"
                        >
                            <option value="date-desc">按日期降序</option>
                            <option value="date-asc">按日期升序</option>
                            <option value="name-asc">按名称升序 (A-Z)</option>
                            <option value="name-desc">按名称降序 (Z-A)</option>
                            <option value="manual-dnd">手动排序</option>
                        </select>
                    </div>

                    {selectedCategoryId !== 'all' && selectedCategoryId !== 'favorites' && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                            <div className="flex space-x-2 relative">
                                <div className="relative" ref={iconPickerRef}>
                                    <button 
                                        onClick={() => setIsIconPickerOpen(!isIconPickerOpen)} 
                                        className="p-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100 h-full"
                                        aria-label="选择分组图标"
                                    >
                                        {React.createElement(getIconComponentByName(newGroupIcon), { className: "h-5 w-5 text-gray-600" })}
                                    </button>
                                    
                                    {isIconPickerOpen && (
                                        <div className="absolute top-full mt-2 left-0 z-10 bg-white p-2 rounded-lg shadow-xl border border-gray-200 grid grid-cols-6 gap-1 w-64">
                                            {iconNames.map(iconName => {
                                                const IconComponent = getIconComponentByName(iconName);
                                                return (
                                                    <button 
                                                        key={iconName}
                                                        onClick={() => {
                                                            setNewGroupIcon(iconName);
                                                            setIsIconPickerOpen(false);
                                                        }}
                                                        className={`p-2 rounded-md hover:bg-gray-100 transition-colors ${newGroupIcon === iconName ? 'bg-violet-100 ring-2 ring-violet-400' : ''}`}
                                                        aria-label={`选择 ${iconName} 图标`}
                                                    >
                                                        <IconComponent className="h-5 w-5 text-gray-700" />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                                <input type="text" value={newGroupName} onChange={e => setNewGroupName(e.target.value)} placeholder="新建分组名称..." className="flex-grow p-2 text-sm border border-gray-300 rounded-md focus:ring-blue-400 focus:border-blue-400"/>
                                <button onClick={handleAddGroup} className="px-4 py-2 bg-violet-500 text-white rounded-md hover:bg-violet-600 transition-colors font-semibold text-sm">添加分组</button>
                            </div>
                        </div>
                    )}
                    
                    <div className="flex-1 overflow-auto custom-scrollbar -mr-3 pr-3" onDragLeave={handleDragLeave}>
                    {selectedCategoryId === 'all' || selectedCategoryId === 'favorites' ? (
                        (() => {
                            if (entriesInAll.length === 0) return <div className="text-center py-8 text-gray-500">沒有找到条目。</div>;
                            
                            const chunkedEntries = chunk(entriesInAll, CARDS_PER_ROW);
                            const LEFT_SIDE_COUNT = CARDS_PER_ROW - RIGHT_TO_LEFT_COUNT;

                            return (
                                <div className="space-y-1">
                                    {chunkedEntries.map((rowEntries, rowIndex) => (
                                        <div key={rowIndex} className="flex gap-1">
                                            {/* Left-expanding cards */}
                                            <div className="flex gap-1">
                                                {rowEntries.slice(0, LEFT_SIDE_COUNT).map(entry => {
                                                    const group = groupMap.get(entry.groupId || '');
                                                    const Icon = getIconComponentByName(group?.icon);
                                                    return (
                                                        <EntryCard 
                                                            key={entry.id}
                                                            entry={entry}
                                                            groupName={getGroupName(entry.groupId)}
                                                            IconComponent={Icon}
                                                            onClick={() => handleEditEntry(entry)}
                                                            onDelete={() => handleDeleteEntry(entry.id)}
                                                            onToggleFavorite={() => handleToggleFavorite(entry.id)}
                                                            onDragStart={(e) => handleDragStart(e, 'entry', entry.id)}
                                                            onDragOver={(e) => handleDragOver(e, 'entry', entry.id)}
                                                            onDrop={(e) => handleDrop(e, 'entry', entry.id)}
                                                            isDragOver={dragOverTarget?.type === 'entry' && dragOverTarget.id === entry.id}
                                                            isSelected={selectedEntryIds.includes(entry.id)}
                                                            onSelectToggle={handleSelectToggle}
                                                        />
                                                    );
                                                })}
                                            </div>
                                            {/* Right-to-left squeezing cards */}
                                            {rowEntries.length > LEFT_SIDE_COUNT && (
                                                <div className="flex flex-row-reverse gap-1">
                                                    {[...rowEntries.slice(LEFT_SIDE_COUNT)].reverse().map(entry => {
                                                        const group = groupMap.get(entry.groupId || '');
                                                        const Icon = getIconComponentByName(group?.icon);
                                                        return (
                                                            <EntryCard 
                                                                key={entry.id}
                                                                entry={entry}
                                                                groupName={getGroupName(entry.groupId)}
                                                                IconComponent={Icon}
                                                                onClick={() => handleEditEntry(entry)}
                                                                onDelete={() => handleDeleteEntry(entry.id)}
                                                                onToggleFavorite={() => handleToggleFavorite(entry.id)}
                                                                onDragStart={(e) => handleDragStart(e, 'entry', entry.id)}
                                                                onDragOver={(e) => handleDragOver(e, 'entry', entry.id)}
                                                                onDrop={(e) => handleDrop(e, 'entry', entry.id)}
                                                                isDragOver={dragOverTarget?.type === 'entry' && dragOverTarget.id === entry.id}
                                                                isSelected={selectedEntryIds.includes(entry.id)}
                                                                onSelectToggle={handleSelectToggle}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            );
                        })()
                    ) : (
                       <div className="divide-y divide-gray-200">
                            {groupsInCategory.map((group) => {
                                const entriesForGroup = entriesByGroup.get(group.id) || [];
                                if (entriesForGroup.length === 0 && (filterTag || (filterGroupId !== 'all' && filterGroupId !== group.id))) {
                                    return null;
                                }
                                const Icon = getIconComponentByName(group.icon);
                                const LEFT_SIDE_COUNT = CARDS_PER_ROW - RIGHT_TO_LEFT_COUNT;
                                const chunkedEntries = chunk(entriesForGroup, CARDS_PER_ROW);

                                return (
                                    <div key={group.id} className="py-4">
                                        <div className={`flex justify-between items-center mb-4 p-2 rounded-md transition-colors ${dragOverTarget?.type === 'group' && dragOverTarget.id === group.id ? 'ring-2 ring-blue-400' : ''}`}
                                             onDragOver={(e) => handleDragOver(e, 'group', group.id)}
                                             onDrop={(e) => handleDrop(e, 'group', group.id)}
                                        >
                                            {editingGroupId === group.id ? (
                                                <div className="flex items-center flex-1 mr-2">
                                                    <Icon className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                                                    <input
                                                        type="text"
                                                        value={editingGroupName}
                                                        onChange={e => setEditingGroupName(e.target.value)}
                                                        onBlur={() => handleSaveGroupName(group.id)}
                                                        onKeyDown={e => handleGroupNameKeyDown(e, group.id)}
                                                        className="font-bold text-lg text-gray-700 w-full p-0 border-b border-gray-400 focus:outline-none focus:ring-0 bg-transparent"
                                                        autoFocus
                                                    />
                                                </div>
                                            ) : (
                                                <h2
                                                    draggable
                                                    onDragStart={(e) => handleDragStart(e, 'group', group.id)}
                                                    onDoubleClick={() => handleStartEditGroup(group)}
                                                    className="font-bold text-lg text-gray-700 flex items-center cursor-grab truncate"
                                                    title="双击重命名，拖拽移动"
                                                >
                                                    <Icon className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                                                    <span className="truncate">{group.name}</span>
                                                </h2>
                                            )}
                                            <button onClick={() => handleDeleteGroup(group.id)} className="text-gray-400 hover:text-red-500 ml-2">
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                        
                                        {entriesForGroup.length > 0 ? (
                                            <div className="w-max">
                                                <div className="space-y-1">
                                                    {chunkedEntries.map((rowEntries, rowIndex) => (
                                                        <div key={rowIndex} className="flex gap-1">
                                                            {/* Left-expanding cards */}
                                                            <div className="flex gap-1">
                                                                {rowEntries.slice(0, LEFT_SIDE_COUNT).map(entry => (
                                                                    <EntryCard
                                                                        key={entry.id}
                                                                        entry={entry}
                                                                        groupName={group.name}
                                                                        IconComponent={Icon}
                                                                        onClick={() => handleEditEntry(entry)}
                                                                        onDelete={() => handleDeleteEntry(entry.id)}
                                                                        onToggleFavorite={() => handleToggleFavorite(entry.id)}
                                                                        onDragStart={(e) => handleDragStart(e, 'entry', entry.id)}
                                                                        onDragOver={(e) => handleDragOver(e, 'entry', entry.id)}
                                                                        onDrop={(e) => handleDrop(e, 'entry', entry.id)}
                                                                        isDragOver={dragOverTarget?.type === 'entry' && dragOverTarget.id === entry.id}
                                                                        isSelected={selectedEntryIds.includes(entry.id)}
                                                                        onSelectToggle={handleSelectToggle}
                                                                    />
                                                                ))}
                                                            </div>
                                                            {/* Right-to-left squeezing cards */}
                                                            {rowEntries.length > LEFT_SIDE_COUNT && (
                                                                <div className="flex flex-row-reverse gap-1">
                                                                    {[...rowEntries.slice(LEFT_SIDE_COUNT)].reverse().map(entry => (
                                                                        <EntryCard
                                                                            key={entry.id}
                                                                            entry={entry}
                                                                            groupName={group.name}
                                                                            IconComponent={Icon}
                                                                            onClick={() => handleEditEntry(entry)}
                                                                            onDelete={() => handleDeleteEntry(entry.id)}
                                                                            onToggleFavorite={() => handleToggleFavorite(entry.id)}
                                                                            onDragStart={(e) => handleDragStart(e, 'entry', entry.id)}
                                                                            onDragOver={(e) => handleDragOver(e, 'entry', entry.id)}
                                                                            onDrop={(e) => handleDrop(e, 'entry', entry.id)}
                                                                            isDragOver={dragOverTarget?.type === 'entry' && dragOverTarget.id === entry.id}
                                                                            isSelected={selectedEntryIds.includes(entry.id)}
                                                                            onSelectToggle={handleSelectToggle}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                                                <p className="text-gray-500 text-sm font-medium">此分组下没有条目。</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                       </div>
                    )}
                    </div>
                </div>
                {selectedEntryIds.length > 0 && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-auto bg-gray-900/90 backdrop-blur-sm text-white rounded-lg shadow-2xl flex items-center space-x-2 p-2 z-20">
                        <span className="text-sm font-medium px-3">{selectedEntryIds.length} 项已选择</span>
                        <div className="h-6 w-px bg-gray-500"></div>
                        <button onClick={() => setIsBatchMoveOpen(true)} title="移动" className="p-2 rounded-md hover:bg-violet-500 transition-colors"><ArrowUturnRightIcon className="h-5 w-5" /></button>
                        <button onClick={() => setIsBatchTagOpen(true)} title="管理标签" className="p-2 rounded-md hover:bg-violet-500 transition-colors"><TagIcon className="h-5 w-5" /></button>
                        <button onClick={handleBatchDelete} title="删除" className="p-2 rounded-md hover:bg-red-500 transition-colors"><TrashIcon className="h-5 w-5" /></button>
                        <div className="h-6 w-px bg-gray-500"></div>
                        <button onClick={handleDeselectAll} className="px-3 py-1.5 text-xs font-semibold rounded-md hover:bg-gray-700 transition-colors">全部取消</button>
                    </div>
                )}
            </main>
        </div>
      </div>
      {contextMenu && (
        <div
            ref={contextMenuRef}
            style={{ top: contextMenu.y, left: contextMenu.x }}
            className="absolute z-50 bg-white rounded-md shadow-lg border border-gray-200 text-sm font-medium py-1 w-48"
        >
            {contextMenu.categoryId !== 'all' && (
                 <button onClick={() => handleExportCategory(contextMenu.categoryId)} className="w-full text-left px-3 py-1.5 hover:bg-gray-100 flex items-center">
                    <ArrowDownTrayIcon className="w-4 h-4 mr-2" /> 导出分类...
                </button>
            )}
             <button onClick={handleImportCategoryClick} className="w-full text-left px-3 py-1.5 hover:bg-gray-100 flex items-center">
                <ArrowUpTrayIcon className="w-4 h-4 mr-2" /> 导入分类...
            </button>
        </div>
      )}
       <input type="file" ref={importCategoryInputRef} accept=".json" className="hidden" onChange={handleImportCategory} multiple />
      <Modal isOpen={isFormOpen} onClose={handleCancelForm}>
        <EntryForm 
            onSave={handleSaveEntry}
            onCancel={handleCancelForm}
            onDelete={handleDeleteEntry}
            categories={categories}
            groups={groups}
            entryToEdit={editingEntry}
        />
      </Modal>
      <Modal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} className="max-w-4xl">
        <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">AI 整理</h2>
            <p className="text-sm text-gray-500 mb-4">在此处粘贴任意文本，AI 将自动为您创建分类、分组和条目。</p>
            <textarea
                value={aiInputText}
                onChange={e => setAiInputText(e.target.value)}
                placeholder="在此处粘贴任意文本..."
                className="w-full h-96 p-4 text-base border border-gray-300 rounded-md focus:ring-violet-400 focus:border-violet-400 custom-scrollbar resize-y bg-gray-50"
                disabled={isAiProcessing}
            />
            <button
                onClick={handleAiOrganize}
                disabled={isAiProcessing || !aiInputText.trim()}
                className="mt-4 w-full px-4 py-2 bg-violet-500 text-white rounded-md hover:bg-violet-600 transition-colors font-semibold text-sm disabled:bg-violet-300 disabled:cursor-not-allowed"
            >
                {isAiProcessing ? '处理中...' : '开始整理'}
            </button>
        </div>
      </Modal>
       <Modal isOpen={isAiPreviewModalOpen} onClose={handleCancelAiPreview} className="max-w-4xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">AI 整理预览</h2>
        <p className="text-sm text-gray-600 mb-6">请检查 AI 生成的内容。您可以直接修改，然后确认或取消。不想要的条目可以直接删除。</p>
        {editableAiPreviewData && (
            <AiPreview
                data={editableAiPreviewData}
                setData={setEditableAiPreviewData}
                iconNames={iconNames}
            />
        )}
        <div className="mt-8 flex justify-end space-x-3">
            <button onClick={handleCancelAiPreview} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm font-semibold">取消</button>
            <button onClick={() => handleAcceptAiPreview(editableAiPreviewData!)} className="px-4 py-2 bg-violet-500 text-white rounded-md hover:bg-violet-600 text-sm font-semibold">确认并添加</button>
        </div>
      </Modal>
      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}>
        <SettingsView 
            aiConfig={aiConfig}
            setAiConfig={setAiConfig}
            modelOptions={modelOptions}
            setModelOptions={setModelOptions}
            onBack={() => setIsSettingsOpen(false)}
            onExport={handleExportData}
            onImport={handleImportData}
            onClearAll={handleClearAllData}
        />
      </Modal>
       <Modal isOpen={isBatchMoveOpen} onClose={() => setIsBatchMoveOpen(false)} className="max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">移动条目</h2>
            <p className="text-sm text-gray-600 mb-4">为选中的 {selectedEntryIds.length} 个条目选择一个新的分组。</p>
            <select onChange={(e) => setBatchMoveGroupId(e.target.value)} defaultValue="" className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-[#C7E6FF] focus:border-blue-400">
                <option value="" disabled>选择分组...</option>
                {categories.map(category => (
                    <optgroup key={category.id} label={category.name}>
                        {groups.filter(g => g.categoryId === category.id).map(group => <option key={group.id} value={group.id}>{group.name}</option>)}
                    </optgroup>
                ))}
            </select>
            <div className="mt-6 flex justify-end space-x-2">
                <button onClick={() => setIsBatchMoveOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm font-semibold">取消</button>
                <button onClick={handleBatchMove} className="px-4 py-2 bg-violet-500 text-white rounded-md hover:bg-violet-600 text-sm font-semibold">移动</button>
            </div>
      </Modal>
      <Modal isOpen={isBatchTagOpen} onClose={() => setIsBatchTagOpen(false)} className="max-w-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">管理标签</h2>
            <p className="text-sm text-gray-600 mb-4">为选中的 {selectedEntryIds.length} 个条目添加或移除标签（用空格分隔）。</p>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">添加标签</label>
                    <input type="text" value={tagsToAdd} onChange={e => setTagsToAdd(e.target.value)} placeholder="tag1 tag2" className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#C7E6FF] focus:border-blue-400" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">移除标签</label>
                    <input type="text" value={tagsToRemove} onChange={e => setTagsToRemove(e.target.value)} placeholder="tag3 tag4" className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#C7E6FF] focus:border-blue-400" />
                </div>
            </div>
             <div className="mt-6 flex justify-end space-x-2">
                <button onClick={() => setIsBatchTagOpen(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm font-semibold">取消</button>
                <button onClick={handleBatchTag} className="px-4 py-2 bg-violet-500 text-white rounded-md hover:bg-violet-600 text-sm font-semibold">更新标签</button>
            </div>
      </Modal>
    </div>
  );
}
