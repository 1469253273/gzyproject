import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const HeroSection = styled.section`
  padding: 80px 0 0;
  position: relative;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
  overflow: hidden;
`;

const HeroContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 2;

  @media (max-width: 992px) {
    flex-direction: column;
    text-align: center;
  }
`;

const HeroContent = styled.div`
  flex: 1;
  max-width: 600px;

  @media (max-width: 992px) {
    margin-bottom: 40px;
  }
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 20px;

  @media (max-width: 1200px) {
    font-size: 3rem;
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 576px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 30px;
  opacity: 0.9;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;

  @media (max-width: 992px) {
    justify-content: center;
  }

  @media (max-width: 576px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const Button = styled(Link)`
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
    background-color: ${props => props.primary ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.1)'};
    color: ${props => props.primary ? 'var(--primary-dark)' : 'white'};
    transform: translateY(-3px);
  }
`;

const HeroVideo = styled.div`
  flex: 1;
  max-width: 500px;
  position: relative;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow);

  video {
    width: 100%;
    display: block;
  }
`;

const VideoOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  opacity: ${props => props.isPlaying ? 0 : 1};
`;

const PlayButton = styled.button`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  color: white;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

const HeroWave = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  line-height: 0;
`;

const Hero = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handlePlayClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <HeroSection>
      <div className="container">
        <HeroContainer>
          <HeroContent>
            <HeroTitle>AI驱动的实时健身训练分析</HeroTitle>
            <HeroSubtitle>你的私人AI健身教练，随时随地提供专业指导</HeroSubtitle>
            <ButtonGroup>
              <Button to="/training" primary>开始训练</Button>
              <Button to="/exercise-library">了解更多</Button>
            </ButtonGroup>
          </HeroContent>
          
          <HeroVideo>
            <video 
              ref={videoRef}
              poster="/src/assets/images/video-poster.jpg"
              onEnded={() => setIsPlaying(false)}
              muted
              loop
            >
              <source src="/src/assets/videos/demo.mp4" type="video/mp4" />
              您的浏览器不支持视频播放
            </video>
            <VideoOverlay isPlaying={isPlaying}>
              <PlayButton onClick={handlePlayClick}>
                <i className="fas fa-play"></i>
              </PlayButton>
            </VideoOverlay>
          </HeroVideo>
        </HeroContainer>
      </div>
      
      <HeroWave>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path 
            fill="#ffffff" 
            fillOpacity="1" 
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </HeroWave>
    </HeroSection>
  );
};

export default Hero;
