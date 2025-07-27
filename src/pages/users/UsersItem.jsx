import React, { memo, useCallback } from 'react'
import { List, Checkbox, Avatar } from 'antd'
import { UserOutlined, MailOutlined, PhoneOutlined, GlobalOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useUsersIsChecked, useUsersToggleCheck } from '../../store/useUsersStore'
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
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        minHeight: '80px'
      }}
    >
      {/* 아바타 */}
      <div style={{ 
        marginRight: '16px', 
        flexShrink: 0 
      }}>
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
      </div>

      {/* 메인 콘텐츠 */}
      <div style={{ 
        flex: 1, 
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        {/* 제목 줄 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          marginBottom: '4px'
        }}>
          <span style={{ 
            fontSize: '16px', 
            fontWeight: 'bold',
            color: '#262626'
          }}>
            {user.name}
          </span>
          <span style={{ 
            color: '#8c8c8c', 
            fontSize: '14px'
          }}>
            @{user.username}
          </span>
        </div>

        {/* 연락처 정보 */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '2px',
          fontSize: '13px',
          color: '#595959'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px'
          }}>
            <MailOutlined style={{ color: '#1890ff', fontSize: '12px' }} />
            <span style={{ 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {user.email}
            </span>
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px'
          }}>
            <PhoneOutlined style={{ color: '#52c41a', fontSize: '12px' }} />
            <span>{user.phone}</span>
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px'
          }}>
            <GlobalOutlined style={{ color: '#fa8c16', fontSize: '12px' }} />
            <span style={{ 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {user.website}
            </span>
          </div>
        </div>
      </div>

      {/* 회사 정보 */}
      <div 
        className="company-info"
        style={{ 
          marginLeft: '16px', 
          fontSize: '12px', 
          color: '#8c8c8c',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'center',
          flexShrink: 0,
          minWidth: '100px',
          textAlign: 'right'
        }}
      >
        <div style={{ 
          fontWeight: '500', 
          color: '#595959',
          marginBottom: '2px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          width: '100%'
        }}>
          {user.company?.name}
        </div>
        <div style={{ 
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          width: '100%'
        }}>
          {user.address?.city}
        </div>
      </div>

      {/* 체크박스 */}
      <div style={{ 
        marginLeft: '12px', 
        flexShrink: 0 
      }}>
        <Checkbox
          checked={checked}
          onClick={handleCheckboxClick}
        />
      </div>
    </List.Item>
  )
})

// 개발 환경에서 디버깅을 위한 displayName 설정
UsersItem.displayName = 'UsersItem'

export default UsersItem
