import { Typography, Space, Divider, Button } from 'antd'
import { ArrowLeftOutlined, CheckSquareOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import TodosList from './TodosList'
import { ROUTES } from '../../routes/AppRoutes'

const { Title, Paragraph } = Typography

/**
 * Todos 메인 컨테이너 컴포넌트
 * React Query + Zustand를 사용한 Todos 관리 시스템
 */
const TodosPage = () => {
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
      
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <CheckSquareOutlined style={{ fontSize: '64px', color: '#52c41a', marginBottom: '20px' }} />
          <Title level={2}>Todos 관리 시스템</Title>
          <Paragraph>
            React Query + Zustand를 사용한 Todos CRUD 예제입니다.
            <br />
            JSONPlaceholder API를 통해 할일을 관리할 수 있습니다.
          </Paragraph>
        </div>
        
        <Divider>React Query + Zustand 상태 관리</Divider>
        <TodosList />
      </Space>
    </div>
  )
}

export default TodosPage
