import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const TestimonialsSection = styled.section`
  padding: 80px 0;
  background-color: var(--bg-light);
`;

const TestimonialsSlider = styled.div`
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
`;

const TestimonialCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  padding: 30px;
  box-shadow: var(--shadow);
  margin: 20px;
  display: ${props => props.active ? 'block' : 'none'};
  animation: ${props => props.active ? 'fadeIn 0.5s ease' : 'none'};

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const TestimonialContent = styled.div`
  margin-bottom: 20px;

  p {
    font-style: italic;
    font-size: 1.1rem;
    line-height: 1.7;
    position: relative;

    &::before,
    &::after {
      content: '"';
      font-size: 1.5rem;
      color: var(--primary-color);
    }
  }
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;

  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 15px;
  }

  h4 {
    font-size: 1.1rem;
    margin-bottom: 5px;
  }

  p {
    color: var(--text-light);
    font-size: 0.9rem;
  }
`;

const TestimonialDots = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
`;

const Dot = styled.span`
  width: 12px;
  height: 12px;
  background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--border-color)'};
  border-radius: 50%;
  margin: 0 5px;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--primary-color)'};
    opacity: ${props => props.active ? '1' : '0.7'};
  }
`;

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const testimonials = [
    {
      content: '这个系统彻底改变了我的居家健身体验！AI反馈非常精准，就像有私教在身边一样。',
      author: '李明',
      duration: '使用3个月',
      image: '/src/assets/images/user1.jpg'
    },
    {
      content: '作为健身新手，这个系统帮我纠正了很多错误姿势，避免了受伤风险，非常推荐！',
      author: '王芳',
      duration: '使用1个月',
      image: '/src/assets/images/user2.jpg'
    },
    {
      content: '数据分析功能很棒，让我清楚看到自己的进步，持续保持动力。界面设计也很友好。',
      author: '张伟',
      duration: '使用6个月',
      image: '/src/assets/images/user3.jpg'
    }
  ];

  // 自动轮播
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prevIndex => (prevIndex + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <TestimonialsSection>
      <div className="container">
        <h2 className="section-title">用户评价</h2>
        <p className="section-subtitle">听听其他用户怎么说</p>
        
        <TestimonialsSlider>
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} active={index === activeIndex}>
              <TestimonialContent>
                <p>{testimonial.content}</p>
              </TestimonialContent>
              <TestimonialAuthor>
                <img src={testimonial.image} alt={`${testimonial.author}的头像`} />
                <div>
                  <h4>{testimonial.author}</h4>
                  <p>{testimonial.duration}</p>
                </div>
              </TestimonialAuthor>
            </TestimonialCard>
          ))}
        </TestimonialsSlider>
        
        <TestimonialDots>
          {testimonials.map((_, index) => (
            <Dot 
              key={index} 
              active={index === activeIndex}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </TestimonialDots>
      </div>
    </TestimonialsSection>
  );
};

export default Testimonials;
