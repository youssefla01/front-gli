import React from 'react';

/**
 * Safely serialize data to prevent Symbol cloning errors
 */
export const serializeData = (data: any) => {
  if (!data) return data;
  
  try {
    // Handle Date objects
    if (data instanceof Date) {
      return data.toISOString();
    }
    
    // Handle arrays
    if (Array.isArray(data)) {
      return data.map(item => serializeData(item));
    }
    
    // Handle objects
    if (typeof data === 'object' && !React.isValidElement(data)) {
      const serialized: Record<string, any> = {};
      for (const [key, value] of Object.entries(data)) {
        if (value !== undefined && !React.isValidElement(value)) {
          serialized[key] = serializeData(value);
        }
      }
      return serialized;
    }
    
    // Handle primitive values
    if (typeof data === 'symbol') {
      return data.toString();
    }
    
    return data;
  } catch (error) {
    console.warn('Failed to serialize data:', error);
    return null;
  }
};

/**
 * Transform API response data
 */
export const transformResponse = (response: any) => {
  return serializeData(response);
};

/**
 * Transform query parameters
 */
export const transformQueryParams = (params: Record<string, any>) => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, v.toString()));
      } else if (value instanceof Date) {
        searchParams.append(key, value.toISOString());
      } else {
        searchParams.append(key, value.toString());
      }
    }
  });
  
  return searchParams;
};