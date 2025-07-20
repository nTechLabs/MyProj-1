import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { message } from 'antd'

/**
 * 알림/토스트 메시지를 관리하는 Zustand 스토어
 * Ant Design의 message API와 연동
 */
const useNotificationStore = create(
  devtools(
    (set, get) => ({
  // 현재 표시 중인 알림들
  notifications: [],
  
  // 성공 메시지 표시
  showSuccess: (content, duration = 3) => {
    const id = message.success(content, duration)
    set(state => ({
      notifications: [...state.notifications, { id, type: 'success', content, duration }]
    }))
    return id
  },
  
  // 에러 메시지 표시
  showError: (content, duration = 5) => {
    const id = message.error(content, duration)
    set(state => ({
      notifications: [...state.notifications, { id, type: 'error', content, duration }]
    }))
    return id
  },
  
  // 경고 메시지 표시
  showWarning: (content, duration = 4) => {
    const id = message.warning(content, duration)
    set(state => ({
      notifications: [...state.notifications, { id, type: 'warning', content, duration }]
    }))
    return id
  },
  
  // 정보 메시지 표시
  showInfo: (content, duration = 3) => {
    const id = message.info(content, duration)
    set(state => ({
      notifications: [...state.notifications, { id, type: 'info', content, duration }]
    }))
    return id
  },
  
  // 로딩 메시지 표시
  showLoading: (content, duration = 0) => {
    const id = message.loading(content, duration)
    set(state => ({
      notifications: [...state.notifications, { id, type: 'loading', content, duration }]
    }))
    return id
  },
  
  // 특정 알림 제거
  removeNotification: (id) => {
    message.destroy(id)
    set(state => ({
      notifications: state.notifications.filter(notification => notification.id !== id)
    }))
  },
  
  // 모든 알림 제거
  clearAll: () => {
    message.destroy()
    set({ notifications: [] })
  },
  
  // API 응답에 따른 자동 알림
  handleApiResponse: (response, successMessage = '작업이 완료되었습니다.') => {
    const { showSuccess, showError } = get()
    
    if (response?.status >= 200 && response?.status < 300) {
      showSuccess(successMessage)
    } else {
      showError(response?.message || '오류가 발생했습니다.')
    }
  },
  
  // 에러 핸들링을 위한 헬퍼 함수
  handleError: (error, defaultMessage = '오류가 발생했습니다.') => {
    const { showError } = get()
    const errorMessage = error?.response?.data?.message || error?.message || defaultMessage
    showError(errorMessage)
  }
}),
    {
      name: 'notification-store', // DevTools에서 표시될 스토어 이름
    }
  )
)

export default useNotificationStore
