import { Typography, Space, Button } from 'antd'
import { UserOutlined, NumberOutlined, CheckSquareOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { ROUTES } from '../routes/routes'

const { Title, Paragraph } = Typography

const HomePage = () => {
  return (
    <div style={{ padding: '20px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <Title level={3}>프로젝트 데모</Title>
          <Paragraph>
            이 프로젝트는 Zustand로 클라이언트 상태를 관리하며, 
            Ant Design과 React Router를 사용한 예제입니다.
          </Paragraph>
        </div>
        
        {/* 네비게이션 버튼들 */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Space size="middle" wrap>
            <Link to={ROUTES.COUNTER}>
              <Button 
                type="primary" 
                icon={<NumberOutlined />}
                size="large"
              >
                Counter 페이지
              </Button>
            </Link>
            <Link to={ROUTES.USERS}>
              <Button 
                type="default" 
                icon={<UserOutlined />}
                size="large"
              >
                Users 페이지
              </Button>
            </Link>
            <Link to={ROUTES.TODOS}>
              <Button 
                type="default" 
                icon={<CheckSquareOutlined />}
                size="large"
              >
                Todos 페이지
              </Button>
            </Link>
          </Space>
        </div>
      </Space>
    </div>
  )
}

export default HomePage
