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

import { Button, Typography, Space } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import useNavigationStore from '../store/useNavigationStore'

const { Title } = Typography

/**
 * NavBar 컴포넌트
 * @returns {JSX.Element} 네비게이션 바 컴포넌트
 */
const NavBar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Zustand store 상태 및 액션
  const {
    getCurrentPage,
    setCurrentPath,
    goToPreviousPage,
    goToNextPage,
    hasPreviousPage,
    hasNextPage
  } = useNavigationStore()
  
  const currentPage = getCurrentPage()
  
  // 라우트 변경 시 현재 페이지 업데이트
  useEffect(() => {
    setCurrentPath(location.pathname)
  }, [location.pathname, setCurrentPath])
  
  /**
   * 이전 페이지로 이동 핸들러
   */
  const handlePreviousPage = () => {
    const previousPath = goToPreviousPage()
    navigate(previousPath)
  }
  
  /**
   * 다음 페이지로 이동 핸들러
   */
  const handleNextPage = () => {
    const nextPath = goToNextPage()
    navigate(nextPath)
  }
  
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      width: '100%',
      height: '100%'
    }}>
      {/* 이전 페이지 버튼 */}
      <Button
        type="text"
        icon={<LeftOutlined />}
        onClick={handlePreviousPage}
        style={{ 
          color: 'white',
          border: 'none',
          height: '40px',
          minWidth: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        disabled={!hasPreviousPage() && false} // 순환 네비게이션이므로 비활성화하지 않음
      />
      
      {/* 현재 페이지 제목 */}
      <div style={{ 
        flex: 1, 
        textAlign: 'center',
        margin: '0 16px'
      }}>
        <Title 
          level={2} 
          style={{ 
            color: 'white', 
            margin: 0,
            fontSize: '20px',
            fontWeight: 'bold'
          }}
        >
          {currentPage.displayTitle}
        </Title>
        
        {/* 부제목 - 현재 경로 표시 */}
        <div style={{
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '12px',
          marginTop: '2px'
        }}>
          {currentPage.path}
        </div>
      </div>
      
      {/* 다음 페이지 버튼 */}
      <Button
        type="text"
        icon={<RightOutlined />}
        onClick={handleNextPage}
        style={{ 
          color: 'white',
          border: 'none',
          height: '40px',
          minWidth: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        disabled={!hasNextPage() && false} // 순환 네비게이션이므로 비활성화하지 않음
      />
    </div>
  )
}

export default NavBar
