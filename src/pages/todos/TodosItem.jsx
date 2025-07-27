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
      style={{ 
        cursor: 'pointer',
        padding: '16px',
        backgroundColor: checked ? '#f0f9ff' : (todo.completed ? '#f6ffed' : 'transparent'),
        borderRadius: '8px',
        marginBottom: '8px',
        border: checked ? '2px solid #1890ff' : `1px solid ${todo.completed ? '#b7eb8f' : '#f0f0f0'}`,
        transition: 'all 0.2s ease',
        opacity: todo.completed ? 0.8 : 1
      }}
      actions={[
        <Checkbox
          key="checkbox"
          checked={checked}
          onClick={handleCheckboxClick}
          style={{ transform: 'scale(1.2)' }}
        />
      ]}
    >
      <List.Item.Meta
        avatar={
          <Avatar 
            size={48} 
            icon={todo.completed ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
            style={{ 
              backgroundColor: todo.completed 
                ? (checked ? '#1890ff' : '#52c41a')
                : (checked ? '#1890ff' : '#faad14'),
              fontSize: '20px'
            }}
          />
        }
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ 
              fontSize: '16px', 
              fontWeight: 'bold',
              textDecoration: todo.completed ? 'line-through' : 'none',
              color: todo.completed ? '#999' : '#262626'
            }}>
              {todo.title}
            </span>
            
            <Tag 
              color={todo.completed ? 'success' : 'processing'}
              style={{ marginLeft: 'auto' }}
            >
              {todo.completed ? '완료됨' : '진행중'}
            </Tag>
          </div>
        }
        description={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <UserOutlined style={{ color: '#999', fontSize: '12px' }} />
            <span style={{ color: '#999', fontSize: '12px' }}>
              사용자 ID: {todo.userId}
            </span>
            <span style={{ color: '#999', fontSize: '12px' }}>
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
