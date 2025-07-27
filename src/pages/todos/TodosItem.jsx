import React, { memo, useCallback } from 'react'
import { List, Checkbox, Tag, Avatar } from 'antd'
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
  const handleCheckboxClick = useCallback((e) => {
    e.stopPropagation()
    toggleCheck(todo.id)
  }, [todo.id, toggleCheck])

  // 항목 클릭 핸들러 (상세 페이지로 이동) - useCallback으로 최적화
  const handleItemClick = useCallback(() => {
    navigate(`/todos/todo/${todo.id}`)
  }, [navigate, todo.id])

  return (
    <List.Item
      className={`todo-item ${checked ? 'checked' : ''} ${todo.completed ? 'completed' : ''}`}
      onClick={handleItemClick}
      actions={[
        <Checkbox
          key="checkbox"
          checked={checked}
          onClick={handleCheckboxClick}
          className="todo-item-checkbox"
        />
      ]}
    >
      <List.Item.Meta
        avatar={
          <Avatar 
            size={48} 
            icon={todo.completed ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
            className={`${todo.completed ? 'todo-item-avatar-completed' : 'todo-item-avatar-pending'} ${checked ? 'checked' : ''}`}
          />
        }
        title={
          <div className="todo-item-title-container">
            <span className={`todo-item-title ${todo.completed ? 'completed' : ''}`}>
              {todo.title}
            </span>
            
            <Tag 
              color={todo.completed ? 'success' : 'processing'}
              className="todo-item-tag"
            >
              {todo.completed ? '완료됨' : '진행중'}
            </Tag>
          </div>
        }
        description={
          <div className="todo-item-description">
            <UserOutlined className="todo-item-description-icon" />
            <span className="todo-item-description-text">
              사용자 ID: {todo.userId}
            </span>
            <span className="todo-item-description-text">
              • ID: {todo.id}
            </span>
          </div>
        }
      />
    </List.Item>
  )
})

TodosItem.displayName = 'TodosItem'

export default TodosItem
