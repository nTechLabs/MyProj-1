import React, { useState, useMemo, useCallback } from 'react'
import { 
  List, 
  Button, 
  Alert, 
  Spin, 
  FloatButton, 
  Input, 
  Select, 
  Space,
  Typography,
  Checkbox,
  Empty
} from 'antd'
import { 
  PlusOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  CameraOutlined,
  InboxOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { usePhotosQuery, useDeletePhotosMutation } from '../../hooks/usePhotosQueries'
import usePhotosCheckedStore from '../../store/usePhotosCheckedStore'
import PhotosItem from './PhotosItem'
import './photos-list.css'

const { Text } = Typography
const { Option } = Select

/**
 * Photos 목록 컴포넌트 (최적화)
 * React Query를 사용한 데이터 조회 및 표시
 */
const PhotosList = React.memo(() => {
  const navigate = useNavigate()
  
  // 로컬 상태
  const [searchText, setSearchText] = useState('')
  const [albumFilter, setAlbumFilter] = useState('all')

  // React Query 훅
  const { 
    data: photos = [], 
    isLoading, 
    error 
  } = usePhotosQuery()

  const deletePhotosMutation = useDeletePhotosMutation()

  // Photos 전용 Zustand 스토어
  const { 
    checkedIds, 
    toggleAllCheck,
    clearChecked,
    isAllChecked,
    isIndeterminate,
    getCheckedCount
  } = usePhotosCheckedStore()

  // 필터링된 사진 목록 (최적화)
  const filteredPhotos = useMemo(() => {
    let filtered = photos

    // 검색 필터링
    if (searchText) {
      const searchLower = searchText.toLowerCase()
      filtered = filtered.filter(photo =>
        photo.title?.toLowerCase().includes(searchLower) ||
        photo.id?.toString().includes(searchText)
      )
    }

    // 앨범 필터링
    if (albumFilter !== 'all') {
      filtered = filtered.filter(photo => 
        photo.albumId?.toString() === albumFilter
      )
    }

    return filtered
  }, [photos, searchText, albumFilter])

  // 앨범 목록 (최적화)
  const albumOptions = useMemo(() => {
    const albums = [...new Set(photos.map(photo => photo.albumId))]
      .sort((a, b) => a - b)
      .slice(0, 10) // 처음 10개 앨범만 표시 (성능 최적화)
    
    return albums.map(albumId => ({
      label: `앨범 ${albumId}`,
      value: albumId.toString()
    }))
  }, [photos])

  // 이벤트 핸들러
  const handleSearch = useCallback((value) => {
    setSearchText(value)
  }, [])

  const handleAlbumFilterChange = useCallback((value) => {
    setAlbumFilter(value)
    clearChecked()
  }, [clearChecked])

  const handleSelectAll = useCallback(() => {
    const currentPageIds = filteredPhotos.map(photo => photo.id)
    toggleAllCheck(currentPageIds)
  }, [filteredPhotos, toggleAllCheck])

  const handleDelete = useCallback(() => {
    if (checkedIds.size === 0) return

    if (window.confirm(`선택된 ${checkedIds.size}개의 사진을 삭제하시겠습니까?`)) {
      deletePhotosMutation.mutate(Array.from(checkedIds)) // Set을 배열로 변환
    }
  }, [checkedIds, deletePhotosMutation])

  const handleAddNew = useCallback(() => {
    navigate('/photos/photo/new')
  }, [navigate])

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <div className="loading-text">사진을 불러오는 중...</div>
      </div>
    )
  }

  // 에러 상태
  if (error) {
    return (
      <Alert
        message="데이터 로딩 실패"
        description="사진 목록을 불러오는 중 오류가 발생했습니다."
        type="error"
        showIcon
        className="error-alert"
        style={{ margin: '20px' }}
      />
    )
  }

  const checkedCount = getCheckedCount()
  const hasCheckedItems = checkedCount > 0
  const totalCount = filteredPhotos.length

  return (
    <div className={`page-list-container ${hasCheckedItems ? 'has-bottom-action' : ''}`}>
      {/* 검색 및 필터 컨트롤 */}
      <div className="search-filter-container">
        <Space size="middle" wrap style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space wrap>
            <Input
              placeholder="제목 또는 ID로 검색..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 250 }}
              className="search-input"
              allowClear
            />
            
            <Select
              value={albumFilter}
              onChange={handleAlbumFilterChange}
              style={{ width: 140 }}
              className="filter-select"
            >
              <Option value="all">전체 앨범</Option>
              {albumOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Space>

          <Text type="secondary">
            총 {totalCount}개 사진
          </Text>
        </Space>
      </div>

      {/* 전체 선택 컨트롤 */}
      {totalCount > 0 && (
        <div className="select-all-container">
          <div className="select-all-left">
            <Checkbox
              indeterminate={isIndeterminate}
              checked={isAllChecked(filteredPhotos.map(p => p.id))}
              onChange={handleSelectAll}
            >
              전체 선택
            </Checkbox>
          </div>
          
          {hasCheckedItems && (
            <div className="select-stats">
              <Text strong style={{ color: '#ff9500' }}>
                {checkedCount}개 선택됨
              </Text>
            </div>
          )}
        </div>
      )}

      {/* 사진 목록 */}
      {totalCount === 0 ? (
        <div className="empty-container">
          <Empty
            image={<InboxOutlined className="empty-icon" style={{ fontSize: 64, color: '#ff9500' }} />}
            description={
              <span className="empty-text">
                {searchText || albumFilter !== 'all' 
                  ? '검색 조건에 맞는 사진이 없습니다' 
                  : '사진이 없습니다'
                }
              </span>
            }
          />
        </div>
      ) : (
        <List
          className={`page-list photos-list list-scroll-hide ${hasCheckedItems ? 'has-bottom-action' : ''}`}
          itemLayout="horizontal"
          dataSource={filteredPhotos}
          renderItem={(photo) => (
            <PhotosItem key={photo.id} photo={photo} />
          )}
          pagination={{
            pageSize: 15,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}개`,
            pageSizeOptions: ['10', '15', '20', '30', '50'],
            style: { textAlign: 'center', marginTop: '24px' }
          }}
          style={{ 
            minHeight: '400px' // 최소 높이 보장
          }}
        />
      )}

      {/* 추가 버튼 */}
      <FloatButton
        icon={<PlusOutlined />}
        tooltip="새 사진 추가"
        onClick={handleAddNew}
        className={hasCheckedItems ? 'float-button-with-action' : 'float-button-default'}
      />

      {/* 삭제 버튼 (선택된 항목이 있을 때만 표시) */}
      {hasCheckedItems && (
        <div className="fixed-delete-button">
          <Button
            type="primary"
            danger
            size="large"
            icon={<DeleteOutlined />}
            onClick={handleDelete}
            loading={deletePhotosMutation.isPending}
            style={{
              borderRadius: '25px',
              padding: '0 24px',
              height: '50px',
              fontSize: '16px',
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
            }}
          >
            선택된 {checkedCount}개 삭제
          </Button>
        </div>
      )}
    </div>
  )
})

PhotosList.displayName = 'PhotosList'

export default PhotosList
