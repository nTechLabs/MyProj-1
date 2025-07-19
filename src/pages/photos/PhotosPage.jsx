import React from 'react'
import { Typography } from 'antd'
import PhotosList from './PhotosList'

const { Title } = Typography

/**
 * Photos 메인 페이지 컴포넌트
 * React Query + Zustand 기반 사진 관리 시스템
 */
const PhotosPage = () => {
  return (
    <div style={{ padding: '20px' }}>
      {/* 페이지 헤더 */}
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <Title level={2} style={{ margin: 0, color: '#ff9500' }}>
          📸 Photos Management
        </Title>
        <Typography.Text type="secondary">
          React Query + Zustand 기반 사진 관리 시스템
        </Typography.Text>
      </div>

      {/* Photos 리스트 컴포넌트 */}
      <PhotosList />
    </div>
  )
}

export default PhotosPage
