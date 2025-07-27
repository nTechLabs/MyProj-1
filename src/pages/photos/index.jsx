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
      {/* Photos 리스트 컴포넌트 */}
      <PhotosList />
    </div>
  )
}

export default PhotosPage
