import { Typography, Space, Divider, Button } from 'antd'
import { ArrowLeftOutlined, BookOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import PostsList from './PostsList'

const { Title, Paragraph } = Typography

/**
 * Posts 메인 컨테이너 컴포넌트
 * React Query + Zustand를 사용한 Posts 관리 시스템
 */
const PostsPage = () => {
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
          <BookOutlined style={{ fontSize: '64px', color: '#722ed1', marginBottom: '20px' }} />
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
