import React, { useCallback } from 'react'
import { List, Checkbox, Typography, Tag, Image } from 'antd'
import { CameraOutlined, PictureOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import usePhotosCheckedStore from '../../store/usePhotosCheckedStore'

const { Text } = Typography

/**
 * 개별 Photo 항목 컴포넌트 (최적화)
 * React.memo로 불필요한 리렌더링 방지
 */
const PhotosItem = React.memo(({ photo }) => {
  const navigate = useNavigate()
  const { checkedIds, toggleCheck } = usePhotosCheckedStore()

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
      className={`list-item-base ${isChecked ? 'checked' : ''}`}
      onClick={handleItemClick}
      style={{ cursor: 'pointer' }}
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
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Image
              src={photo.thumbnailUrl}
              alt={photo.title}
              className="photo-thumbnail"
              placeholder={
                <div style={{ 
                  width: 60, 
                  height: 60, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px'
                }}>
                  <PictureOutlined style={{ fontSize: 24, color: '#d9d9d9' }} />
                </div>
              }
              preview={{
                src: photo.url
              }}
              style={{ cursor: 'pointer' }}
              onClick={(e) => e.stopPropagation()}
            />
            <span className="album-badge">
              {photo.albumId}
            </span>
          </div>
        }
        title={
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', flexWrap: 'wrap' }}>
            <Text strong className="item-meta-title" style={{ color: '#333', flex: '1 1 auto', minWidth: 0 }}>
              {truncatedTitle}
            </Text>
            <Tag 
              icon={<CameraOutlined />} 
              color="orange" 
              className="item-tag"
              style={{ flexShrink: 0 }}
            >
              ID: {photo.id}
            </Tag>
          </div>
        }
        description={
          <div className="item-meta-description" style={{ marginTop: '4px' }}>
            <div style={{ marginBottom: '2px' }}>
              <Text type="secondary" style={{ fontSize: '13px' }}>
                앨범 ID: {photo.albumId} • 사진 ID: {photo.id}
              </Text>
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: '12px', color: '#999' }}>
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
