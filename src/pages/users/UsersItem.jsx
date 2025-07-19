import { List, Checkbox, Avatar } from 'antd'
import { UserOutlined, MailOutlined, PhoneOutlined, GlobalOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import useCheckedStore from '../../store/useCheckedStore'

/**
 * 개별 사용자 항목을 표시하는 컴포넌트
 * 체크박스와 항목 내용으로 구성
 * 항목 클릭 시 상세 페이지로 이동
 */
const UsersItem = ({ user }) => {
  const navigate = useNavigate()
  const { isChecked, toggleCheck } = useCheckedStore()

  const checked = isChecked(user.id)

  // 체크박스 클릭 핸들러 (이벤트 전파 방지)
  const handleCheckboxClick = (e) => {
    e.stopPropagation()
    toggleCheck(user.id)
  }

  // 항목 클릭 핸들러 (상세 페이지로 이동)
  const handleItemClick = () => {
    navigate(`/users/user/${user.id}`)
  }

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
          style={{ transform: 'scale(1.2)' }}
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
              fontSize: '20px'
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </Avatar>
        }
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
              {user.name}
            </span>
            <span style={{ fontSize: '14px', color: '#666', fontWeight: 'normal' }}>
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
}

export default UsersItem
