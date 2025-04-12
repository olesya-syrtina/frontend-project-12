import React from 'react';
import { Nav, Dropdown, ButtonGroup, Button } from 'react-bootstrap';

const Channel = ({ channel, isActive, onClick, onRemoveClick, onRenameClick }) => {
  return (
    <Nav.Item as="li" className="w-100">
      {channel.removable ? (
        <Dropdown as={ButtonGroup} className="w-100">
          <Button 
            variant={isActive ? 'secondary' : 'light'}
            onClick={onClick}
            className="text-start text-truncate"
          >
            <span className="me-1">#</span>
            {channel.name}
          </Button>
          <Dropdown.Toggle split variant={isActive ? 'secondary' : 'light'} id={`dropdown-${channel.id}`} />
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => onRemoveClick(channel)}>
              Удалить
            </Dropdown.Item>
            <Dropdown.Item onClick={() => onRenameClick(channel)}>
              Переименовать
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <Button
          variant={isActive ? 'secondary' : 'light'}
          onClick={onClick}
          className="w-100 rounded-0 text-start text-truncate"
        >
          <span className="me-1">#</span>
          {channel.name}
        </Button>
      )}
    </Nav.Item>
  );
};

export default Channel;
