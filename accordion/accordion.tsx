import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { AccordionDataType } from '../';
import './accordion.scss';

// $======================== Accordion ========================$ //

type AccordionProps = {
  data: AccordionDataType[];
  HeaderComponent: React.JSXElementConstructor<AccordionDataType['header']>;
  BodyComponent: React.JSXElementConstructor<AccordionDataType['body']>;
};

function Accordion({ data, HeaderComponent, BodyComponent }: AccordionProps): React.JSX.Element {

  const [activeTabIndex, setActiveTabIndex] = useState<number | null>(0);
  const [scrollHeight, setScrollHeight] = useState<number | undefined>(0);

  const bodyRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (bodyRefs.current[activeTabIndex!]) {
      setScrollHeight(bodyRefs.current[activeTabIndex!]?.scrollHeight || 0);
    }
  }, [activeTabIndex]);

  const handleTabClick = (index: number) => {
    setActiveTabIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <ul className='accordion'>
      {
        data.map(({ header, body }, index) => (
          <li
            key={header.id}
            className={clsx(
              'accordion__tab',
              { '_active': activeTabIndex === index }
            )}
          >
            <div
              className='accordion__header'
              onClick={() => handleTabClick(index)}
            >
              <div className='accordion__header-content'>
                <HeaderComponent {...header} />
              </div>
              <div className='accordion__header-icon'>
                <img src={...} alt=''/>
              </div>
            </div>
            <div
              className='accordion__body'
              ref={(el) => { if (el) bodyRefs.current[index] = el; }}
              style={{
                maxHeight: activeTabIndex === index ? `${scrollHeight! + 1}px` : '0'
              }}
            >
              <div className='accordion__body-content'>
                <BodyComponent {...body} />
              </div>
            </div>
          </li>
        ))
      }
    </ul>
  );
}

export default Accordion;
