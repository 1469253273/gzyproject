import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: var(--header-height);
  background-color: var(--bg-color);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: box-shadow 0.3s ease;

  &.scrolled {
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  }
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;

  img {
    height: 40px;
    margin-right: 10px;
  }

  span {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary-color);
  }
`;

const Nav = styled.nav`
  @media (max-width: 768px) {
    position: fixed;
    top: var(--header-height);
    left: 0;
    width: 100%;
    background-color: var(--bg-color);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    transform: translateY(${props => props.isOpen ? '0' : '-100%'});
    opacity: ${props => props.isOpen ? '1' : '0'};
    visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
    transition: var(--transition);
  }
`;

const NavList = styled.ul`
  display: flex;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const NavItem = styled.li`
  margin: 0 15px;

  @media (max-width: 768px) {
    margin: 10px 0;
  }

  a {
    color: var(--text-color);
    font-weight: 600;
    padding: 10px 0;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: ${props => props.isActive ? '100%' : '0'};
      height: 2px;
      background-color: var(--primary-color);
      transition: var(--transition);
    }

    &:hover::after {
      width: 100%;
    }
  }
`;

const UserArea = styled.div`
  display: flex;
  align-items: center;
`;

const GuestArea = styled.div`
  display: flex;
  gap: 10px;
`;

const LoggedInArea = styled.div`
  position: relative;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  span {
    margin-right: 10px;
    font-weight: 600;
  }

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const UserDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  width: 250px;
  background-color: var(--bg-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 15px;
  margin-top: 10px;
  display: ${props => props.isOpen ? 'block' : 'none'};
  z-index: 1001;
`;

const RecentTraining = styled.div`
  padding: 10px;
  background-color: var(--bg-light);
  border-radius: var(--border-radius);
  margin-bottom: 10px;

  h4 {
    margin-bottom: 5px;
    font-size: 0.9rem;
  }

  p {
    margin-bottom: 10px;
    font-size: 0.85rem;
  }
`;

const DropdownList = styled.ul`
  border-top: 1px solid var(--border-color);
  padding-top: 10px;

  li {
    margin-bottom: 8px;
  }

  a {
    color: var(--text-color);
    font-size: 0.9rem;
    display: block;
    padding: 5px 0;

    &:hover {
      color: var(--primary-color);
    }

    &.logout {
      color: var(--error-color);
    }
  }
`;

const MobileMenuToggle = styled.button`
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 21px;
  background: transparent;
  border: none;
  cursor: pointer;

  span {
    display: block;
    height: 3px;
    width: 100%;
    background-color: var(--text-color);
    border-radius: 3px;
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const Button = styled.button`
  padding: ${props => props.small ? '0.5rem 1rem' : '0.75rem 1.5rem'};
  border-radius: var(--border-radius);
  font-weight: 600;
  text-align: center;
  transition: var(--transition);
  cursor: pointer;
  background-color: ${props => props.primary ? 'var(--primary-color)' : props.secondary ? 'var(--secondary-color)' : 'transparent'};
  color: ${props => (props.primary || props.secondary) ? 'white' : 'var(--primary-color)'};
  border: ${props => (!props.primary && !props.secondary) ? '2px solid var(--primary-color)' : 'none'};

  &:hover {
    background-color: ${props => props.primary ? 'var(--primary-dark)' : props.secondary ? '#3ab7dc' : 'var(--primary-color)'};
    color: ${props => (!props.primary && !props.secondary) ? 'white' : 'white'};
  }
`;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // 检查登录状态
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);

    // 监听滚动事件
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = (e) => {
    e.preventDefault();
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    setIsDropdownOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <HeaderContainer className={isScrolled ? 'scrolled' : ''}>
      <div className="container">
        <HeaderContent>
          <Logo>
            <img src="/src/assets/images/logo.svg" alt="AI健身教练" />
            <span>AI健身教练</span>
          </Logo>

          <Nav isOpen={isMenuOpen}>
            <NavList>
              <NavItem isActive={location.pathname === '/'}>
                <Link to="/">首页</Link>
              </NavItem>
              <NavItem isActive={location.pathname === '/training'}>
                <Link to="/training">训练</Link>
              </NavItem>
              <NavItem isActive={location.pathname === '/exercise-library'}>
                <Link to="/exercise-library">动作库</Link>
              </NavItem>
              <NavItem isActive={location.pathname === '/profile'}>
                <Link to="/profile">个人中心</Link>
              </NavItem>
              <NavItem isActive={location.pathname === '/settings'}>
                <Link to="/settings">设置</Link>
              </NavItem>
            </NavList>
          </Nav>

          <UserArea>
            {!isLoggedIn ? (
              <GuestArea>
                <Button secondary onClick={() => alert('注册功能即将上线，敬请期待！')}>注册</Button>
                <Button primary onClick={handleLogin}>登录</Button>
              </GuestArea>
            ) : (
              <LoggedInArea>
                <UserInfo onClick={toggleDropdown}>
                  <span className="user-name">张三</span>
                  <img src="/src/assets/images/avatar.jpg" alt="用户头像" />
                </UserInfo>
                <UserDropdown isOpen={isDropdownOpen}>
                  <RecentTraining>
                    <h4>最近训练</h4>
                    <p>深蹲训练 - 昨天</p>
                    <Button small>继续训练</Button>
                  </RecentTraining>
                  <DropdownList>
                    <li><Link to="/profile">个人中心</Link></li>
                    <li><Link to="/settings">设置</Link></li>
                    <li><a href="#" className="logout" onClick={handleLogout}>退出登录</a></li>
                  </DropdownList>
                </UserDropdown>
              </LoggedInArea>
            )}
            <MobileMenuToggle onClick={toggleMenu}>
              <span></span>
              <span></span>
              <span></span>
            </MobileMenuToggle>
          </UserArea>
        </HeaderContent>
      </div>
    </HeaderContainer>
  );
};

export default Header;
