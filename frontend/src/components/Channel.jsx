import React from 'react';
import { Nav, Dropdown, ButtonGroup, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Channel = ({ channel, isActive, onClick, onRemoveClick, onRenameClick }) => {
  const { t } = useTranslation();
  return (
    <Nav.Item as="li" className="w-100">
      {channel.removable ? (
        <Dropdown as={ButtonGroup} className="w-100">
          <Button 
            variant={isActive ? 'secondary' : 'light'}
            onClick={onClick}
            className="text-start text-truncate"
          >
            <span className="me-1">{t('channel.prefix')}</span>
            {channel.name}
          </Button>
          <Dropdown.Toggle split variant={isActive ? 'secondary' : 'light'} id={`dropdown-${channel.id}`} />
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => onRemoveClick(channel)}>
              {t('channel.delete')}
            </Dropdown.Item>
            <Dropdown.Item onClick={() => onRenameClick(channel)}>
              {t('channel.rename')}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <Button
          variant={isActive ? 'secondary' : 'light'}
          onClick={onClick}
          className="w-100 rounded-0 text-start text-truncate"
        >
          <span className="me-1">{t('channel.prefix')}</span>
          {channel.name}
        </Button>
      )}
    </Nav.Item>
  );
};

export default Channel;
