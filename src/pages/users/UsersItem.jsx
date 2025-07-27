import React, { memo, useCallback } from 'react'
import { List, Checkbox, Avatar } from 'antd'
import { UserOutlined, MailOutlined, PhoneOutlined, GlobalOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import useUsersCheckedStore from '../../store/useUsersStore'
import './users.css'

/**
 * 개별 사용자 항목을 표시하는 컴포넌트 (최적화)
 * React.memo를 사용하여 불필요한 리렌더링 방지
 * 체크박스와 항목 내용으로 구성
 * 항목 클릭 시 상세 페이지로 이동
 */
const UsersItem = memo(({ user }) => {
  const navigate = useNavigate()
  
  // Users 전용 Zustand 선택자를 사용하여 필요한 부분만 구독 (리렌더링 최적화)
  const { isChecked, toggleCheck } = useUsersCheckedStore()
  const checked = isChecked(user.id)

  // 체크박스 클릭 핸들러 (이벤트 전파 방지) - 메모이제이션
  const handleCheckboxChange = useCallback((e) => {
    console.log('✅ Checkbox onChange for user:', user.id, 'target checked:', e.target.checked, 'current checked:', checked)
    
    e.stopPropagation()
    toggleCheck(user.id)
  }, [user.id, toggleCheck, checked])

  // 항목 클릭 핸들러 (상세 페이지로 이동) - 메모이제이션
  const handleItemClick = useCallback((e) => {
    // 체크박스 영역을 클릭한 경우 이동하지 않음
    if (e.target.closest('.checkbox-area')) {
      console.log('🚫 Item click blocked - checkbox area clicked')
      return
    }
    console.log('🔗 Item clicked, navigating to user detail:', user.id)
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
    >
      <div className={`user-item-container ${checked ? 'checked' : ''}`}>
        {/* 아바타 */}
        <div className="user-item-avatar">
          <Avatar 
            size={48} 
            className={checked ? 'checked' : ''}
          >
            {avatarText}
          </Avatar>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="user-item-content">
          {/* 제목 줄 */}
          <div className="user-item-title">
            <span className="user-item-name">
              {user.name}
            </span>
            <span className="user-item-username">
              @{user.username}
            </span>
          </div>

          {/* 연락처 정보 */}
          <div className="user-item-contacts">
            <div className="user-item-contact">
              <MailOutlined />
              <span>
                {user.email}
              </span>
            </div>
            <div className="user-item-contact">
              <PhoneOutlined />
              <span>{user.phone}</span>
            </div>
            <div className="user-item-contact">
              <GlobalOutlined />
              <span>
                {user.website}
              </span>
            </div>
          </div>
        </div>

        {/* 회사 정보 */}
        <div className="user-item-company">
          <div className="user-item-company-name">
            {user.company?.name}
          </div>
          <div className="user-item-company-city">
            {user.address?.city}
          </div>
        </div>

        {/* 체크박스 (우측 끝) */}
        <div 
          className="checkbox-area user-item-checkbox"
          onClick={(e) => {
            e.stopPropagation()
            console.log('🎯 Checkbox area clicked for user:', user.id, '(handled by onChange)')
          }}
        >
          {/* 임시로 기본 체크박스로 테스트 */}
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => {
              console.log('🔲 Native checkbox onChange for user:', user.id, 'checked:', e.target.checked)
              e.stopPropagation()
              toggleCheck(user.id)
            }}
          />
          {/* 원래 Ant Design Checkbox 주석 처리
          <Checkbox
            checked={checked}
            onChange={handleCheckboxChange}
          />
          */}
        </div>
      </div>
    </List.Item>
  )
})

// 개발 환경에서 디버깅을 위한 displayName 설정
UsersItem.displayName = 'UsersItem'

export default UsersItem
