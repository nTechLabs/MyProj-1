/**
 * Users 메인 컨테이너 컴포넌트
 * React Query + Zustand를 사용한 Users 관리 시스템
 * 
 * 주요 기능:
 * - 사용자 목록 및 상세 정보 관리
 * - React Query를 통한 서버 상태 관리
 * - Zustand를 통한 클라이언트 상태 관리 (체크박스 선택 등)
 * - 반응형 디자인 및 다크 모드 지원
 * 
 * 컴포넌트 구조:
 * - 뒤로가기 네비게이션
 * - 페이지 헤더 (아이콘, 제목, 설명)
 * - UsersList 컴포넌트 (실제 CRUD 기능)
 */

import { Typography, Space, Divider, Button } from 'antd'
import { ArrowLeftOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import UsersList from './UsersList'
import './users.css' // 통합 스타일시트

const { Title, Paragraph } = Typography
const UsersPage = () => {
  const navigate = useNavigate()

  return (
    <div className="users-page-container">

      
      <Space direction="vertical" size="large" className="users-page-content">
        <UsersList />
      </Space>
    </div>
  )
}

export default UsersPage
