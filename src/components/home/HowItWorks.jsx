import React from 'react';
import styled from 'styled-components';

const HowItWorksSection = styled.section`
  padding: 80px 0;
  background-color: var(--bg-light);
`;

const StepsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 50px;
  flex-wrap: wrap;

  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

const Step = styled.div`
  flex: 1;
  min-width: 200px;
  text-align: center;
  position: relative;
  padding: 0 15px;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeIn 0.5s ease forwards;
  animation-delay: ${props => props.index * 0.2}s;

  @keyframes fadeIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 992px) {
    margin-bottom: 40px;
    width: 100%;
  }
`;

const StepNumber = styled.div`
  width: 40px;
  height: 40px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  margin: 0 auto 15px;
`;

const StepIcon = styled.div`
  width: 100px;
  height: 100px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 2.5rem;
  color: var(--primary-color);
  box-shadow: var(--shadow);
  transition: var(--transition);

  ${Step}:hover & {
    transform: scale(1.1);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const StepTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 10px;
`;

const StepDescription = styled.p`
  color: var(--text-light);
`;

const StepConnector = styled.div`
  flex: 0 0 50px;
  height: 2px;
  background-color: var(--primary-color);
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: var(--primary-color);
    border-radius: 50%;
    top: 50%;
    transform: translateY(-50%);
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
  }

  @media (max-width: 992px) {
    width: 2px;
    height: 50px;
    margin: 0 auto;

    &::before,
    &::after {
      left: 50%;
      transform: translateX(-50%);
    }

    &::before {
      top: 0;
    }

    &::after {
      top: auto;
      bottom: 0;
    }
  }
`;

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      icon: 'fa-sign-in-alt',
      title: '注册账号',
      description: '创建您的个人账号，设置基本信息和健身目标'
    },
    {
      number: 2,
      icon: 'fa-video',
      title: '设置摄像头',
      description: '确保摄像头正常工作，并按指引调整位置'
    },
    {
      number: 3,
      icon: 'fa-list-ul',
      title: '选择训练',
      description: '从动作库中选择您想练习的动作或训练计划'
    },
    {
      number: 4,
      icon: 'fa-running',
      title: '开始训练',
      description: '跟随系统指导，获得实时反馈，完成高效训练'
    }
  ];

  return (
    <HowItWorksSection>
      <div className="container">
        <h2 className="section-title">使用流程</h2>
        <p className="section-subtitle">简单几步，开启您的AI辅助健身之旅</p>
        
        <StepsContainer>
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <Step index={index}>
                <StepNumber>{step.number}</StepNumber>
                <StepIcon>
                  <i className={`fas ${step.icon}`}></i>
                </StepIcon>
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </Step>
              
              {index < steps.length - 1 && <StepConnector />}
            </React.Fragment>
          ))}
        </StepsContainer>
      </div>
    </HowItWorksSection>
  );
};

export default HowItWorks;
