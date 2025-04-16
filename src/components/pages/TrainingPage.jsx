import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Layout from '../layout/Layout';
import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { POSE_CONNECTIONS } from '@mediapipe/pose';
import { analyzePullup } from './sport/PullupAnalyzer';

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
  border: ${props => props.selected ? '2px solid var(--primary-color)' : '1px solid transparent'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.selected ? 'var(--primary-light)' : 'var(--bg-hover)'};
    border-color: var(--primary-color);
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

// 调试信息面板
const DebugPanel = styled.div`
  position: absolute;
  bottom: 80px;
  left: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-size: 12px;
  max-width: 300px;
  z-index: 100;
  display: ${props => props.visible ? 'block' : 'none'};
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
  
  // 初始化摄像头
  const initCamera = () => {
    addDebugLog('开始初始化摄像头...');
    
    // 检查视频元素是否存在
    if (!videoRef.current) {
      addDebugLog('视频元素不存在');
      setCameraError('视频元素不存在');
      return;
    }
    
    // 请求摄像头权限
    navigator.mediaDevices.getUserMedia({
      video: { width: 1280, height: 720 },
      audio: false
    })
    .then(stream => {
      addDebugLog('摄像头权限获取成功');
      
      // 保存流引用
      streamRef.current = stream;
      
      // 设置视频元素
      const videoElement = videoRef.current;
      videoElement.srcObject = stream;
      
      // 设置Canvas上下文
      const canvasElement = canvasRef.current;
      contextRef.current = canvasElement.getContext('2d');
      
      // 监听视频元素尺寸变化
      videoElement.addEventListener('loadedmetadata', () => {
        const { videoWidth, videoHeight } = videoElement;
        addDebugLog(`视频元素尺寸变化: ${videoWidth}x${videoHeight}`);
        
        // 更新Canvas尺寸
        canvasElement.width = videoWidth;
        canvasElement.height = videoHeight;
        addDebugLog(`更新Canvas尺寸为: ${videoWidth}x${videoHeight}`);
      });
      
      // 初始化姿态估计模型
      const pose = initPose();
      
      if (pose) {
        // 创建Camera实例
        const camera = new Camera(videoElement, {
          onFrame: async () => {
            if (poseRef.current) {
              await poseRef.current.send({ image: videoElement });
            }
          },
          width: 1280,
          height: 720
        });
        
        // 保存Camera引用
        cameraRef.current = camera;
        
        // 启动Camera
        camera.start()
          .then(() => {
            addDebugLog('Camera启动成功');
            setCameraActive(true);
            setCameraError(null);
          })
          .catch(error => {
            addDebugLog(`Camera启动失败: ${error.message}`);
            setCameraError(`Camera启动失败: ${error.message}`);
          });
      }
    })
    .catch(error => {
      addDebugLog(`获取摄像头权限失败: ${error.message}`);
      setCameraError(`获取摄像头权限失败: ${error.message}`);
      setCameraPermission(false);
    });
  };
  
  // 初始化姿态估计
  const initPose = () => {
    try {
      addDebugLog('开始初始化姿态估计模型...');
      
      // 创建Pose实例，使用特定版本的MediaPipe
      const pose = new Pose({
        locateFile: (file) => {
          addDebugLog(`加载MediaPipe文件: ${file}`);
          // 使用特定版本的MediaPipe库
          return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/${file}`;
        }
      });
      
      addDebugLog('Pose实例创建成功');
      
      // 配置Pose参数
      pose.setOptions({
        modelComplexity: 1,        // 0: 轻量级模型, 1: 全特性模型
        smoothLandmarks: true,     // 平滑关键点
        enableSegmentation: false, // 不需要分割
        smoothSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });
      
      addDebugLog('Pose参数配置成功');
      
      // 设置结果回调
      pose.onResults((results) => {
        addDebugLog(`收到姿态估计结果: ${results && results.poseLandmarks ? '有关键点' : '无关键点'}`);
        // 处理姿态估计结果
        handlePoseResults(results);
      });
      
      // 保存引用
      poseRef.current = pose;
      addDebugLog('姿态估计模型初始化完成');
      
      return pose;
    } catch (error) {
      addDebugLog(`初始化姿态估计模型失败: ${error.message}`);
      setCameraError(`初始化姿态估计模型失败: ${error.message}`);
      return null;
    }
  };
  
  // 处理姿态估计结果
  const handlePoseResults = (results) => {
    if (!canvasRef.current || !contextRef.current) {
      addDebugLog('Canvas引用或上下文不存在');
      return;
    }
    
    const canvasElement = canvasRef.current;
    const canvasCtx = contextRef.current;
    
    // 清除画布
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
    // 绘制姿态关键点和连接线
    if (results.poseLandmarks) {
      addDebugLog(`检测到姿态关键点，数量: ${results.poseLandmarks.length}`);
      
      // 更新状态
      setPoseDetected(true);
      
      try {
        // 绘制连接线
        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
                      {color: '#00FF00', lineWidth: 4});
        
        // 绘制关键点
        drawLandmarks(canvasCtx, results.poseLandmarks,
                     {color: '#FF0000', lineWidth: 2, radius: 6});
        
        addDebugLog('成功绘制骨骼和关键点');
        
        // 分析姿态
        analyzePose(results.poseLandmarks);
      } catch (error) {
        addDebugLog(`绘制骨骼或关键点时出错: ${error.message}`);
      }
    } else {
      addDebugLog('未检测到姿态关键点');
      setPoseDetected(false);
    }
    
    canvasCtx.restore();
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
  switch(Number(selectedExercise)) {
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
      analyzePullup(currentPose, addDebugLog, setPoseScore, setPoseFeedback, setRepCount, lastPoseRef.current);
      break;
    default:
      // 默认分析 - 简单的姿态评分
      const score = calculateGeneralPoseScore(currentPose);
      setPoseScore(score);
      addDebugLog(`使用通用评分: ${score}, 选择的动作ID: ${selectedExercise}`);
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
    addDebugLog(`深蹲分析 - 膝盖角度: ${kneeAngle.toFixed(2)}°`);
    
    // 深蹲状态检测
    const isSquatting = kneeAngle < 120;
    const isStanding = kneeAngle > 160;
    
    // 上一帧姿态
    const lastPose = lastPoseRef.current;
    
    // 计数逻辑
    if (lastPose && isStanding && wasSquatting(lastPose)) {
      // 完成一次深蹲
      setRepCount(prev => prev + 1);
      addDebugLog('完成一次深蹲');
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
    
    addDebugLog(`深蹲评分: ${score}`);
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
    // 获取关键点
    const leftShoulder = landmarks[11];
    const leftHip = landmarks[23];
    const leftKnee = landmarks[25];
    
    // 计算背部角度（肩膀-髋关节-膝盖）
    const backAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
    
    // 如果角度接近180度，认为背部是挺直的
    return backAngle > 160;
  };
  
  // 通用姿态评分函数
  const calculateGeneralPoseScore = (landmarks) => {
    // 简单的姿态评分逻辑
    // 检查是否检测到了足够的关键点
    if (!landmarks || landmarks.length < 33) {
      return 10; // 关键点不足，给予低分
    }
    
    // 检查姿态的可见度
    let visibilitySum = 0;
    let visiblePoints = 0;
    
    // 计算关键点的平均可见度
    landmarks.forEach(point => {
      if (point.visibility > 0.5) {
        visibilitySum += point.visibility;
        visiblePoints++;
      }
    });
    
    const averageVisibility = visiblePoints > 0 ? visibilitySum / visiblePoints : 0;
    
    // 基于可见度计算基础分数
    let score = averageVisibility * 100;
    
    // 确保分数在0-100范围内
    return Math.max(0, Math.min(100, score));
  };
  
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
                    setIsTraining(!isTraining);
                    addDebugLog(`${isTraining ? '暂停' : '开始'}训练`);
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
            </CameraSettings>
            
            <DebugPanel visible={showDebug}>
              {debugInfo}
            </DebugPanel>
          </VideoDisplayArea>
          
          {/* 实时反馈面板 */}
          <FeedbackPanel>
            <ScoreSection>
              <ScoreCircle score={poseScore}>
                <ScoreValue>{poseScore}</ScoreValue>
              </ScoreCircle>
              <ScoreLabel>姿势评分</ScoreLabel>
            </ScoreSection>
            
            <CounterSection>
              <CounterItem>
                <CounterValue>{repCount}</CounterValue>
                <CounterLabel>完成次数</CounterLabel>
              </CounterItem>
              <CounterItem>
                <CounterValue>{Math.floor(repCount * 1.5)}</CounterValue>
                <CounterLabel>消耗卡路里</CounterLabel>
              </CounterItem>
            </CounterSection>
            
            <FeedbackSection>
              <FeedbackTitle>
                <i className="fas fa-comment-alt"></i>
                实时反馈
              </FeedbackTitle>
              
              <FeedbackList>
                {poseFeedback.map(feedback => (
                  <FeedbackItem key={feedback.id} type={feedback.type}>
                    <FeedbackText>{feedback.text}</FeedbackText>
                  </FeedbackItem>
                ))}
              </FeedbackList>
            </FeedbackSection>
          </FeedbackPanel>
        </MainContent>
        
        {/* 训练数据统计 */}
        <StatsContainer>
          <PanelTitle>
            <i className="fas fa-chart-bar"></i>
            训练数据统计
          </PanelTitle>
          
          <StatsGrid>
            <StatCard>
              <StatIcon>
                <i className="fas fa-fire"></i>
              </StatIcon>
              <StatValue>{Math.floor(repCount * 1.5)}</StatValue>
              <StatLabel>消耗卡路里</StatLabel>
            </StatCard>
            
            <StatCard>
              <StatIcon>
                <i className="fas fa-stopwatch"></i>
              </StatIcon>
              <StatValue>00:05:30</StatValue>
              <StatLabel>训练时长</StatLabel>
            </StatCard>
            
            <StatCard>
              <StatIcon>
                <i className="fas fa-trophy"></i>
              </StatIcon>
              <StatValue>{repCount}</StatValue>
              <StatLabel>完成次数</StatLabel>
            </StatCard>
            
            <StatCard>
              <StatIcon>
                <i className="fas fa-star"></i>
              </StatIcon>
              <StatValue>{poseScore}</StatValue>
              <StatLabel>平均评分</StatLabel>
            </StatCard>
          </StatsGrid>
        </StatsContainer>
      </PageContainer>
    </Layout>
  );
};

export default TrainingPage;
