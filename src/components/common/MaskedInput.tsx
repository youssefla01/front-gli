import React from 'react';
import { Input } from 'antd';

interface MaskedInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  mask: 'phone' | 'rib';
}

const MaskedInput: React.FC<MaskedInputProps> = ({
  value = '',
  onChange,
  placeholder,
  className,
  mask
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value.replace(/\D/g, ''); // Keep only digits

    if (mask === 'phone') {
      // Format as XX XX XX XX XX
      if (newValue.length > 0) {
        newValue = newValue.match(/.{1,2}/g)?.join(' ') || '';
        newValue = newValue.substring(0, 14); // Limit to 10 digits + spaces
      }
    } else if (mask === 'rib') {
      // Format as XXXX XXXX XXXX XXXX XXXX XXXX XXX
      if (newValue.length > 0) {
        newValue = newValue.match(/.{1,4}/g)?.join(' ') || '';
        newValue = newValue.substring(0, 34); // Limit to 27 digits + spaces
      }
    }

    onChange?.(newValue);
  };

  return (
    <Input
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
    />
  );
};

export default MaskedInput;