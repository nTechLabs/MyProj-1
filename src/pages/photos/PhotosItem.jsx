import React, { useCallback } from 'react'
import { List, Checkbox, Typography, Tag, Image } from 'antd'
import { CameraOutlined, PictureOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import usePhotosStore from '../../store/usePhotosStore'

const { Text } = Typography

/**
 * 개별 Photo 항목 컴포넌트 (최적화)
 * React.memo로 불필요한 리렌더링 방지
 */
const PhotosItem = React.memo(({ photo }) => {
  const navigate = useNavigate()
  const { checkedIds, toggleCheck } = usePhotosStore()

  // 체크 상태
  const isChecked = checkedIds.has(photo.id) // Set 객체이므로 has() 메서드 사용

  // 이벤트 핸들러
  const handleCheck = useCallback((e) => {
    e.stopPropagation()
    toggleCheck(photo.id)
  }, [photo.id, toggleCheck])

  const handleItemClick = useCallback(() => {
    navigate(`/photos/photo/${photo.id}`)
  }, [photo.id, navigate])

  // 제목 짧게 표시 (성능 최적화)
  const truncatedTitle = photo.title?.length > 50 
    ? `${photo.title.substring(0, 50)}...` 
    : photo.title

  return (
    <List.Item 
      className={`list-item-base list-item-clickable ${isChecked ? 'checked' : ''}`}
      onClick={handleItemClick}
    >
      {/* 체크박스 */}
      <div className="checkbox-container" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={isChecked}
          onChange={handleCheck}
        />
      </div>

      {/* 사진 정보 */}
      <List.Item.Meta
        avatar={
          <div className="avatar-container">
            <Image
              src={photo.thumbnailUrl}
              alt={photo.title}
              className="photo-thumbnail image-clickable"
              placeholder={
                <div className="image-placeholder">
                  <PictureOutlined className="placeholder-icon" />
                </div>
              }
              preview={{
                src: photo.url
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <span className="album-badge">
              {photo.albumId}
            </span>
          </div>
        }
        title={
          <div className="title-container">
            <Text strong className="item-meta-title">
              {truncatedTitle}
            </Text>
            <Tag 
              icon={<CameraOutlined />} 
              color="orange" 
              className="item-tag item-tag-no-shrink"
            >
              ID: {photo.id}
            </Tag>
          </div>
        }
        description={
          <div className="item-meta-description">
            <div className="description-first-line">
              <Text type="secondary" className="description-text-large">
                앨범 ID: {photo.albumId} • 사진 ID: {photo.id}
              </Text>
            </div>
            <div>
              <Text type="secondary" className="description-text-small">
                URL: {photo.url?.substring(0, 50)}...
              </Text>
            </div>
          </div>
        }
      />
    </List.Item>
  )
})

PhotosItem.displayName = 'PhotosItem'

export default PhotosItem
