import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const QuickAccessSection = styled.section`
  padding: 80px 0;
  background-color: var(--bg-color);
`;

const QuickAccessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 50px;
`;

const QuickCard = styled(Link)`
  background-color: white;
  border-radius: var(--border-radius);
  padding: 30px;
  box-shadow: var(--shadow);
  text-align: center;
  transition: var(--transition);
  display: block;
  color: var(--text-color);
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
    color: var(--text-color);
  }
`;

const QuickCardIcon = styled.div`
  width: 70px;
  height: 70px;
  background-color: var(--bg-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 1.8rem;
  color: var(--primary-color);
  transition: var(--transition);

  ${QuickCard}:hover & {
    background-color: var(--primary-color);
    color: white;
  }
`;

const QuickCardTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 10px;
`;

const QuickCardDescription = styled.p`
  color: var(--text-light);
`;

const QuickAccess = () => {
  const quickLinks = [
    {
      icon: 'fa-play-circle',
      title: '开始训练',
      description: '立即开始一次AI辅助训练',
      link: '/training'
    },
    {
      icon: 'fa-book-open',
      title: '浏览动作库',
      description: '探索100+种专业健身动作',
      link: '/exercise-library'
    },
    {
      icon: 'fa-calendar-alt',
      title: '训练计划',
      description: '获取个性化训练计划推荐',
      link: '/training?mode=plan'
    },
    {
      icon: 'fa-eye',
      title: '功能演示',
      description: '观看系统功能演示视频',
      link: '/demo'
    }
  ];

  return (
    <QuickAccessSection>
      <div className="container">
        <h2 className="section-title">快速开始</h2>
        <p className="section-subtitle">选择您感兴趣的功能，立即开始体验</p>
        
        <QuickAccessGrid>
          {quickLinks.map((link, index) => (
            <QuickCard to={link.link} key={index} index={index}>
              <QuickCardIcon>
                <i className={`fas ${link.icon}`}></i>
              </QuickCardIcon>
              <QuickCardTitle>{link.title}</QuickCardTitle>
              <QuickCardDescription>{link.description}</QuickCardDescription>
            </QuickCard>
          ))}
        </QuickAccessGrid>
      </div>
    </QuickAccessSection>
  );
};

export default QuickAccess;
