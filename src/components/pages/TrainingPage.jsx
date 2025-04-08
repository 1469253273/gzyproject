import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Layout from '../layout/Layout';
import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { POSE_CONNECTIONS } from '@mediapipe/pose';

// 页面容器
const PageContainer = styled.div`
  padding: 30px 0;
  max-width: 1400px;
  margin: 0 auto;
`;

// 页面头部
const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
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

// 主要内容区域
const MainContent = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr 300px;
  gap: 20px;
  margin-bottom: 30px;
  
  @media (max-width: 1200px) {
    grid-template-columns: 250px 1fr 250px;
  }
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
  }
`;

// 动作选择面板
const ExerciseSelectorPanel = styled.div`
  background-color: var(--bg-light);
  border-radius: var(--border-radius);
  padding: 20px;
  height: 600px;
  overflow-y: auto;
  
  @media (max-width: 992px) {
    height: auto;
    max-height: 300px;
  }
`;

const PanelTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  
  i {
    margin-right: 10px;
    color: var(--primary-color);
  }
`;

const CategoryTabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const CategoryTab = styled.button`
  padding: 8px 15px;
  background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--bg-medium)'};
  color: ${props => props.active ? 'white' : 'var(--text-color)'};
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--primary-light)'};
  }
`;

const ExerciseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ExerciseItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: var(--border-radius);
  background-color: ${props => props.selected ? 'var(--primary-light)' : 'white'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.selected ? 'var(--primary-light)' : 'var(--bg-hover)'};
  }
`;

const ExerciseImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background-color: var(--bg-medium);
  margin-right: 15px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ExerciseInfo = styled.div`
  flex: 1;
`;

const ExerciseName = styled.h4`
  font-size: 1rem;
  margin-bottom: 5px;
`;

const ExerciseMeta = styled.div`
  display: flex;
  gap: 10px;
  font-size: 0.8rem;
  color: var(--text-light);
`;

const DifficultyBadge = styled.span`
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 0.75rem;
  background-color: ${props => {
    if (props.level === 'easy') return 'var(--success-light)';
    if (props.level === 'medium') return 'var(--warning-light)';
    return 'var(--danger-light)';
  }};
  color: ${props => {
    if (props.level === 'easy') return 'var(--success-dark)';
    if (props.level === 'medium') return 'var(--warning-dark)';
    return 'var(--danger-dark)';
  }};
`;

// 视频显示区域
const VideoDisplayArea = styled.div`
  position: relative;
  background-color: var(--bg-dark);
  border-radius: var(--border-radius);
  overflow: hidden;
  aspect-ratio: 16/9;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 992px) {
    height: 400px;
  }
  
  @media (max-width: 576px) {
    height: 300px;
  }
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
  z-index: 5;
`;

const VideoOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
  z-index: 5;
`;

const ErrorMessage = styled.div`
  color: var(--danger-color);
  background-color: var(--danger-light);
  padding: 15px;
  border-radius: var(--border-radius);
  margin-bottom: 15px;
  max-width: 80%;
  text-align: center;
`;

const VideoPlaceholder = styled.div`
  text-align: center;
  color: var(--text-light);
  
  i {
    font-size: 3rem;
    margin-bottom: 15px;
    color: var(--primary-color);
  }
  
  p {
    max-width: 300px;
  }
`;

const VideoControls = styled.div`
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 15px;
  z-index: 10;
`;

const ControlButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${props => props.primary ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.2)'};
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.primary ? 'var(--primary-dark)' : 'rgba(255, 255, 255, 0.3)'};
  }
`;

const CameraSettings = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
`;

const SettingsButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }
`;

// 实时反馈面板
const FeedbackPanel = styled.div`
  background-color: var(--bg-light);
  border-radius: var(--border-radius);
  padding: 20px;
  height: 600px;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 992px) {
    height: auto;
  }
`;

const ScoreSection = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const ScoreCircle = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: conic-gradient(
    var(--primary-color) ${props => props.score}%, 
    var(--bg-medium) ${props => props.score}% 100%
  );
  margin: 0 auto 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: var(--bg-light);
  }
`;

const ScoreValue = styled.div`
  position: relative;
  z-index: 1;
  font-size: 2rem;
  font-weight: bold;
  color: var(--text-color);
`;

const ScoreLabel = styled.div`
  font-size: 1rem;
  color: var(--text-light);
`;

const CounterSection = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
`;

const CounterItem = styled.div`
  text-align: center;
`;

const CounterValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: var(--text-color);
`;

const CounterLabel = styled.div`
  font-size: 0.9rem;
  color: var(--text-light);
`;

const FeedbackSection = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const FeedbackTitle = styled.h4`
  font-size: 1rem;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  
  i {
    margin-right: 10px;
    color: var(--primary-color);
  }
`;

const FeedbackList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FeedbackItem = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  padding: 12px 15px;
  border-left: 4px solid ${props => {
    if (props.type === 'success') return 'var(--success-color)';
    if (props.type === 'warning') return 'var(--warning-color)';
    if (props.type === 'error') return 'var(--danger-color)';
    return 'var(--primary-color)';
  }};
`;

const FeedbackText = styled.p`
  font-size: 0.9rem;
  margin: 0;
`;

// 训练数据统计区域
const StatsContainer = styled.div`
  background-color: var(--bg-light);
  border-radius: var(--border-radius);
  padding: 20px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  padding: 15px;
  text-align: center;
`;

const StatIcon = styled.div`
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-bottom: 10px;
`;

const StatValue = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: var(--text-light);
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
  
  // 引用
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const poseRef = useRef(null);
  const cameraRef = useRef(null);
  const contextRef = useRef(null);
  const animationRef = useRef(null);
  const lastPoseRef = useRef(null);
  
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
  
  const feedbacks = [
    { id: 1, type: 'success', text: '深蹲姿势良好，保持膝盖与脚尖方向一致' },
    { id: 2, type: 'warning', text: '下蹲时膝盖前移过多，尝试将重心放在脚跟' },
    { id: 3, type: 'error', text: '背部弯曲，请保持背部挺直以避免受伤' },
    { id: 4, type: 'info', text: '尝试增加下蹲深度，大腿与地面平行' }
  ];
  
  // 过滤显示的动作
  const filteredExercises = selectedCategory === 'all' 
    ? exercises 
    : exercises.filter(ex => ex.category === selectedCategory);
  
  // 初始化姿态估计
  const initPose = () => {
    // 创建Pose实例
    const pose = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      }
    });
    
    // 配置Pose参数
    pose.setOptions({
      modelComplexity: 1,        // 0: 轻量级模型, 1: 全特性模型
      smoothLandmarks: true,     // 平滑关键点
      enableSegmentation: false, // 不需要分割
      smoothSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
    
    // 设置结果回调
    pose.onResults((results) => {
      // 处理姿态估计结果
      handlePoseResults(results);
    });
    
    // 保存引用
    poseRef.current = pose;
    
    return pose;
  };
  
  // 处理姿态估计结果
  const handlePoseResults = (results) => {
    if (!canvasRef.current || !contextRef.current) return;
    
    const canvasElement = canvasRef.current;
    const canvasCtx = contextRef.current;
    
    // 清除画布
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
    // 绘制姿态关键点和连接线
    if (results.poseLandmarks) {
      // 更新状态
      setPoseDetected(true);
      
      // 绘制连接线
      drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
                    {color: '#00FF00', lineWidth: 4});
      
      // 绘制关键点
      drawLandmarks(canvasCtx, results.poseLandmarks,
                   {color: '#FF0000', lineWidth: 2, radius: 6});
      
      // 分析姿态
      analyzePose(results.poseLandmarks);
    } else {
      setPoseDetected(false);
    }
    
    canvasCtx.restore();
  };
  
  // 分析姿态
  const analyzePose = (landmarks) => {
    if (!selectedExercise) return;
    
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
      default:
        // 默认分析 - 简单的姿态评分
        const score = calculateGeneralPoseScore(currentPose);
        setPoseScore(score);
    }
    
    // 更新上一帧姿态
    lastPoseRef.current = currentPose;
  };
  
  // 计算两点之间的角度
  const calculateAngle = (p1, p2, p3) => {
    if (!p1 || !p2 || !p3) return 0;
    
    // 计算向量
    const vector1 = {
      x: p1.x - p2.x,
      y: p1.y - p2.y,
      z: p1.z - p2.z
    };
    
    const vector2 = {
      x: p3.x - p2.x,
      y: p3.y - p2.y,
      z: p3.z - p2.z
    };
    
    // 计算点积
    const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y + vector1.z * vector2.z;
    
    // 计算向量长度
    const magnitude1 = Math.sqrt(vector1.x * vector1.x + vector1.y * vector1.y + vector1.z * vector1.z);
    const magnitude2 = Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y + vector2.z * vector2.z);
    
    // 计算角度（弧度）
    const angle = Math.acos(dotProduct / (magnitude1 * magnitude2));
    
    // 转换为角度
    return angle * (180 / Math.PI);
  };
  
  // 分析深蹲动作
  const analyzeSquat = (landmarks) => {
    // 获取关键点
    const leftHip = landmarks[23];
    const leftKnee = landmarks[25];
    const leftAnkle = landmarks[27];
    const rightHip = landmarks[24];
    const rightKnee = landmarks[26];
    const rightAnkle = landmarks[28];
    
    // 计算膝盖角度
    const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
    const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
    
    // 平均膝盖角度
    const kneeAngle = (leftKneeAngle + rightKneeAngle) / 2;
    
    // 深蹲状态检测
    const isSquatting = kneeAngle < 120;
    const isStanding = kneeAngle > 160;
    
    // 上一帧姿态
    const lastPose = lastPoseRef.current;
    
    // 计数逻辑
    if (lastPose && isStanding && wasSquatting(lastPose)) {
      // 完成一次深蹲
      setRepCount(prev => prev + 1);
    }
    
    // 生成反馈
    const newFeedback = [];
    
    // 评分计算 (0-100)
    let score = 0;
    
    // 检查膝盖角度
    if (isSquatting) {
      if (kneeAngle < 90) {
        score += 40;
        newFeedback.push({
          id: 1,
          type: 'success',
          text: '深蹲深度良好，继续保持'
        });
      } else {
        score += 20;
        newFeedback.push({
          id: 2,
          type: 'warning',
          text: '尝试增加下蹲深度，大腿与地面平行'
        });
      }
      
      // 检查膝盖是否超过脚尖
      const kneeForward = checkKneeForward(landmarks);
      if (kneeForward) {
        score -= 15;
        newFeedback.push({
          id: 3,
          type: 'error',
          text: '膝盖前移过多，尝试将重心放在脚跟'
        });
      }
      
      // 检查背部姿势
      const backStraight = checkBackStraight(landmarks);
      if (!backStraight) {
        score -= 15;
        newFeedback.push({
          id: 4,
          type: 'error',
          text: '背部弯曲，请保持背部挺直以避免受伤'
        });
      } else {
        score += 20;
      }
    }
    
    // 确保分数在0-100范围内
    score = Math.max(0, Math.min(100, score));
    
    // 更新状态
    setPoseScore(score);
    if (newFeedback.length > 0) {
      setPoseFeedback(newFeedback);
    }
  };
  
  // 检查上一帧是否处于深蹲状态
  const wasSquatting = (lastPose) => {
    const leftHip = lastPose[23];
    const leftKnee = lastPose[25];
    const leftAnkle = lastPose[27];
    const rightHip = lastPose[24];
    const rightKnee = lastPose[26];
    const rightAnkle = lastPose[28];
    
    const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
    const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
    
    const kneeAngle = (leftKneeAngle + rightKneeAngle) / 2;
    
    return kneeAngle < 120;
  };
  
  // 检查膝盖是否超过脚尖
  const checkKneeForward = (landmarks) => {
    const leftKnee = landmarks[25];
    const leftAnkle = landmarks[27];
    const rightKnee = landmarks[26];
    const rightAnkle = landmarks[28];
    
    // 简化检查：在2D视图中，如果膝盖的x坐标超过脚踝的x坐标
    const leftForward = leftKnee.x > leftAnkle.x + 0.05;
    const rightForward = rightKnee.x > rightAnkle.x + 0.05;
    
    return leftForward || rightForward;
  };
  
  // 检查背部是否挺直
  const checkBackStraight = (landmarks) => {
    const leftShoulder = landmarks[11];
    const leftHip = landmarks[23];
    const leftKnee = landmarks[25];
    
    // 计算背部角度
    const backAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
    
    // 理想情况下，深蹲时背部应该与地面成一定角度但保持直线
    return backAngle > 160;
  };
  
  // 分析俯卧撑动作 (简化版)
  const analyzePushup = (landmarks) => {
    // 简单实现，实际项目中需要更复杂的逻辑
    setPoseScore(75);
    setPoseFeedback([
      { id: 1, type: 'success', text: '手臂位置良好' },
      { id: 2, type: 'warning', text: '尝试降低更多以增加训练效果' }
    ]);
  };
  
  // 分析平板支撑动作 (简化版)
  const analyzePlank = (landmarks) => {
    // 简单实现，实际项目中需要更复杂的逻辑
    setPoseScore(85);
    setPoseFeedback([
      { id: 1, type: 'success', text: '核心收紧，姿势良好' },
      { id: 2, type: 'info', text: '保持呼吸均匀' }
    ]);
  };
  
  // 计算一般姿态评分
  const calculateGeneralPoseScore = (landmarks) => {
    // 简单实现，返回一个基本分数
    return 70;
  };
  
  // 处理摄像头访问
  const startCamera = async () => {
    try {
      // 重置错误状态
      setCameraError(null);
      
      // 请求摄像头权限
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } 
      });
      
      // 保存流引用以便后续停止
      streamRef.current = stream;
      
      // 将视频流连接到视频元素
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      // 更新状态
      setCameraActive(true);
      setCameraPermission('granted');
      
      console.log('摄像头已成功启动');
      
      // 初始化Canvas上下文
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        canvas.width = videoRef.current.videoWidth || 1280;
        canvas.height = videoRef.current.videoHeight || 720;
        contextRef.current = canvas.getContext('2d');
      }
      
      // 初始化姿态估计
      if (!poseRef.current) {
        const pose = initPose();
        
        // 创建Camera实例连接视频和姿态估计
        if (videoRef.current) {
          const camera = new Camera(videoRef.current, {
            onFrame: async () => {
              if (poseRef.current && isTraining) {
                await poseRef.current.send({image: videoRef.current});
              }
            },
            width: 1280,
            height: 720
          });
          
          cameraRef.current = camera;
          camera.start();
        }
      }
    } catch (error) {
      console.error('摄像头访问错误:', error);
      
      // 处理不同类型的错误
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setCameraError('摄像头访问被拒绝。请在浏览器设置中允许摄像头访问，然后刷新页面。');
        setCameraPermission('denied');
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setCameraError('未找到摄像头设备。请确保您的设备有摄像头并且连接正常。');
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        setCameraError('无法访问摄像头。可能被其他应用程序占用，请关闭其他使用摄像头的应用后重试。');
      } else {
        setCameraError(`摄像头访问出错: ${error.message}`);
      }
    }
  };
  
  // 停止摄像头
  const stopCamera = () => {
    if (streamRef.current) {
      // 停止所有轨道
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      
      // 清除视频源
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      
      // 停止Camera
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      
      // 清除Canvas
      if (canvasRef.current && contextRef.current) {
        contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      
      // 更新状态
      setCameraActive(false);
      setPoseDetected(false);
      console.log('摄像头已停止');
    }
  };
  
  // 处理开始/暂停训练
  const toggleTraining = () => {
    if (!isTraining) {
      // 如果摄像头未启动，先启动摄像头
      if (!cameraActive) {
        startCamera();
      }
      setIsTraining(true);
      // 重置计数
      setRepCount(0);
    } else {
      setIsTraining(false);
    }
  };
  
  // 处理停止训练
  const stopTraining = () => {
    setIsTraining(false);
    stopCamera();
    // 重置状态
    setPoseDetected(false);
    setPoseScore(0);
    setRepCount(0);
    setPoseFeedback([]);
  };
  
  // 组件卸载时清理资源
  useEffect(() => {
    return () => {
      stopCamera();
      
      // 清理姿态估计资源
      if (poseRef.current) {
        poseRef.current.close();
      }
    };
  }, []);
  
  // 监听视频元素尺寸变化，更新Canvas尺寸
  useEffect(() => {
    const updateCanvasSize = () => {
      if (videoRef.current && canvasRef.current && contextRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        // 获取视频元素的显示尺寸
        const displayWidth = video.clientWidth;
        const displayHeight = video.clientHeight;
        
        // 更新Canvas尺寸
        if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
          canvas.width = displayWidth;
          canvas.height = displayHeight;
        }
      }
    };
    
    // 初始更新
    if (cameraActive) {
      updateCanvasSize();
    }
    
    // 添加调整大小事件监听器
    window.addEventListener('resize', updateCanvasSize);
    
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [cameraActive]);
  
  return (
    <Layout>
      <PageContainer>
        <PageHeader>
          <PageTitle>训练</PageTitle>
          <PageDescription>
            选择您想要练习的动作，开始AI辅助训练，获得实时反馈和指导
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
                  onClick={() => setSelectedExercise(exercise.id)}
                >
                  <ExerciseImage>
                    {/* 实际项目中应使用真实图片 */}
                    <img src={`/placeholder/${exercise.image}`} alt={exercise.name} />
                  </ExerciseImage>
                  <ExerciseInfo>
                    <ExerciseName>{exercise.name}</ExerciseName>
                    <ExerciseMeta>
                      <span>{exercise.target}</span>
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
            {/* 视频元素 */}
            <VideoElement 
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ display: cameraActive ? 'block' : 'none' }}
              onCanPlay={() => {
                if (videoRef.current) {
                  videoRef.current.play();
                  
                  // 更新Canvas尺寸
                  if (canvasRef.current) {
                    canvasRef.current.width = videoRef.current.clientWidth;
                    canvasRef.current.height = videoRef.current.clientHeight;
                    contextRef.current = canvasRef.current.getContext('2d');
                  }
                }
              }}
            />
            
            {/* Canvas元素用于绘制骨骼 */}
            <CanvasElement 
              ref={canvasRef}
              style={{ display: cameraActive ? 'block' : 'none' }}
            />
            
            {/* 视频占位符或覆盖层 */}
            {!cameraActive && !isTraining ? (
              <VideoPlaceholder>
                <i className="fas fa-video"></i>
                <h3>准备开始训练</h3>
                <p>选择一个动作并点击开始按钮，系统将通过摄像头捕捉您的动作</p>
              </VideoPlaceholder>
            ) : isTraining && !poseDetected && (
              <VideoOverlay>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '15px' }}></i>
                <h3>正在分析您的动作</h3>
                <p>AI系统正在实时分析您的姿势和动作质量</p>
              </VideoOverlay>
            )}
            
            {/* 摄像头错误信息 */}
            {cameraError && (
              <VideoOverlay>
                <i className="fas fa-exclamation-triangle" style={{ fontSize: '2rem', color: 'var(--danger-color)', marginBottom: '15px' }}></i>
                <ErrorMessage>{cameraError}</ErrorMessage>
                <button 
                  className="btn btn-primary"
                  onClick={startCamera}
                >
                  重试
                </button>
              </VideoOverlay>
            )}
            
            <CameraSettings>
              <SettingsButton>
                <i className="fas fa-cog"></i>
              </SettingsButton>
            </CameraSettings>
            
            <VideoControls>
              <ControlButton onClick={() => {
                if (cameraActive) {
                  stopCamera();
                  setTimeout(startCamera, 500);
                } else {
                  startCamera();
                }
              }}>
                <i className="fas fa-redo"></i>
              </ControlButton>
              <ControlButton primary onClick={toggleTraining}>
                {isTraining ? <i className="fas fa-pause"></i> : <i className="fas fa-play"></i>}
              </ControlButton>
              <ControlButton onClick={stopTraining}>
                <i className="fas fa-stop"></i>
              </ControlButton>
            </VideoControls>
          </VideoDisplayArea>
          
          {/* 实时反馈面板 */}
          <FeedbackPanel>
            <PanelTitle>
              <i className="fas fa-chart-line"></i>
              实时反馈
            </PanelTitle>
            
            <ScoreSection>
              <ScoreCircle score={poseScore}>
                <ScoreValue>{poseScore}</ScoreValue>
              </ScoreCircle>
              <ScoreLabel>动作评分</ScoreLabel>
            </ScoreSection>
            
            <CounterSection>
              <CounterItem>
                <CounterValue>{repCount}</CounterValue>
                <CounterLabel>完成次数</CounterLabel>
              </CounterItem>
              <CounterItem>
                <CounterValue>20</CounterValue>
                <CounterLabel>目标次数</CounterLabel>
              </CounterItem>
            </CounterSection>
            
            <FeedbackSection>
              <FeedbackTitle>
                <i className="fas fa-comment-alt"></i>
                动作指导
              </FeedbackTitle>
              
              <FeedbackList>
                {poseFeedback.length > 0 ? (
                  poseFeedback.map(feedback => (
                    <FeedbackItem key={feedback.id} type={feedback.type}>
                      <FeedbackText>{feedback.text}</FeedbackText>
                    </FeedbackItem>
                  ))
                ) : (
                  feedbacks.map(feedback => (
                    <FeedbackItem key={feedback.id} type={feedback.type}>
                      <FeedbackText>{feedback.text}</FeedbackText>
                    </FeedbackItem>
                  ))
                )}
              </FeedbackList>
            </FeedbackSection>
          </FeedbackPanel>
        </MainContent>
        
        {/* 训练数据统计区域 */}
        <StatsContainer>
          <PanelTitle>
            <i className="fas fa-chart-bar"></i>
            训练数据统计
          </PanelTitle>
          
          <StatsGrid>
            <StatCard>
              <StatIcon><i className="fas fa-clock"></i></StatIcon>
              <StatValue>25:18</StatValue>
              <StatLabel>训练时长</StatLabel>
            </StatCard>
            <StatCard>
              <StatIcon><i className="fas fa-fire"></i></StatIcon>
              <StatValue>187</StatValue>
              <StatLabel>消耗卡路里</StatLabel>
            </StatCard>
            <StatCard>
              <StatIcon><i className="fas fa-check-circle"></i></StatIcon>
              <StatValue>48</StatValue>
              <StatLabel>完成动作次数</StatLabel>
            </StatCard>
            <StatCard>
              <StatIcon><i className="fas fa-star"></i></StatIcon>
              <StatValue>82%</StatValue>
              <StatLabel>平均准确率</StatLabel>
            </StatCard>
          </StatsGrid>
        </StatsContainer>
      </PageContainer>
    </Layout>
  );
};

export default TrainingPage;
