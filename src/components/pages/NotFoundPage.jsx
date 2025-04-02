import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Layout from '../layout/Layout';

const NotFoundContainer = styled.div`
  text-align: center;
  padding: 100px 20px;
  max-width: 600px;
  margin: 0 auto;
`;

const NotFoundTitle = styled.h1`
  font-size: 8rem;
  color: var(--primary-color);
  margin-bottom: 20px;
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 6rem;
  }
`;

const NotFoundSubtitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 20px;
  color: var(--text-color);

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const NotFoundText = styled.p`
  font-size: 1.1rem;
  color: var(--text-light);
  margin-bottom: 30px;
`;

const HomeButton = styled(Link)`
  display: inline-block;
  padding: 1rem 2rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: var(--border-radius);
  font-weight: 600;
  transition: var(--transition);

  &:hover {
    background-color: var(--primary-dark);
    transform: translateY(-3px);
  }
`;

const NotFoundPage = () => {
  return (
    <Layout>
      <NotFoundContainer>
        <NotFoundTitle>404</NotFoundTitle>
        <NotFoundSubtitle>页面未找到</NotFoundSubtitle>
        <NotFoundText>
          抱歉，您访问的页面不存在或已被移除。请检查URL是否正确，或返回首页继续浏览。
        </NotFoundText>
        <HomeButton to="/">返回首页</HomeButton>
      </NotFoundContainer>
    </Layout>
  );
};

export default NotFoundPage;
