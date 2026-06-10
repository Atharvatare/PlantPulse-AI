import { useState, useEffect, useCallback } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

export default function SearchBar({ value: externalValue, onChange, placeholder = 'Search...', debounceMs = 300 }) {
  const [value, setValue] = useState(externalValue || '');

  useEffect(() => { setValue(externalValue || ''); }, [externalValue]);

  const debouncedOnChange = useCallback(
    (() => {
      let timer;
      return (v) => {
        clearTimeout(timer);
        timer = setTimeout(() => onChange?.(v), debounceMs);
      };
    })(),
    [onChange, debounceMs]
  );

  const handleChange = (e) => {
    const v = e.target.value;
    setValue(v);
    debouncedOnChange(v);
  };

  const clear = () => {
    setValue('');
    onChange?.('');
  };

  return (
    <div className="relative">
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-industrial-400" size={16} />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full bg-industrial-800/80 border border-industrial-700/50 text-white text-sm rounded-lg pl-10 pr-9 py-2.5 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 transition-all placeholder-industrial-500"
      />
      {value && (
        <button onClick={clear} className="absolute right-3 top-1/2 -translate-y-1/2 text-industrial-400 hover:text-white transition-colors">
          <FiX size={16} />
        </button>
      )}
    </div>
  );
}
