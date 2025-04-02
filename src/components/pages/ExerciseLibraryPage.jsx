import React from 'react';
import styled from 'styled-components';
import Layout from '../layout/Layout';

const PageContainer = styled.div`
  padding: 50px 0;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 50px;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: var(--text-color);
  margin-bottom: 15px;
`;

const PageDescription = styled.p`
  font-size: 1.1rem;
  color: var(--text-light);
  max-width: 700px;
  margin: 0 auto;
`;

const ComingSoonContainer = styled.div`
  text-align: center;
  padding: 100px 20px;
  background-color: var(--bg-light);
  border-radius: var(--border-radius);
  max-width: 800px;
  margin: 0 auto;
`;

const ComingSoonIcon = styled.div`
  font-size: 5rem;
  color: var(--primary-color);
  margin-bottom: 20px;
`;

const ComingSoonText = styled.h2`
  font-size: 2rem;
  margin-bottom: 20px;
`;

const ComingSoonDescription = styled.p`
  font-size: 1.1rem;
  color: var(--text-light);
  margin-bottom: 30px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const ExerciseLibraryPage = () => {
  return (
    <Layout>
      <PageContainer className="container">
        <PageHeader>
          <PageTitle>动作库</PageTitle>
          <PageDescription>
            探索丰富的健身动作库，学习标准动作要领，找到适合您的训练动作
          </PageDescription>
        </PageHeader>
        
        <ComingSoonContainer>
          <ComingSoonIcon>
            <i className="fas fa-book-open"></i>
          </ComingSoonIcon>
          <ComingSoonText>动作库功能即将上线</ComingSoonText>
          <ComingSoonDescription>
            我们正在整理和完善动作库，将收录100+种专业健身动作，包括详细的动作说明、
            示范视频和训练建议。敬请期待，我们将很快推出这一实用功能！
          </ComingSoonDescription>
        </ComingSoonContainer>
      </PageContainer>
    </Layout>
  );
};

export default ExerciseLibraryPage;
