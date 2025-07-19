import { Card, Typography, Button } from 'antd'
import { ArrowLeftOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../routes/routes'

const { Title, Paragraph } = Typography

const UsersPage = () => {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '20px' }}>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate(ROUTES.HOME)}
        style={{ marginBottom: '20px' }}
      >
        뒤로 가기
      </Button>
      
      <Card>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <UserOutlined style={{ fontSize: '64px', color: '#1890ff', marginBottom: '20px' }} />
          <Title level={2}>사용자 페이지</Title>
          <Paragraph>
            이곳은 사용자 관련 기능들을 구현할 수 있는 페이지입니다.
            <br />
            향후 사용자 목록, 프로필 관리 등의 기능을 추가할 수 있습니다.
          </Paragraph>
        </div>
      </Card>
    </div>
  )
}

export default UsersPage
