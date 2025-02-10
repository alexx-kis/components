import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from '../icon/icon';
import './select.scss';

// ^======================== Select ========================^ //

type SelectProps = {
  bemClass: string;
  initialHeaderText: string;
  iconSrc: string;
  iconWidth: number;
  iconHeight: number;
  options: string[];
  name: string;
  onSelectChange: (value: string) => void;
  value: string;
};

function Select(selectProps: SelectProps): React.JSX.Element {

  const { bemClass, initialHeaderText, iconSrc, iconWidth, iconHeight, options, name, onSelectChange, value } = selectProps;

  const [isOpen, setIsOpen] = useState(false);
  const [headerText, setHeaderText] = useState(initialHeaderText);

  const selectRef = useRef<HTMLDivElement | null>(null);
  const selectBodyRef = useRef<HTMLDivElement | null>(null);
  const selectHeaderText = useRef<HTMLParagraphElement | null>(null);

  const checkIsOpen = useCallback(() => {
    if (selectRef.current && selectBodyRef.current) {
      if (isOpen) {
        selectBodyRef.current.style.maxHeight = '0px';
      } else {
        selectBodyRef.current.style.maxHeight = `${selectBodyRef.current?.scrollHeight}px`;
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handleDocumentClick = () => {
      if (isOpen) {
        setIsOpen(false);
        checkIsOpen();
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, [isOpen, checkIsOpen]);

  useEffect(() => {
    if (value) {
      setHeaderText(value);
    } else {
      setHeaderText(initialHeaderText);
    }

  }, [value, initialHeaderText]);

  const handleSelectHeaderClick = () => {
    setIsOpen(!isOpen);
    checkIsOpen();
  };

  const handleBodyClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement | null;
    if (target?.classList.contains('select__label')) {
      const selectedValue = target.textContent || '';
      setHeaderText(selectedValue);
      onSelectChange(selectedValue);
    }
  };

  return (
    <div
      className={clsx(
        `select ${bemClass}`,
        { '_active': isOpen },
        { '_selected': headerText !== initialHeaderText }
      )}
      ref={selectRef}
    >
      <div
        className='select__header'
        onClick={handleSelectHeaderClick}
      >
        <p className='select__header-text' ref={selectHeaderText}>{headerText}</p>
        <Icon
          bemClass='select__header-icon'
          src={iconSrc}
          width={iconWidth}
          height={iconHeight}
        />
      </div>
      <div
        className='select__body'
        ref={selectBodyRef}
        onClick={handleBodyClick}
      >
        <ul className='select__list'>
          {options?.map((option) =>
            <li key={option} className='select__item'>
              <label className='select__label'>
                <input
                  className='select__input'
                  type='radio'
                  name={name}
                  checked={option === value}
                  readOnly
                />
                {option}
              </label>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
export default Select;