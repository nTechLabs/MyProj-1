import React, { memo, useCallback } from 'react'
import { List, Checkbox, Avatar } from 'antd'
import { CheckCircleOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import useTodosStore from '../../store/useTodosStore'

/**
 * 개별 할일 항목을 표시하는 컴포넌트 (최적화)
 * React.memo로 불필요한 리렌더링 방지
 * 체크박스와 항목 내용으로 구성
 * 항목 클릭 시 상세 페이지로 이동
 */
const TodosItem = memo(({ todo }) => {
  const navigate = useNavigate()
  const { isChecked, toggleCheck } = useTodosStore()

  const checked = isChecked(todo.id)

  // 상태별 설정 함수
  const getStatusConfig = useCallback((status) => {
    const configs = {
      todo: {
        icon: <ClockCircleOutlined />,
        color: '#d9d9d9',
        text: '할 일',
        avatarClass: 'todo-item-avatar-todo'
      },
      in_progress: {
        icon: <ClockCircleOutlined />,
        color: '#1890ff',
        text: '진행 중',
        avatarClass: 'todo-item-avatar-in-progress'
      },
      review: {
        icon: <ClockCircleOutlined />,
        color: '#fa8c16',
        text: '검토 중',
        avatarClass: 'todo-item-avatar-review'
      },
      completed: {
        icon: <CheckCircleOutlined />,
        color: '#52c41a',
        text: '완료됨',
        avatarClass: 'todo-item-avatar-completed'
      },
      cancelled: {
        icon: <ClockCircleOutlined />,
        color: '#ff4d4f',
        text: '취소됨',
        avatarClass: 'todo-item-avatar-cancelled'
      }
    }
    return configs[status] || configs.todo
  }, [])

  const statusConfig = getStatusConfig(todo.status)

  // UserId의 첫 글자를 아바타로 사용 (메모이제이션)
  const avatarText = React.useMemo(() => 
    todo.userId ? todo.userId.toString().charAt(0).toUpperCase() : 'U', 
    [todo.userId]
  )

  // 체크박스 클릭 핸들러 (이벤트 전파 방지) - useCallback으로 최적화
  const handleCheckboxChange = useCallback((e) => {
    console.log('✅ Checkbox onChange for todo:', todo.id, 'target checked:', e.target.checked, 'current checked:', checked)
    
    e.stopPropagation()
    toggleCheck(todo.id)
  }, [todo.id, toggleCheck, checked])

  // 항목 클릭 핸들러 (상세 페이지로 이동) - useCallback으로 최적화
  const handleItemClick = useCallback((e) => {
    // 체크박스 영역을 클릭한 경우 이동하지 않음
    if (e.target.closest('.checkbox-area')) {
      console.log('🚫 Item click blocked - checkbox area clicked')
      return
    }
    console.log('🔗 Item clicked, navigating to todo detail:', todo.id)
    navigate(`/todos/todo/${todo.id}`)
  }, [todo.id, navigate])

  return (
    <List.Item
      className={`todo-item ${checked ? 'checked' : ''} ${todo.status === 'completed' ? 'completed' : ''} ${todo.status === 'cancelled' ? 'cancelled' : ''}`}
      onClick={handleItemClick}
    >
      <div className={`todo-item-container ${checked ? 'checked' : ''}`}>
        {/* 아바타 */}
        <div className="todo-item-avatar">
          <Avatar 
            size={48} 
            className={`${statusConfig.avatarClass} ${checked ? 'checked' : ''}`}
          >
            {avatarText}
          </Avatar>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="todo-item-content">
          {/* 제목 줄 */}
          <div className="todo-item-title">
            <span className={`todo-item-name ${todo.status === 'completed' ? 'completed' : ''} ${todo.status === 'cancelled' ? 'cancelled' : ''}`}>
              {todo.title}
            </span>
          </div>

          {/* 할일 정보 */}
          <div className="todo-item-details">
            <div className="todo-item-detail">
              <UserOutlined />
              <span>
                사용자 ID: {todo.userId}
              </span>
            </div>
            <div className="todo-item-detail">
              <span>ID: {todo.id}</span>
            </div>
          </div>
        </div>

        {/* 상태 정보 (UsersItem의 회사 정보와 같은 위치) */}
        <div className="todo-item-status">
          <div className="todo-item-status-main">
            {React.cloneElement(statusConfig.icon, { 
              style: { marginRight: '4px', color: statusConfig.color } 
            })}
            {statusConfig.text}
          </div>
        </div>

        {/* 체크박스 (우측 끝) */}
        <div 
          className="checkbox-area todo-item-checkbox"
          onClick={(e) => {
            e.stopPropagation()
            console.log('🎯 Checkbox area clicked for todo:', todo.id, '(handled by onChange)')
          }}
        >
          <Checkbox
            checked={checked}
            onChange={handleCheckboxChange}
          />
        </div>
      </div>
    </List.Item>
  )
})

TodosItem.displayName = 'TodosItem'

export default TodosItem
