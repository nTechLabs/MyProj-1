/**
 * 메인 애플리케이션 컴포넌트
 * 
 * 주요 기능:
 * - Ant Design Layout을 사용한 전체 페이지 구조 정의
 * - 헤더와 콘텐츠 영역으로 구분된 레이아웃
 * - 프로젝트 타이틀 표시 및 브랜딩
 * - 전역 스타일 적용 (minHeight: 100vh로 전체 화면 활용)
 * - 라우팅 시스템 통합 (AppRoutes 컴포넌트)
 */

import { useEffect } from 'react'
import { Layout, Typography } from 'antd'
import AppRoutes from './routes/AppRoutes'
import { logDataSourceInfo } from './utils/dataSourceManager'
import './App.css'

// Ant Design 컴포넌트 구조분해할당
const { Header, Content } = Layout
const { Title } = Typography

/**
 * App 컴포넌트 - 애플리케이션의 최상위 컴포넌트
 * 
 * Layout 구조:
 * - Header: 프로젝트 제목이 포함된 상단 바
 * - Content: 페이지별 컨텐츠가 렌더링되는 메인 영역
 * 
 * 스타일 특징:
 * - minHeight: 100vh로 전체 화면 높이 활용
 * - background: '#f0f2f5'로 Ant Design 기본 배경색 적용
 * - Header: 다크 테마 (#001529) 적용
 * 
 * @returns {JSX.Element} 레이아웃이 적용된 애플리케이션 구조
 */
function App() {
  // 애플리케이션 시작 시 데이터 소스 정보 로깅
  useEffect(() => {
    logDataSourceInfo()
  }, [])

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      {/* 상단 헤더 - 프로젝트 브랜딩 영역 */}
      <Header style={{ background: '#001529', padding: '0 20px' }}>
        <Title 
          level={2} 
          style={{ color: 'white', margin: '14px 0' }}
        >
          React Vite + Zustand + Ant Design
        </Title>
      </Header>
      
      {/* 메인 콘텐츠 영역 - 라우팅된 페이지들이 렌더링됨 */}
      <Content>
        <AppRoutes />
      </Content>
    </Layout>
  )
}

export default App
