import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  padding: 80px 0 30px;
  background-color: var(--bg-dark);
  color: white;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  margin-bottom: 50px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FooterAbout = styled.div`
  grid-column: span 2;

  @media (max-width: 768px) {
    grid-column: 1;
  }
`;

const FooterLogo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  img {
    height: 40px;
    margin-right: 10px;
  }

  span {
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
  }
`;

const AboutText = styled.p`
  margin-bottom: 20px;
  opacity: 0.8;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
`;

const SocialLink = styled.a`
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  transition: var(--transition);

  &:hover {
    background-color: var(--primary-color);
    transform: translateY(-5px);
  }
`;

const FooterLinksSection = styled.div`
  h3 {
    font-size: 1.2rem;
    margin-bottom: 20px;
    position: relative;
    padding-bottom: 10px;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 50px;
      height: 2px;
      background-color: var(--primary-color);
    }
  }

  ul li {
    margin-bottom: 10px;
  }

  a {
    color: rgba(255, 255, 255, 0.8);
    transition: var(--transition);

    &:hover {
      color: white;
      padding-left: 5px;
    }
  }
`;

const NewsletterSection = styled.div`
  p {
    margin-bottom: 20px;
    opacity: 0.8;
  }
`;

const NewsletterForm = styled.form`
  display: flex;

  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const NewsletterInput = styled.input`
  flex: 1;
  padding: 10px 15px;
  border: none;
  border-radius: var(--border-radius) 0 0 var(--border-radius);
  font-family: inherit;

  @media (max-width: 576px) {
    border-radius: var(--border-radius);
    margin-bottom: 10px;
  }
`;

const NewsletterButton = styled.button`
  border-radius: 0 var(--border-radius) var(--border-radius) 0;
  padding: 0 20px;
  background-color: var(--primary-color);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background-color: var(--primary-dark);
  }

  @media (max-width: 576px) {
    border-radius: var(--border-radius);
    width: 100%;
    padding: 10px;
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 30px;
  text-align: center;
  opacity: 0.7;
  font-size: 0.9rem;

  p {
    margin-bottom: 10px;
  }

  a {
    color: white;
  }
`;

const Footer = () => {
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const email = e.target.elements.email.value;
    if (email) {
      alert(`感谢订阅！我们将定期发送最新资讯到您的邮箱：${email}`);
      e.target.reset();
    } else {
      alert('请输入有效的邮箱地址');
    }
  };

  return (
    <FooterContainer>
      <div className="container">
        <FooterGrid>
          <FooterAbout>
            <FooterLogo>
              <img src="/src/assets/images/logo.svg" alt="AI健身教练" />
              <span>AI健身教练</span>
            </FooterLogo>
            <AboutText>
              基于AI技术的实时健身训练分析系统，为您提供专业、高效的居家健身解决方案。
            </AboutText>
            <SocialLinks>
              <SocialLink href="#"><i className="fab fa-weixin"></i></SocialLink>
              <SocialLink href="#"><i className="fab fa-weibo"></i></SocialLink>
              <SocialLink href="#"><i className="fab fa-qq"></i></SocialLink>
              <SocialLink href="#"><i className="fab fa-bilibili"></i></SocialLink>
            </SocialLinks>
          </FooterAbout>

          <FooterLinksSection>
            <h3>快速链接</h3>
            <ul>
              <li><Link to="/">首页</Link></li>
              <li><Link to="/training">训练</Link></li>
              <li><Link to="/exercise-library">动作库</Link></li>
              <li><Link to="/profile">个人中心</Link></li>
              <li><Link to="/settings">设置</Link></li>
            </ul>
          </FooterLinksSection>

          <FooterLinksSection>
            <h3>支持</h3>
            <ul>
              <li><Link to="/faq">常见问题</Link></li>
              <li><Link to="/contact">联系我们</Link></li>
              <li><Link to="/feedback">反馈建议</Link></li>
              <li><Link to="/help">帮助中心</Link></li>
              <li><Link to="/blog">健身博客</Link></li>
            </ul>
          </FooterLinksSection>

          <FooterLinksSection>
            <h3>法律</h3>
            <ul>
              <li><Link to="/terms">服务条款</Link></li>
              <li><Link to="/privacy">隐私政策</Link></li>
              <li><Link to="/cookies">Cookie政策</Link></li>
              <li><Link to="/copyright">版权声明</Link></li>
            </ul>
          </FooterLinksSection>

          <NewsletterSection>
            <h3>订阅更新</h3>
            <p>订阅我们的通讯，获取最新功能和健身知识</p>
            <NewsletterForm onSubmit={handleNewsletterSubmit}>
              <NewsletterInput 
                type="email" 
                name="email"
                placeholder="您的邮箱地址" 
              />
              <NewsletterButton type="submit">订阅</NewsletterButton>
            </NewsletterForm>
          </NewsletterSection>
        </FooterGrid>

        <FooterBottom>
          <p>&copy; 2025 AI健身教练. 保留所有权利.</p>
          <p>技术支持: <a href="#">健康科技有限公司</a></p>
        </FooterBottom>
      </div>
    </FooterContainer>
  );
};

export default Footer;
