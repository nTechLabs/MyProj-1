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
      className={`todo-item ${checked ? 'checked' : ''} ${todo.completed ? 'completed' : ''}`}
      onClick={handleItemClick}
    >
      <div className={`todo-item-container ${checked ? 'checked' : ''}`}>
        {/* 아바타 */}
        <div className="todo-item-avatar">
          <Avatar 
            size={48} 
            icon={todo.completed ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
            className={`${todo.completed ? 'todo-item-avatar-completed' : 'todo-item-avatar-pending'} ${checked ? 'checked' : ''}`}
          />
        </div>

        {/* 메인 콘텐츠 */}
        <div className="todo-item-content">
          {/* 제목 줄 */}
          <div className="todo-item-title">
            <span className={`todo-item-name ${todo.completed ? 'completed' : ''}`}>
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
            {todo.completed ? (
              <>
                <CheckCircleOutlined style={{ marginRight: '4px', color: '#52c41a' }} />
                완료됨
              </>
            ) : (
              <>
                <ClockCircleOutlined style={{ marginRight: '4px', color: '#fa8c16' }} />
                진행중
              </>
            )}
          </div>
          <div className="todo-item-status-sub">
            {todo.completed ? '✓ 작업 완료' : '⏳ 작업 중'}
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
