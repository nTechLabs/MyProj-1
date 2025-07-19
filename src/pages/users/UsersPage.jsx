import { Typography, Space, Divider, Button } from 'antd'
import { ArrowLeftOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import UsersList from './UsersList'

const { Title, Paragraph } = Typography

/**
 * Users 메인 컨테이너 컴포넌트
 * React Query + Zustand를 사용한 Users 관리 시스템
 */
const UsersPage = () => {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '20px' }}>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate("/")}
        style={{ marginBottom: '20px' }}
      >
        뒤로 가기
      </Button>
      
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <UserOutlined style={{ fontSize: '64px', color: '#1890ff', marginBottom: '20px' }} />
          <Title level={2}>Users 관리 시스템</Title>
          <Paragraph>
            React Query + Zustand를 사용한 Users CRUD 예제입니다.
            <br />
            JSONPlaceholder API를 통해 사용자를 관리할 수 있습니다.
          </Paragraph>
        </div>
        
        <Divider>React Query + Zustand 상태 관리</Divider>
        <UsersList />
      </Space>
    </div>
  )
}

export default UsersPage
