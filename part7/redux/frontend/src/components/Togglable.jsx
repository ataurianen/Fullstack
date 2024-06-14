import { useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? 'none' : '' };
  const showWhenVisible = { display: visible ? '' : 'none' };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <div>
      <div style={hideWhenVisible}>
        <Button onClick={toggleVisibility} variant='contained' color='primary'>
          {props.buttonLabel}
        </Button>
      </div>
      <br />
      <div style={showWhenVisible}>
        {props.children}
        <br />
        <Button onClick={toggleVisibility} variant='contained' color='primary'>
          Cancel
        </Button>
      </div>
    </div>
  );
});

Togglable.displayName = 'Togglable';

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};

export default Togglable;
