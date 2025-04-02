import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const FeaturesSection = styled.section`
  padding: 80px 0;
  background-color: var(--bg-color);
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 50px;
`;

const FeatureCard = styled.div`
  background-color: var(--bg-light);
  border-radius: var(--border-radius);
  padding: 30px;
  box-shadow: var(--shadow);
  transition: var(--transition);
  text-align: center;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeIn 0.5s ease forwards;
  animation-delay: ${props => props.index * 0.1}s;

  @keyframes fadeIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 2rem;
  transition: var(--transition);

  ${FeatureCard}:hover & {
    transform: scale(1.1);
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: var(--text-color);
`;

const FeatureDescription = styled.p`
  color: var(--text-light);
  margin-bottom: 20px;
`;

const FeatureLink = styled(Link)`
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  color: var(--primary-color);
  transition: var(--transition);

  i {
    margin-left: 5px;
    transition: var(--transition);
  }

  &:hover {
    color: var(--primary-dark);

    i {
      transform: translateX(5px);
    }
  }
`;

const Features = () => {
  const features = [
    {
      icon: 'fa-camera',
      title: '实时姿态分析',
      description: '通过摄像头实时捕捉您的健身动作，AI算法精准分析姿势，确保训练效果最大化。',
      link: '/training',
      linkText: '立即体验'
    },
    {
      icon: 'fa-comments',
      title: '智能反馈指导',
      description: '提供实时语音和视觉反馈，指出动作问题并给出改进建议，就像私人教练在身边。',
      link: '/training',
      linkText: '立即体验'
    },
    {
      icon: 'fa-dumbbell',
      title: '丰富动作库',
      description: '包含100+种专业健身动作，覆盖全身各部位训练，满足不同健身需求和目标。',
      link: '/exercise-library',
      linkText: '浏览动作库'
    },
    {
      icon: 'fa-chart-line',
      title: '训练数据分析',
      description: '记录并分析您的训练数据，追踪进步，提供个性化建议，帮助您持续进步。',
      link: '/profile',
      linkText: '查看示例'
    }
  ];

  return (
    <FeaturesSection>
      <div className="container">
        <h2 className="section-title">核心功能</h2>
        <p className="section-subtitle">基于AI技术，为您提供专业的健身训练分析和指导</p>
        
        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard key={index} index={index}>
              <FeatureIcon>
                <i className={`fas ${feature.icon}`}></i>
              </FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
              <FeatureLink to={feature.link}>
                {feature.linkText} <i className="fas fa-arrow-right"></i>
              </FeatureLink>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </div>
    </FeaturesSection>
  );
};

export default Features;
