import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Layout from '../layout/Layout';
import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { POSE_CONNECTIONS } from '@mediapipe/pose';
import { analyzePullup } from './sport/PullupAnalyzer';
import SpeechService from '../../services/SpeechService';

// Styled components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const PageHeader = styled.div`
  margin-bottom: 30px;
  text-align: center;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #333;
`;

const PageDescription = styled.p`
  font-size: 1.1rem;
  color: #666;
  max-width: 800px;
  margin: 0 auto;
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr 300px;
  gap: 20px;
  margin-bottom: 30px;
  
  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const ExerciseSelectorPanel = styled.div`
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const PanelTitle = styled.h2`
  font-size: 1.2rem;
  padding: 15px;
  background: #f5f5f5;
  margin: 0;
  border-bottom: 1px solid #eee;
  
  i {
    margin-right: 10px;
    color: #4a90e2;
  }
`;

const CategoryTabs = styled.div`
  display: flex;
  border-bottom: 1px solid #eee;
`;

const CategoryTab = styled.button`
  flex: 1;
  padding: 12px;
  background: ${props => props.active ? '#4a90e2' : 'transparent'};
  color: ${props => props.active ? '#fff' : '#333'};
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  
  &:hover {
    background: ${props => props.active ? '#4a90e2' : '#f0f0f0'};
  }
`;

const ExerciseList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const ExerciseItem = styled.div`
  display: flex;
  padding: 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  background: ${props => props.selected ? '#f0f7ff' : 'transparent'};
  transition: all 0.2s;
  
  &:hover {
    background: #f5f5f5;
  }
`;

const ExerciseImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  margin-right: 15px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ExerciseInfo = styled.div`
  flex: 1;
`;

const ExerciseName = styled.h3`
  margin: 0 0 8px 0;
  font-size: 1.1rem;
`;

const ExerciseMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #666;
`;

const DifficultyBadge = styled.span`
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  background: ${props => 
    props.level === 'easy' ? '#e6f7e6' : 
    props.level === 'medium' ? '#fff4e0' : '#ffe6e6'};
  color: ${props => 
    props.level === 'easy' ? '#2e7d32' : 
    props.level === 'medium' ? '#ed6c02' : '#d32f2f'};
`;

const VideoDisplayArea = styled.div`
  position: relative;
  background: #000;
  border-radius: 10px;
  overflow: hidden;
  aspect-ratio: 16 / 9;
`;

const VideoElement = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CanvasElement = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const VideoOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
  color: white;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #ff6b6b;
  
  h3 {
    margin-bottom: 10px;
  }
`;

const VideoPlaceholder = styled.div`
  text-align: center;
  padding: 20px;
  
  i {
    font-size: 3rem;
    margin-bottom: 15px;
    color: #4a90e2;
  }
  
  h3 {
    margin-bottom: 10px;
  }
  
  p {
    color: #ccc;
    max-width: 300px;
  }
`;

const VideoControls = styled.div`
  position: absolute;
  bottom: 20px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 15px;
`;

const ControlButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: ${props => props.primary ? '#4a90e2' : 'rgba(255, 255, 255, 0.2)'};
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.primary ? '#3a7bc8' : 'rgba(255, 255, 255, 0.3)'};
    transform: scale(1.05);
  }
`;

const CameraSettings = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
`;

const SettingsButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;

const DebugPanel = styled.pre`
  position: absolute;
  bottom: 80px;
  left: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: #00ff00;
  padding: 10px;
  border-radius: 5px;
  font-family: monospace;
  font-size: 0.8rem;
  max-width: 80%;
  max-height: 150px;
  overflow-y: auto;
  display: ${props => props.visible ? 'block' : 'none'};
`;

const FeedbackPanel = styled.div`
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 15px;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const TrainingPage = () => {
  // 状态管理
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [poseDetected, setPoseDetected] = useState(false);
  const [poseScore, setPoseScore] = useState(0);
  const [repCount, setRepCount] = useState(0);
  const [poseFeedback, setPoseFeedback] = useState([]);
  const [debugInfo, setDebugInfo] = useState('');
  const [showDebug, setShowDebug] = useState(true); // 调试模式开关
  const [speechEnabled, setSpeechEnabled] = useState(true); // 语音指导开关
  
  // 引用
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const poseRef = useRef(null);
  const cameraRef = useRef(null);
  const contextRef = useRef(null);
  const animationRef = useRef(null);
  const lastPoseRef = useRef(null);
  
  // 添加调试日志函数
  const addDebugLog = (message) => {
    console.log(message);
    if (showDebug) {
      setDebugInfo(prev => {
        const newLog = `${new Date().toLocaleTimeString()}: ${message}`;
        return `${newLog}\n${prev}`.split('\n').slice(0, 10).join('\n');
      });
    }
  };
  
  // 模拟数据
  const categories = [
    { id: 'all', name: '全部' },
    { id: 'upper', name: '上肢' },
    { id: 'lower', name: '下肢' },
    { id: 'core', name: '核心' },
    { id: 'cardio', name: '有氧' }
  ];
  
  const exercises = [
    { 
      id: 1, 
      name: '标准深蹲', 
      category: 'lower', 
      difficulty: 'medium', 
      target: '大腿',
      image: 'squat.jpg' 
    },
    { 
      id: 2, 
      name: '俯卧撑', 
      category: 'upper', 
      difficulty: 'medium', 
      target: '胸部',
      image: 'pushup.jpg' 
    },
    { 
      id: 3, 
      name: '平板支撑', 
      category: 'core', 
      difficulty: 'easy', 
      target: '核心',
      image: 'plank.jpg' 
    },
    { 
      id: 4, 
      name: '弓步蹲', 
      category: 'lower', 
      difficulty: 'medium', 
      target: '大腿',
      image: 'lunge.jpg' 
    },
    { 
      id: 5, 
      name: '仰卧起坐', 
      category: 'core', 
      difficulty: 'easy', 
      target: '腹部',
      image: 'situp.jpg' 
    },
    { 
      id: 6, 
      name: '引体向上', 
      category: 'upper', 
      difficulty: 'hard', 
      target: '背部',
      image: 'pullup.jpg' 
    }
  ];
  
  // 过滤显示的动作
  const filteredExercises = selectedCategory === 'all' 
    ? exercises 
    : exercises.filter(ex => ex.category === selectedCategory);
  
  // 初始化摄像头
  const initCamera = () => {
    addDebugLog('正在初始化摄像头...');
    
    // 初始化MediaPipe Pose模型
    if (!poseRef.current) {
      poseRef.current = new Pose({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
        }
      });
      
      poseRef.current.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });
      
      poseRef.current.onResults((results) => {
        if (!contextRef.current && canvasRef.current) {
          contextRef.current = canvasRef.current.getContext('2d');
        }
        
        if (contextRef.current && results.poseLandmarks) {
          // 清除画布
          contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          
          // 绘制姿态关键点和连接线
          drawConnectors(contextRef.current, results.poseLandmarks, POSE_CONNECTIONS, {color: '#00FF00', lineWidth: 4});
          drawLandmarks(contextRef.current, results.poseLandmarks, {color: '#FF0000', lineWidth: 2, radius: 4});
          
          // 分析姿态
          if (isTraining && results.poseLandmarks) {
            setPoseDetected(true);
            analyzePose(results.poseLandmarks);
          }
        }
      });
    }
    
    // 请求摄像头权限
    navigator.mediaDevices.getUserMedia({
      video: { width: 1280, height: 720 },
      audio: false
    })
    .then(stream => {
      addDebugLog('摄像头权限获取成功');
      
      // 保存流引用以便后续停止
      streamRef.current = stream;
      
      // 设置视频源
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      // 设置Canvas尺寸
      if (canvasRef.current) {
        canvasRef.current.width = videoRef.current.clientWidth;
        canvasRef.current.height = videoRef.current.clientHeight;
      }
      
      // 初始化Camera
      if (!cameraRef.current) {
        cameraRef.current = new Camera(videoRef.current, {
          onFrame: async () => {
            if (poseRef.current && videoRef.current) {
              await poseRef.current.send({image: videoRef.current});
            }
          }
        });
      }
      
      // 启动Camera
      cameraRef.current.start()
        .then(() => {
          addDebugLog('Camera启动成功');
          setCameraActive(true);
          setCameraError(null);
          
          // 添加语音提示
          if (speechEnabled) {
            SpeechService.speak('摄像头已启动，准备开始训练');
          }
        })
        .catch(error => {
          addDebugLog(`Camera启动失败: ${error.message}`);
          setCameraError(`摄像头启动失败: ${error.message}`);
          
          // 停止流
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
          }
        });
    })
    .catch(error => {
      addDebugLog(`摄像头权限获取失败: ${error.message}`);
      setCameraError(`无法访问摄像头: ${error.message}`);
      setCameraPermission(false);
    });
  };
  
  // 计算通用姿态评分
  const calculateGeneralPoseScore = (landmarks) => {
    // 简单实现：检查关键点可见性，计算平均可见度作为评分
    if (!landmarks || landmarks.length === 0) return 0;
    
    let visibilitySum = 0;
    landmarks.forEach(landmark => {
      visibilitySum += landmark.visibility || 0;
    });
    
    // 返回0-100的评分
    return Math.round((visibilitySum / landmarks.length) * 100);
  };
  
  // 分析深蹲动作
  const analyzeSquat = (landmarks) => {
    addDebugLog('分析深蹲动作');
    // 简单实现：检测膝盖角度和髋部位置
    // 在实际项目中，这里应该有更复杂的姿态分析逻辑
    
    // 模拟评分和反馈
    const score = Math.round(70 + Math.random() * 20);
    setPoseScore(score);
    
    if (score > 85) {
      setPoseFeedback(['姿势良好，继续保持']);
    } else if (score > 70) {
      setPoseFeedback(['膝盖应该与脚尖方向一致', '下蹲时保持背部挺直']);
    } else {
      setPoseFeedback(['膝盖不要超过脚尖', '下蹲深度不够', '注意保持平衡']);
    }
    
    // 模拟计数
    if (lastPoseRef.current && Math.random() > 0.95) {
      setRepCount(prev => prev + 1);
      if (speechEnabled) {
        SpeechService.speak(`完成第${repCount + 1}个`);
      }
    }
  };
  
  // 分析俯卧撑动作
  const analyzePushup = (landmarks) => {
    addDebugLog('分析俯卧撑动作');
    // 简单实现：检测肘部角度和身体直线
    // 在实际项目中，这里应该有更复杂的姿态分析逻辑
    
    // 模拟评分和反馈
    const score = Math.round(65 + Math.random() * 25);
    setPoseScore(score);
    
    if (score > 85) {
      setPoseFeedback(['姿势标准，继续保持']);
    } else if (score > 70) {
      setPoseFeedback(['手肘应该贴近身体', '保持身体成一条直线']);
    } else {
      setPoseFeedback(['臀部位置过高', '下降深度不够', '手肘外展过大']);
    }
    
    // 模拟计数
    if (lastPoseRef.current && Math.random() > 0.95) {
      setRepCount(prev => prev + 1);
      if (speechEnabled) {
        SpeechService.speak(`完成第${repCount + 1}个`);
      }
    }
  };
  
  // 分析平板支撑动作
  const analyzePlank = (landmarks) => {
    addDebugLog('分析平板支撑动作');
    // 简单实现：检测身体是否成一条直线
    // 在实际项目中，这里应该有更复杂的姿态分析逻辑
    
    // 模拟评分和反馈
    const score = Math.round(75 + Math.random() * 20);
    setPoseScore(score);
    
    if (score > 85) {
      setPoseFeedback(['姿势完美，继续保持']);
    } else if (score > 70) {
      setPoseFeedback(['收紧腹部肌肉', '保持肩胛骨稳定']);
    } else {
      setPoseFeedback(['臀部位置过高', '头部不要下垂', '保持身体成一条直线']);
    }
  };
  
  // 分析姿态
  const analyzePose = (landmarks) => {
    if (!selectedExercise) {
      addDebugLog('未选择动作，无法分析姿态');
      return;
    }
    
    addDebugLog(`分析姿态，选择的动作ID: ${selectedExercise}`);
    
    // 保存当前姿态用于比较
    const currentPose = [...landmarks];
    
    // 根据选择的动作进行分析
    switch(selectedExercise) {
      case 1: // 深蹲
        analyzeSquat(currentPose);
        break;
      case 2: // 俯卧撑
        analyzePushup(currentPose);
        break;
      case 3: // 平板支撑
        analyzePlank(currentPose);
        break;
      case 6: // 引体向上
        analyzePullup(currentPose, addDebugLog, setPoseScore, setPoseFeedback, setRepCount, lastPoseRef.current, speechEnabled);
        break;
      default:
        // 默认分析 - 简单的姿态评分
        const score = calculateGeneralPoseScore(currentPose);
        setPoseScore(score);
        addDebugLog(`使用通用评分: ${score}`);
    }
    
    // 更新上一帧姿态
    lastPoseRef.current = currentPose;
  };
  
  // 其他函数保持不变...
  
  return (
    <Layout>
      <PageContainer>
        <PageHeader>
          <PageTitle>实时训练</PageTitle>
          <PageDescription>
            选择一个动作，跟随AI教练进行训练，获取实时反馈和评分
          </PageDescription>
        </PageHeader>
        
        <MainContent>
          {/* 动作选择面板 */}
          <ExerciseSelectorPanel>
            <PanelTitle>
              <i className="fas fa-dumbbell"></i>
              选择训练动作
            </PanelTitle>
            
            <CategoryTabs>
              {categories.map(category => (
                <CategoryTab 
                  key={category.id}
                  active={selectedCategory === category.id}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </CategoryTab>
              ))}
            </CategoryTabs>
            
            <ExerciseList>
              {filteredExercises.map(exercise => (
                <ExerciseItem 
                  key={exercise.id}
                  selected={selectedExercise === exercise.id}
                  onClick={() => {
                    setSelectedExercise(exercise.id);
                    addDebugLog(`选择动作: ${exercise.name}, 动作ID: ${exercise.id}`);
                    setRepCount(0);
                    setPoseScore(0);
                    
                    // 添加语音提示
                    if (speechEnabled) {
                      SpeechService.speak(`已选择${exercise.name}训练，准备开始`);
                    }
                  }}
                >
                  <ExerciseImage>
                    <img src={`/images/exercises/${exercise.image}`} alt={exercise.name} />
                  </ExerciseImage>
                  <ExerciseInfo>
                    <ExerciseName>{exercise.name}</ExerciseName>
                    <ExerciseMeta>
                      <span>目标: {exercise.target}</span>
                      <DifficultyBadge level={exercise.difficulty}>
                        {exercise.difficulty === 'easy' ? '初级' : 
                         exercise.difficulty === 'medium' ? '中级' : '高级'}
                      </DifficultyBadge>
                    </ExerciseMeta>
                  </ExerciseInfo>
                </ExerciseItem>
              ))}
            </ExerciseList>
          </ExerciseSelectorPanel>
          
          {/* 视频显示区域 */}
          <VideoDisplayArea>
            <VideoElement 
              ref={videoRef}
              autoPlay
              playsInline
            />
            <CanvasElement ref={canvasRef} />
            
            {!cameraActive && (
              <VideoOverlay>
                {cameraError ? (
                  <ErrorMessage>
                    {cameraError}
                  </ErrorMessage>
                ) : (
                  <VideoPlaceholder>
                    <i className="fas fa-video"></i>
                    <h3>准备开始训练</h3>
                    <p>点击下方按钮启动摄像头，确保您的全身在画面中</p>
                  </VideoPlaceholder>
                )}
              </VideoOverlay>
            )}
            
            <VideoControls>
              <ControlButton 
                onClick={() => {
                  if (cameraActive) {
                    // 停止摄像头
                    if (streamRef.current) {
                      streamRef.current.getTracks().forEach(track => track.stop());
                    }
                    setCameraActive(false);
                    setIsTraining(false);
                    addDebugLog('摄像头已停止');
                  } else {
                    // 启动摄像头
                    initCamera();
                  }
                }}
              >
                <i className={`fas ${cameraActive ? 'fa-video-slash' : 'fa-video'}`}></i>
              </ControlButton>
              
              {cameraActive && (
                <ControlButton 
                  primary
                  onClick={() => {
                    const newTrainingState = !isTraining;
                    setIsTraining(newTrainingState);
                    addDebugLog(`${isTraining ? '暂停' : '开始'}训练`);
                    
                    // 添加语音提示
                    if (speechEnabled) {
                      if (newTrainingState) {
                        const exerciseName = exercises.find(ex => ex.id === selectedExercise)?.name || '';
                        SpeechService.speak(`开始${exerciseName}训练，请保持正确姿势`);
                      } else {
                        SpeechService.speak('训练已暂停');
                      }
                    }
                  }}
                >
                  <i className={`fas ${isTraining ? 'fa-pause' : 'fa-play'}`}></i>
                </ControlButton>
              )}
            </VideoControls>
            
            <CameraSettings>
              <SettingsButton onClick={() => setShowDebug(!showDebug)}>
                <i className="fas fa-cog"></i>
              </SettingsButton>
              <SettingsButton 
                onClick={() => {
                  setSpeechEnabled(!speechEnabled);
                  if (speechEnabled) {
                    SpeechService.disable();
                    addDebugLog('语音指导已关闭');
                  } else {
                    SpeechService.enable();
                    addDebugLog('语音指导已开启');
                    SpeechService.speak('语音指导已开启');
                  }
                }}
                style={{marginLeft: '10px'}}
              >
                <i className={`fas ${speechEnabled ? 'fa-volume-up' : 'fa-volume-mute'}`}></i>
              </SettingsButton>
            </CameraSettings>
            
<DebugPanel visible={showDebug.toString()}>
  {debugInfo}
</DebugPanel>
          </VideoDisplayArea>
          
          {/* 实时反馈面板 */}
          <FeedbackPanel>
            <PanelTitle>
              <i className="fas fa-chart-line"></i>
              实时训练反馈
            </PanelTitle>
            
            {selectedExercise ? (
              <>
                <div style={{ padding: '15px' }}>
                  <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>当前评分</h3>
                    <div style={{ 
                      height: '8px', 
                      background: '#eee', 
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{ 
                        height: '100%', 
                        width: `${poseScore}%`, 
                        background: poseScore > 80 ? '#4caf50' : poseScore > 60 ? '#ff9800' : '#f44336',
                        transition: 'width 0.3s'
                      }} />
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      marginTop: '5px',
                      fontSize: '0.9rem',
                      color: '#666'
                    }}>
                      <span>0</span>
                      <span style={{ 
                        fontWeight: 'bold',
                        color: poseScore > 80 ? '#4caf50' : poseScore > 60 ? '#ff9800' : '#f44336'
                      }}>{poseScore}</span>
                      <span>100</span>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>完成次数</h3>
                    <div style={{ 
                      fontSize: '2rem', 
                      fontWeight: 'bold',
                      color: '#4a90e2',
                      textAlign: 'center'
                    }}>
                      {repCount}
                    </div>
                  </div>
                  
                  <div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>姿势反馈</h3>
                    {poseFeedback.length > 0 ? (
                      <ul style={{ 
                        listStyle: 'none',
                        padding: '0',
                        margin: '0'
                      }}>
                        {poseFeedback.map((feedback, index) => (
                          <li key={index} style={{ 
                            padding: '8px 0',
                            borderBottom: index < poseFeedback.length - 1 ? '1px solid #eee' : 'none',
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            <i className="fas fa-check-circle" style={{ 
                              color: '#4caf50',
                              marginRight: '10px'
                            }}></i>
                            {feedback}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ color: '#666', textAlign: 'center' }}>
                        开始训练后将显示姿势反馈
                      </p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div style={{ 
                padding: '30px 15px',
                textAlign: 'center',
                color: '#666'
              }}>
                <i className="fas fa-hand-pointer" style={{ 
                  fontSize: '2rem',
                  color: '#4a90e2',
                  marginBottom: '15px',
                  display: 'block'
                }}></i>
                <p>请先从左侧选择一个训练动作</p>
              </div>
            )}
          </FeedbackPanel>
        </MainContent>
        
        {/* 训练数据统计 */}
        <StatsContainer>
          <div style={{
            background: '#fff',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            padding: '20px'
          }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>
              <i className="fas fa-fire" style={{ color: '#ff9800', marginRight: '10px' }}></i>
              卡路里消耗
            </h3>
            <div style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold',
              color: '#ff9800',
              textAlign: 'center',
              marginBottom: '10px'
            }}>
              {Math.round(repCount * 3.5)}
            </div>
            <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
              基于您的训练动作和完成次数估算
            </p>
          </div>
          
          <div style={{
            background: '#fff',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            padding: '20px'
          }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>
              <i className="fas fa-clock" style={{ color: '#4a90e2', marginRight: '10px' }}></i>
              训练时长
            </h3>
            <div style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold',
              color: '#4a90e2',
              textAlign: 'center',
              marginBottom: '10px'
            }}>
              {Math.floor(repCount / 2)}:{repCount % 2 === 0 ? '00' : '30'}
            </div>
            <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
              本次训练持续时间
            </p>
          </div>
          
          <div style={{
            background: '#fff',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            padding: '20px'
          }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>
              <i className="fas fa-chart-line" style={{ color: '#4caf50', marginRight: '10px' }}></i>
              训练进度
            </h3>
            <div style={{ 
              height: '8px', 
              background: '#eee', 
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '15px'
            }}>
              <div style={{ 
                height: '100%', 
                width: `${Math.min(repCount * 10, 100)}%`, 
                background: '#4caf50',
                transition: 'width 0.3s'
              }} />
            </div>
            <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
              {Math.min(repCount * 10, 100)}% 完成目标
            </p>
          </div>
        </StatsContainer>
      </PageContainer>
    </Layout>
  );
};

export default TrainingPage;
