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
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate("/")}
        className="back-button"
      >
        뒤로 가기
      </Button>
      
      <Space direction="vertical" size="large" className="posts-content">
        <div className="posts-header">
          <BookOutlined className="posts-icon" />
          <Title level={2}>Posts 관리 시스템</Title>
          <Paragraph>
            React Query와 Zustand를 활용한 Posts CRUD 예제입니다.
            <br />
            게시글을 조회, 추가, 수정, 삭제할 수 있습니다.
          </Paragraph>
        </div>
        
        <Divider />
        
        {/* Posts 리스트 컴포넌트 */}
        <PostsList />
      </Space>
    </div>
  )
}

export default PostsPage
