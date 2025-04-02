import React, { useState } from 'react';
import styled from 'styled-components';

const AnnouncementContainer = styled.div`
  background-color: var(--secondary-color);
  color: white;
  padding: 10px 0;
  display: ${props => props.isVisible ? 'block' : 'none'};
`;

const AnnouncementContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AnnouncementText = styled.p`
  display: flex;
  align-items: center;

  i {
    margin-right: 10px;
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    transform: scale(1.1);
  }
`;

const Announcement = ({ message }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <AnnouncementContainer isVisible={isVisible}>
      <div className="container">
        <AnnouncementContent>
          <AnnouncementText>
            <i className="fas fa-bullhorn"></i> {message || '系统更新：新增10种健身动作识别，提升识别准确率！'}
          </AnnouncementText>
          <CloseButton onClick={handleClose}>
            <i className="fas fa-times"></i>
          </CloseButton>
        </AnnouncementContent>
      </div>
    </AnnouncementContainer>
  );
};

export default Announcement;
