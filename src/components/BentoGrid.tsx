'use client';

import React from 'react';

interface BentoGridProps {
  children: React.ReactNode;
  layout: Array<{ colSpan: 1 | 2 | 3 | 4; rowSpan: 1 | 2 | 3 }>;
}

const BentoGrid: React.FC<BentoGridProps> = ({ children, layout }) => {
  const childArray = React.Children.toArray(children);

  return (
    <div className="grid grid-cols-4 grid-rows-3 gap-3 h-screen p-4">
      {childArray.map((child, index) => {
        const { colSpan, rowSpan } = layout[index] || { colSpan: 1, rowSpan: 1 };
        return (
          <div key={index} className={`col-span-${colSpan} row-span-${rowSpan}`}>
            {child}
          </div>
        );
      })}
    </div>
  );
};

export default BentoGrid;