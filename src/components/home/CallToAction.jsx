import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const CTASection = styled.section`
  padding: 80px 0;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
  text-align: center;
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const CTADescription = styled.p`
  font-size: 1.2rem;
  margin-bottom: 30px;
  opacity: 0.9;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

const CTAButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const CTAButton = styled(Link)`
  display: inline-block;
  padding: 1rem 2rem;
  border-radius: var(--border-radius);
  font-weight: 600;
  text-align: center;
  transition: var(--transition);
  background-color: ${props => props.primary ? 'white' : 'transparent'};
  color: ${props => props.primary ? 'var(--primary-color)' : 'white'};
  border: ${props => props.primary ? 'none' : '2px solid white'};

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    background-color: ${props => props.primary ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const CallToAction = () => {
  return (
    <CTASection>
      <div className="container">
        <CTATitle>准备好开始您的智能健身之旅了吗？</CTATitle>
        <CTADescription>立即注册，免费体验7天AI辅助训练</CTADescription>
        <CTAButtons>
          <CTAButton to="/register" primary>免费注册</CTAButton>
          <CTAButton to="/pricing">了解会员方案</CTAButton>
        </CTAButtons>
      </div>
    </CTASection>
  );
};

export default CallToAction;
