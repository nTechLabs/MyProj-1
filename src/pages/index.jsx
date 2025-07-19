import { Typography, Space, Button } from 'antd'
import { UserOutlined, NumberOutlined, CheckSquareOutlined, BookOutlined, CommentOutlined, CameraOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

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
            <Link to="/counter">
              <Button 
                type="primary" 
                icon={<NumberOutlined />}
                size="large"
              >
                Counter 페이지
              </Button>
            </Link>
            <Link to="/users">
              <Button 
                type="default" 
                icon={<UserOutlined />}
                size="large"
              >
                Users 페이지
              </Button>
            </Link>
            <Link to="/posts">
              <Button 
                type="default" 
                icon={<BookOutlined />}
                size="large"
              >
                Posts 페이지
              </Button>
            </Link>
            <Link to="/todos">
              <Button 
                type="default" 
                icon={<CheckSquareOutlined />}
                size="large"
              >
                Todos 페이지
              </Button>
            </Link>
            <Link to="/comments">
              <Button 
                type="default" 
                icon={<CommentOutlined />}
                size="large"
              >
                Comments 페이지
              </Button>
            </Link>
            <Link to="/photos">
              <Button 
                type="default" 
                icon={<CameraOutlined />}
                size="large"
                style={{ borderColor: '#ff9500', color: '#ff9500' }}
              >
                Photos 페이지
              </Button>
            </Link>
          </Space>
        </div>
      </Space>
    </div>
  )
}

export default HomePage
