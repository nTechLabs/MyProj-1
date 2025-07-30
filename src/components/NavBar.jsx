/**
 * NavBar 컴포넌트
 * 
 * 주요 기능:
 * - 현재 페이지 제목 표시
 * - 이전/다음 페이지 네비게이션 버튼
 * - Zustand store를 통한 페이지 상태 관리
 * - React Router를 통한 실제 페이지 이동
 * 
 * 디자인 특징:
 * - Ant Design 아이콘과 버튼 사용
 * - 반응형 레이아웃
 * - 일관된 색상 테마 (화이트 텍스트)
 */

import { Button, Typography } from 'antd'
import { LeftOutlined } from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

const { Title } = Typography

/**
 * NavBar 컴포넌트
 * @returns {JSX.Element} 네비게이션 바 컴포넌트
 */
const NavBar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [pageTitle, setPageTitle] = useState('MyProj-1')
  
  // 현재 경로에 따른 페이지 제목 설정
  useEffect(() => {
    const path = location.pathname
    let title = 'MyProj-1'
    
    if (path.includes('/users')) {
      title = 'Users'
    } else if (path.includes('/posts')) {
      title = 'Posts'
    } else if (path.includes('/comments')) {
      title = 'Comments'
    } else if (path.includes('/todos')) {
      title = 'Todos'
    } else if (path.includes('/photos')) {
      title = 'Photos'
    } else if (path.includes('/calendar')) {
      title = 'Calendar'
    } else if (path.includes('/counter')) {
      title = 'Counter'
    }
    
    setPageTitle(title)
  }, [location.pathname])
  
  /**
   * 브라우저 이전 페이지로 이동 핸들러
   */
  const handleGoBack = () => {
    navigate(-1) // React Router의 뒤로가기 기능
  }
  
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      width: '100%',
      height: '100%',
      padding: '0 4px' // 전체 패딩 줄임 (8px -> 4px)
    }}>
      {/* 이전 페이지 버튼 */}
      <Button
        type="text"
        icon={<LeftOutlined />}
        onClick={handleGoBack}
        style={{ 
          color: 'white',
          border: 'none',
          height: '36px',
          minWidth: '36px',
          width: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      />
      
      {/* 현재 페이지 제목 */}
      <div style={{ 
        flex: 1, 
        textAlign: 'center',
        margin: '0 8px', // 좌우 마진 더 줄임 (16px -> 8px)
        minWidth: 0, // flex 아이템의 최소 너비를 0으로 설정하여 축소 허용
        overflow: 'hidden', // 오버플로우 숨김
        maxWidth: 'calc(100% - 40px)' // 최대 너비 제한으로 좌측 버튼 영역만 확보
      }}>
        <Title 
          level={2} 
          style={{ 
            color: 'white', 
            margin: 0,
            fontSize: '16px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: '1.1'
          }}
        >
          {pageTitle}
        </Title>
        
        {/* 부제목 - 현재 경로 표시 */}
        <div style={{
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '10px',
          marginTop: '0px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {location.pathname}
        </div>
      </div>
    </div>
  )
}

export default NavBar
