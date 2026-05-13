import React from 'react';
import * as Icons from 'lucide-react';

const DynamicIcon = ({ name, size = 20, className = "" }) => {
  const IconComponent = Icons[name];
  
  if (!IconComponent) {
    // Fallback to a generic icon if the name is not found
    return <Icons.HelpCircle size={size} className={className} />;
  }

  return <IconComponent size={size} className={className} />;
};

export default DynamicIcon;
