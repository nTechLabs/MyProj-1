import React, { memo, useCallback } from 'react'
import { List, Checkbox, Avatar } from 'antd'
import { UserOutlined, MailOutlined, PhoneOutlined, GlobalOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useUsersIsChecked, useUsersToggleCheck } from '../../store/useUsersCheckedStore'
import './users-list.css'

/**
 * 개별 사용자 항목을 표시하는 컴포넌트 (최적화)
 * React.memo를 사용하여 불필요한 리렌더링 방지
 * 체크박스와 항목 내용으로 구성
 * 항목 클릭 시 상세 페이지로 이동
 */
const UsersItem = memo(({ user }) => {
  const navigate = useNavigate()
  
  // Users 전용 Zustand 선택자를 사용하여 필요한 부분만 구독 (리렌더링 최적화)
  const isChecked = useUsersIsChecked()
  const toggleCheck = useUsersToggleCheck()
  const checked = isChecked(user.id)

  // 체크박스 클릭 핸들러 (이벤트 전파 방지) - 메모이제이션
  const handleCheckboxClick = useCallback((e) => {
    e.stopPropagation()
    toggleCheck(user.id)
  }, [user.id, toggleCheck])

  // 항목 클릭 핸들러 (상세 페이지로 이동) - 메모이제이션
  const handleItemClick = useCallback(() => {
    navigate(`/users/user/${user.id}`)
  }, [user.id, navigate])

  // 사용자 이름의 첫 글자를 아바타로 사용 (메모이제이션)
  const avatarText = React.useMemo(() => 
    user.name ? user.name.charAt(0).toUpperCase() : 'U', 
    [user.name]
  )

  return (
    <List.Item
      className={`user-item ${checked ? 'checked' : ''}`}
      onClick={handleItemClick}
      style={{ 
        cursor: 'pointer',
        padding: '16px',
        backgroundColor: checked ? '#f0f9ff' : 'transparent',
        borderRadius: '8px',
        marginBottom: '8px',
        border: checked ? '2px solid #1890ff' : '1px solid #f0f0f0',
        transition: 'all 0.2s ease'
      }}
      actions={[
        <Checkbox
          key="checkbox"
          checked={checked}
          onClick={handleCheckboxClick}
        />
      ]}
    >
      <List.Item.Meta
        avatar={
          <Avatar 
            size={48} 
            icon={<UserOutlined />}
            style={{ 
              backgroundColor: checked ? '#1890ff' : '#87d068',
              fontSize: '18px'
            }}
          >
            {avatarText}
          </Avatar>
        }
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
              {user.name}
            </span>
            <span style={{ color: '#666', fontSize: '14px' }}>
              @{user.username}
            </span>
          </div>
        }
        description={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MailOutlined style={{ color: '#1890ff' }} />
              <span>{user.email}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <PhoneOutlined style={{ color: '#52c41a' }} />
              <span>{user.phone}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <GlobalOutlined style={{ color: '#fa8c16' }} />
              <span>{user.website}</span>
            </div>
          </div>
        }
      />
      
      {/* 회사 정보 */}
      <div style={{ 
        marginLeft: '16px', 
        fontSize: '12px', 
        color: '#999',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'center'
      }}>
        <div style={{ fontWeight: 'bold', color: '#666' }}>
          {user.company?.name}
        </div>
        <div>{user.address?.city}</div>
      </div>
    </List.Item>
  )
})

// 개발 환경에서 디버깅을 위한 displayName 설정
UsersItem.displayName = 'UsersItem'

export default UsersItem
