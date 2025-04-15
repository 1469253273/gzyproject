/**
 * 引体向上动作分析器
 * 分析用户的引体向上动作，计算评分并提供反馈
 */

import SpeechService from '../../../services/SpeechService';

/**
 * 分析引体向上动作
 * @param {Array} landmarks - MediaPipe Pose模型检测到的姿态关键点
 * @param {Function} addDebugLog - 添加调试日志的函数
 * @param {Function} setPoseScore - 设置姿态评分的函数
 * @param {Function} setPoseFeedback - 设置姿态反馈的函数
 * @param {Function} setRepCount - 设置重复次数的函数
 * @param {Object} lastPose - 上一帧的姿态关键点
 * @param {Boolean} speechEnabled - 语音指导是否启用
 * @returns {void}
 */
export const analyzePullup = (landmarks, addDebugLog, setPoseScore, setPoseFeedback, setRepCount, lastPose, speechEnabled = true) => {
  // 获取上肢关键点
  const leftShoulder = landmarks[11];
  const leftElbow = landmarks[13];
  const leftWrist = landmarks[15];
  const rightShoulder = landmarks[12];
  const rightElbow = landmarks[14];
  const rightWrist = landmarks[16];
  
  // 计算肘部角度（手臂弯曲程度）
  const leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
  const rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
  
  // 平均肘部角度
  const elbowAngle = (leftElbowAngle + rightElbowAngle) / 2;
  addDebugLog(`引体向上分析 - 肘部角度: ${elbowAngle.toFixed(2)}°`);
  
  // 计算手腕相对于肩膀的高度
  const leftWristHeight = leftShoulder.y - leftWrist.y;
  const rightWristHeight = rightShoulder.y - rightWrist.y;
  const wristHeight = (leftWristHeight + rightWristHeight) / 2;
  addDebugLog(`引体向上分析 - 手腕高度: ${wristHeight.toFixed(4)}`);
  
  // 引体向上状态检测
  // 肘部角度小于90度且手腕高于肩膀表示正在做引体向上
  const isPullingUp = elbowAngle < 90 && wristHeight > 0.05;
  // 肘部角度大于150度表示手臂伸直，处于下放状态
  const isHanging = elbowAngle > 150;
  
  addDebugLog(`引体向上状态 - 拉起: ${isPullingUp}, 悬挂: ${isHanging}`);
  
  // 计数逻辑
  if (lastPose && isHanging && wasPullingUp(lastPose)) {
    // 完成一次引体向上
    setRepCount(prev => {
      const newCount = prev + 1;
      // 添加语音反馈
      if (speechEnabled) {
        if (newCount % 5 === 0) {
          // 每5个里程碑特殊鼓励
          SpeechService.speak(`太棒了！已经完成${newCount}个引体向上，继续加油！`);
        } else {
          SpeechService.speak(`完成第${newCount}个引体向上，做得很好！`);
        }
      }
      return newCount;
    });
    addDebugLog('完成一次引体向上');
  }
  
  // 生成反馈
  const newFeedback = [];
  
  // 评分计算 (0-100)
  let score = 0;
  
  // 语音指导文本
  let speechText = '';
  
  if (isPullingUp) {
    // 检查肘部角度
    if (elbowAngle < 70) {
      score += 40;
      newFeedback.push({
        id: 1,
        type: 'success',
        text: '引体向上姿势良好，手臂弯曲充分'
      });
      speechText = '姿势很好，继续保持';
    } else {
      score += 20;
      newFeedback.push({
        id: 2,
        type: 'warning',
        text: '尝试更多弯曲手臂，使下巴接近横杆'
      });
      speechText = '再弯曲手臂一些，让下巴接近横杆';
    }
    
    // 检查肩膀是否对称
    const shoulderSymmetry = checkShoulderSymmetry(landmarks);
    if (!shoulderSymmetry) {
      score -= 15;
      newFeedback.push({
        id: 3,
        type: 'error',
        text: '肩膀不对称，尝试均匀用力'
      });
      
      // 如果之前没有语音文本，设置语音文本
      if (!speechText) {
        speechText = '肩膀不对称，请均匀用力';
      }
    } else {
      score += 20;
    }
    
    // 检查身体是否摆动
    const bodyStable = checkBodyStability(landmarks, lastPose);
    if (!bodyStable) {
      score -= 15;
      newFeedback.push({
        id: 4,
        type: 'error',
        text: '身体摆动过大，尝试保持身体稳定'
      });
      
      // 如果之前没有语音文本，设置语音文本
      if (!speechText) {
        speechText = '身体摆动过大，保持稳定';
      }
    } else {
      score += 20;
    }
    
    // 播放语音指导
    if (speechEnabled && speechText) {
      SpeechService.speak(speechText);
    }
  } else if (isHanging) {
    // 悬挂状态的反馈
    newFeedback.push({
      id: 5,
      type: 'info',
      text: '准备拉起，保持肩膀放松'
    });
    score = 30; // 基础分数
    
    // 随机播放鼓励语音
    if (speechEnabled && Math.random() < 0.1) { // 10%的概率播放
      SpeechService.speak('准备拉起，保持肩膀放松');
    }
  } else {
    // 其他状态
    newFeedback.push({
      id: 6,
      type: 'info',
      text: '请面对摄像头，双手与肩同宽，模拟引体向上动作'
    });
    score = 10; // 低分数
    
    // 如果长时间未检测到正确姿势，播放指导语音
    if (speechEnabled && Math.random() < 0.05) { // 5%的概率播放
      SpeechService.speak('请面对摄像头，双手与肩同宽，模拟引体向上动作');
    }
  }
  
  // 确保分数在0-100范围内
  score = Math.max(0, Math.min(100, score));
  
  // 更新状态
  setPoseScore(score);
  if (newFeedback.length > 0) {
    setPoseFeedback(newFeedback);
  }
  
  addDebugLog(`引体向上评分: ${score}`);
};

/**
 * 检查上一帧是否处于引体向上状态
 * @param {Array} lastPose - 上一帧的姿态关键点
 * @returns {boolean} - 是否处于引体向上状态
 */
const wasPullingUp = (lastPose) => {
  const leftShoulder = lastPose[11];
  const leftElbow = lastPose[13];
  const leftWrist = lastPose[15];
  const rightShoulder = lastPose[12];
  const rightElbow = lastPose[14];
  const rightWrist = lastPose[16];
  
  const leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
  const rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
  
  const elbowAngle = (leftElbowAngle + rightElbowAngle) / 2;
  
  const leftWristHeight = leftShoulder.y - leftWrist.y;
  const rightWristHeight = rightShoulder.y - rightWrist.y;
  const wristHeight = (leftWristHeight + rightWristHeight) / 2;
  
  return elbowAngle < 90 && wristHeight > 0.05;
};

/**
 * 检查肩膀是否对称
 * @param {Array} landmarks - 姿态关键点
 * @returns {boolean} - 肩膀是否对称
 */
const checkShoulderSymmetry = (landmarks) => {
  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];
  
  // 检查左右肩膀的y坐标差异
  const shoulderDiff = Math.abs(leftShoulder.y - rightShoulder.y);
  
  // 如果差异小于阈值，认为是对称的
  return shoulderDiff < 0.05;
};

/**
 * 检查身体是否稳定（没有大幅摆动）
 * @param {Array} landmarks - 当前帧的姿态关键点
 * @param {Array} lastPose - 上一帧的姿态关键点
 * @returns {boolean} - 身体是否稳定
 */
const checkBodyStability = (landmarks, lastPose) => {
  // 如果没有上一帧数据，认为是稳定的
  if (!lastPose) return true;
  
  // 获取躯干关键点
  const currentNose = landmarks[0];
  const lastNose = lastPose[0];
  
  // 计算鼻子位置的变化
  const noseMovement = Math.sqrt(
    Math.pow(currentNose.x - lastNose.x, 2) + 
    Math.pow(currentNose.y - lastNose.y, 2)
  );
  
  // 如果变化小于阈值，认为是稳定的
  return noseMovement < 0.03;
};

/**
 * 计算三点之间的角度
 * @param {Object} p1 - 第一个点
 * @param {Object} p2 - 第二个点（角度的顶点）
 * @param {Object} p3 - 第三个点
 * @returns {number} - 角度（度数）
 */
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
