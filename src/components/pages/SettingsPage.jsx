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

const SettingsPage = () => {
  return (
    <Layout>
      <PageContainer className="container">
        <PageHeader>
          <PageTitle>设置</PageTitle>
          <PageDescription>
            自定义您的账户设置、系统偏好和隐私选项
          </PageDescription>
        </PageHeader>
        
        <ComingSoonContainer>
          <ComingSoonIcon>
            <i className="fas fa-cog"></i>
          </ComingSoonIcon>
          <ComingSoonText>设置功能即将上线</ComingSoonText>
          <ComingSoonDescription>
            我们正在开发设置功能，将允许您自定义系统参数、个性化偏好和隐私选项，
            确保系统根据您的需求提供最佳体验。敬请期待，我们将很快推出这一实用功能！
          </ComingSoonDescription>
        </ComingSoonContainer>
      </PageContainer>
    </Layout>
  );
};

export default SettingsPage;
