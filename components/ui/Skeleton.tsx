import React from 'react';

const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`bg-slate-700 animate-pulse rounded ${className}`} />
);

export default Skeleton;
