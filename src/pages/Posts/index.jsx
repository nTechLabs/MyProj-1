import { Typography, Space, Divider, Button } from 'antd'
import { ArrowLeftOutlined, BookOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import PostsList from './PostsList'
import './posts.css'

const { Title, Paragraph } = Typography

/**
 * Posts 메인 컨테이너 컴포넌트
 * React Query + Zustand를 사용한 Posts 관리 시스템
 */
const PostsPage = () => {
  const navigate = useNavigate()

  return (
    <div className="posts-container">
      <Space direction="vertical" size="large" className="posts-content">
        {/* Posts 리스트 컴포넌트 */}
        <PostsList />
      </Space>
    </div>
  )
}

export default PostsPage
