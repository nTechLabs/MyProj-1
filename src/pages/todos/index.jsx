import { Typography, Space, Divider, Button } from 'antd'
import { ArrowLeftOutlined, CheckSquareOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import TodosList from './TodosList'
import './todos.css'

const { Title, Paragraph } = Typography

/**
 * Todos 메인 컨테이너 컴포넌트
 * React Query + Zustand를 사용한 Todos 관리 시스템
 */
const TodosPage = () => {
  const navigate = useNavigate()

  return (
    <div className="todos-page-container">
      <Space direction="vertical" size="large" className="todos-page-space">
        <TodosList />
      </Space>
    </div>
  )
}

export default TodosPage
