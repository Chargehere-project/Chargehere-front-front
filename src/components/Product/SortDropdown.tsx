import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import styled from 'styled-components';

interface SortDropdownProps {
  value?: string;  // value를 optional로 변경
  onChange: (value: string) => void;
}

const SortContainer = styled.div`
  position: relative;
  display: inline-block;
  min-width: 200px;
`;

const SortButton = styled.button<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 12px;
  background: white;
  border: none;
  cursor: pointer;
  color: black;
  
  &:hover {
    background: #f8fafc;
  }
  
  svg {
    transition: transform 0.2s ease;
    transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0)'};
    color: black;
  }
`;

const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: white;
  border: none;
  margin-top: 4px;
  display: ${props => props.isOpen ? 'block' : 'none'};
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const MenuItem = styled.button<{ isActive: boolean }>`
  width: 100%;
  padding: 8px 12px;
  text-align: left;
  background: ${props => props.isActive ? '#f1f5f9' : 'white'};
  cursor: pointer;
  border: none;
  color: black;
  white-space: nowrap;
  
  &:hover {
    background: #f1f5f9;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const sortOptions = [
  { value: 'latest', label: '최신순' },
  { value: 'priceHigh', label: '가격 높은순' },
  { value: 'priceLow', label: '가격 낮은순' },
  { value: 'discountHigh', label: '할인율 높은순' }
];

const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.sort-dropdown')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  const getCurrentLabel = () => {
    if (!value) return '정렬 기준';  // value가 없을 때는 '정렬 기준' 표시
    return sortOptions.find(option => option.value === value)?.label || '정렬 기준';
  };

  return (
    <SortContainer className="sort-dropdown">
      <SortButton onClick={toggleDropdown} isOpen={isOpen}>
        <span>{getCurrentLabel()}</span>
        <ChevronDown size={16} />
      </SortButton>
      <DropdownMenu isOpen={isOpen}>
        {sortOptions.map(option => (
          <MenuItem
            key={option.value}
            isActive={value === option.value}
            onClick={() => handleSelect(option.value)}
          >
            {option.label}
          </MenuItem>
        ))}
      </DropdownMenu>
    </SortContainer>
  );
};

export default SortDropdown;