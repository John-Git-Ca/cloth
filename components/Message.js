import React from 'react';
import { Alert } from 'react-bootstrap';

const Message = ({ variant, children }) => {
  return (
    <Alert variant={variant} className="p-1 m-1">
      {children}
    </Alert>
  );
};

Message.defaultProps = {
  variant: 'info',
};

export default Message;
