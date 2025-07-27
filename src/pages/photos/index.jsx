import React from 'react'
import { Typography } from 'antd'
import PhotosList from './PhotosList'
import './photos.css'

const { Title } = Typography

/**
 * Photos 메인 페이지 컴포넌트
 * React Query + Zustand 기반 사진 관리 시스템
 */
const PhotosPage = () => {
  return (
    <div className="photos-page">
      {/* 페이지 헤더 */}
      <div className="page-header">
        <Title level={2} className="page-title">
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
