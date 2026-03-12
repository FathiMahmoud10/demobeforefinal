import React, { createContext, useContext, useState, useEffect } from 'react';
import { AUTH_API_BASE } from '@/lib/utils';

export interface Group {
  id: number;
  code: string;
  name: string;
}

interface GroupsContextType {
  groups: Group[];
  addGroup: (name: string, nameSecondary?: string, description?: string, nameUr?: string, imageFile?: File) => Promise<void>;
  deleteGroup: (id: number) => Promise<void>;
  duplicateGroup: (id: number) => Promise<void>;
}

const GroupsContext = createContext<GroupsContextType | undefined>(undefined);

export const GroupsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [groups, setGroups] = useState<Group[]>(() => {
    const saved = localStorage.getItem('takamul_groups');
    return saved ? JSON.parse(saved) : [];
  });

const API_BASE = "/api";
  useEffect(() => {
    localStorage.setItem('takamul_groups', JSON.stringify(groups));
  }, [groups]);

  // helper to refresh group list from server
  const loadFromApi = async () => {
    try {
      const token = localStorage.getItem('takamul_token');
      // GET should hit the base collection endpoint, not the CREATE action
      const url = `${API_BASE}/ProductCategories`;
      console.debug('GroupsContext.loadFromApi calling GET', url);
      const res = await fetch(url, {
        headers: {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) {
        console.warn('Failed to fetch product categories from API, status:', res.status);
        return;
      }
      const data = await res.json();
      console.debug('GroupsContext.loadFromApi received', data.length, 'items:', data);
      if (Array.isArray(data)) {
        const mapped: Group[] = data.map((c: any, idx: number) => {
          const id = Number(c?.id ?? c?.categoryId ?? idx + 1);
          const name = String(
            c?.categoryName ||
            c?.categoryNameAr ||
            c?.categoryNameEn ||
            c?.categoryNameUr ||
            c?.description ||
            ''
          );
          return {
            id,
            code: c?.code ?? `CAT-${String(id).padStart(3, '0')}`,
            name,
          };
        });
        console.debug('GroupsContext.loadFromApi mapped to', mapped.length, 'items');
        setGroups(mapped);
      } else {
        console.warn('loadFromApi: response not array', data);
      }
    } catch (err) {
      console.error('Error loading product categories from API', err);
    }
  };

  useEffect(() => {
    loadFromApi();
  }, []);

  const addGroup = async (name: string, nameSecondary?: string, description?: string, nameUr?: string, imageFile?: File) => {
    const token = localStorage.getItem('takamul_token');
    const form = new FormData();

    // Match API field names exactly - ALL fields are required by API
    form.append('CategoryNameAr', name || '');
    form.append('CategoryNameEn', nameSecondary || name); // fallback to Arabic name if not provided
    form.append('CategoryNameUr', nameUr || nameSecondary || name); // use Urdu if provided, else English, else Arabic
    form.append('Description', description || ''); // can be empty
    form.append('parentCategoryId', '0');
    form.append('IsActive', '1'); // REQUIRED - must be '1' for active

    // ImageUrl - this should be a file upload (multipart/form-data expects File object)
    if (imageFile) {
      form.append('ImageUrl', imageFile); // Append the actual File object
    } else {
      // If no file provided, we still need to send something - send empty value
      // The API may accept this or return an error, but let's try
      form.append('ImageUrl', new Blob(), 'image.png'); // Empty blob with filename
    }

    // Remove trailing slash or ensure exact URL
    const url = `${API_BASE}/ProductCategories/CREATE`.replace(/\/+$/, '');

    // log each entry in case the server rejects unexpected/missing fields
    console.debug('GroupsContext.addGroup submitting form data:');
    for (const pair of form.entries()) {
      console.debug(' -', pair[0], '=', pair[1]);
    }
    console.debug('GroupsContext.addGroup additional params', { name, nameSecondary, nameUr, description, imageFile });
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        // Do NOT set Content-Type - browser will set it for multipart/form-data
      },
      body: form,
    });

    let createdItem: any = null;
    if (res.ok) {
      try {
        createdItem = await res.json();
        console.debug('addGroup API response body', createdItem);
      } catch {
        // no json response
      }
    }

    if (!res.ok) {
      let errorMsg = `HTTP ${res.status}`;
      try {
        const text = await res.text();
        console.error('addGroup API error response text', text);
        if (text) errorMsg += `: ${text}`;
      } catch (e) {
        console.error('failed reading error body', e);
      }
      throw new Error(errorMsg);
    }

    // If server response contains the created category, optimistically append it
    if (createdItem && typeof createdItem === 'object') {
      const id = Number(createdItem?.id ?? createdItem?.categoryId ?? Date.now());
      const nameStr = String(
        createdItem?.categoryName ||
        createdItem?.categoryNameAr ||
        createdItem?.categoryNameEn ||
        createdItem?.categoryNameUr ||
        createdItem?.description ||
        ''
      );
      setGroups(prev => [...prev, { id, code: createdItem?.code ?? `CAT-${String(id).padStart(3, '0')}`, name: nameStr }]);
    }

    // Reload list on success (ensures fresh data if API returns after commit)
    await loadFromApi();
  };

  const deleteGroup = async (id: number) => {
    const token = localStorage.getItem('takamul_token');
    const url = `${API_BASE}/ProductCategories/${id}`;
    console.debug('deleteGroup calling DELETE', url);

    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    console.debug('deleteGroup response status:', res.status, res.ok);

    if (!res.ok) {
      const errorText = await res.text();
      const errorMsg = `HTTP ${res.status}: ${errorText}`;
      console.error('deleteGroup failed:', errorMsg);
      throw new Error(errorMsg);
    }

    console.debug('deleteGroup succeeded for id:', id);
    // Reload list after delete
    await loadFromApi();
  };

  const duplicateGroup = async (id: number) => {
    const group = groups.find(g => g.id === id);
    if (!group) throw new Error('Group not found');
    // reuse addGroup to ensure correct fields are sent
    await addGroup(`${group.name} (نسخة)`);
  };

  return (
    <GroupsContext.Provider value={{ groups, addGroup, deleteGroup, duplicateGroup }}>
      {children}
    </GroupsContext.Provider>
  );
};

export const useGroups = () => {
  const context = useContext(GroupsContext);
  if (context === undefined) {
    throw new Error('useGroups must be used within a GroupsProvider');
  }
  return context;
};
