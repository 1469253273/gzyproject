import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Layout from '../layout/Layout';
import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { POSE_CONNECTIONS } from '@mediapipe/pose';
import { analyzePullup } from './sport/PullupAnalyzer';
import SpeechService from '../../services/SpeechService';

// Styled components (unchanged)
// ...

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
    // ... (unchanged)
    
    // 请求摄像头权限
    navigator.mediaDevices.getUserMedia({
      video: { width: 1280, height: 720 },
      audio: false
    })
    .then(stream => {
      // ... (unchanged)
      
      // 启动Camera
      camera.start()
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
          // ... (unchanged)
        });
    })
    .catch(error => {
      // ... (unchanged)
    });
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
            
            <DebugPanel visible={showDebug}>
              {debugInfo}
            </DebugPanel>
          </VideoDisplayArea>
          
          {/* 实时反馈面板 */}
          <FeedbackPanel>
            {/* ... (unchanged) */}
          </FeedbackPanel>
        </MainContent>
        
        {/* 训练数据统计 */}
        <StatsContainer>
          {/* ... (unchanged) */}
        </StatsContainer>
      </PageContainer>
    </Layout>
  );
};

export default TrainingPage;
