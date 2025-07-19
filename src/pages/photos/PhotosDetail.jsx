import React, { useState, useEffect, useMemo } from 'react'
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Space, 
  Typography, 
  Alert, 
  Spin,
  Divider,
  Row,
  Col,
  Image,
  Upload
} from 'antd'
import { 
  ArrowLeftOutlined, 
  SaveOutlined, 
  CameraOutlined,
  PictureOutlined,
  UploadOutlined
} from '@ant-design/icons'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  usePhotoQuery, 
  useAddPhotoMutation, 
  useUpdatePhotoMutation 
} from '../../hooks/usePhotosQueries'
import useNotificationStore from '../../store/useNotificationStore'

const { Title, Text } = Typography
const { TextArea } = Input

/**
 * Photo 상세 정보 및 편집 컴포넌트
 * 새 사진 추가와 기존 사진 수정을 모두 처리
 */
const PhotosDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const { showError } = useNotificationStore()

  // 로컬 상태
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [initialValues, setInitialValues] = useState({})

  // 새 사진인지 확인
  const isNewPhoto = id === 'new'

  // 쿼리 및 뮤테이션
  const { 
    data: photo, 
    isLoading: isLoadingPhoto, 
    error: photoError 
  } = usePhotoQuery(id, {
    enabled: !isNewPhoto
  })

  const addPhotoMutation = useAddPhotoMutation()
  const updatePhotoMutation = useUpdatePhotoMutation()

  // 현재 진행 중인 뮤테이션 확인
  const isSubmitting = useMemo(() => 
    addPhotoMutation.isPending || updatePhotoMutation.isPending,
    [addPhotoMutation.isPending, updatePhotoMutation.isPending]
  )

  // 폼 초기값 설정
  useEffect(() => {
    if (isNewPhoto) {
      const newPhotoDefaults = {
        title: '',
        url: '',
        thumbnailUrl: '',
        albumId: 1
      }
      setInitialValues(newPhotoDefaults)
      form.setFieldsValue(newPhotoDefaults)
    } else if (photo) {
      const photoValues = {
        title: photo.title || '',
        url: photo.url || '',
        thumbnailUrl: photo.thumbnailUrl || '',
        albumId: photo.albumId || 1
      }
      setInitialValues(photoValues)
      form.setFieldsValue(photoValues)
    }
  }, [isNewPhoto, photo, form])

  // 폼 값 변경 감지
  const handleFormChange = () => {
    const currentValues = form.getFieldsValue()
    const hasChanges = Object.keys(initialValues).some(
      key => initialValues[key] !== currentValues[key]
    )
    setHasUnsavedChanges(hasChanges)
  }

  // 폼 제출 처리
  const handleSubmit = async (values) => {
    try {
      if (isNewPhoto) {
        const newPhoto = await addPhotoMutation.mutateAsync({
          title: values.title.trim(),
          url: values.url.trim(),
          thumbnailUrl: values.thumbnailUrl.trim(),
          albumId: values.albumId
        })
        navigate(`/photos/photo/${newPhoto.id}`)
      } else {
        await updatePhotoMutation.mutateAsync({
          id: parseInt(id),
          title: values.title.trim(),
          url: values.url.trim(),
          thumbnailUrl: values.thumbnailUrl.trim(),
          albumId: values.albumId
        })
        setHasUnsavedChanges(false)
        setInitialValues(values)
      }
    } catch (error) {
      console.error('저장 실패:', error)
    }
  }

  // 취소 처리
  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('저장하지 않은 변경사항이 있습니다. 정말 취소하시겠습니까?')) {
        if (isNewPhoto) {
          navigate('/photos')
        } else {
          form.setFieldsValue(initialValues)
          setHasUnsavedChanges(false)
        }
      }
    } else {
      navigate('/photos')
    }
  }

  // URL 미리보기
  const currentValues = Form.useWatch([], form)
  const previewUrl = currentValues?.url || photo?.url
  const previewThumbnailUrl = currentValues?.thumbnailUrl || photo?.thumbnailUrl

  // 로딩 상태
  if (isLoadingPhoto) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Spin size="large" tip="사진 정보를 불러오는 중..." />
      </div>
    )
  }

  // 에러 상태
  if (photoError && !isNewPhoto) {
    return (
      <div style={{ padding: '20px' }}>
        <Alert
          message="데이터 로딩 오류"
          description="사진 정보를 불러오는 중 오류가 발생했습니다."
          type="error"
          showIcon
          style={{ marginBottom: '20px' }}
        />
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/photos')}>
          목록으로 돌아가기
        </Button>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {/* 헤더 */}
      <Space style={{ marginBottom: '20px' }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={handleCancel}
        >
          뒤로 가기
        </Button>
      </Space>

      {/* 메인 카드 */}
      <Card
        title={
          <Title level={3} style={{ margin: 0 }}>
            {isNewPhoto ? '새 사진 추가' : '사진 편집'}
          </Title>
        }
        style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
      >
        <Row gutter={[24, 0]}>
          {/* 폼 영역 */}
          <Col xs={24} lg={14}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              onValuesChange={handleFormChange}
              className="detail-form photo-detail-form"
            >
              <Row gutter={[16, 0]}>
                {/* 앨범 ID */}
                <Col xs={24} sm={8}>
                  <Form.Item
                    name="albumId"
                    label={
                      <Space>
                        <PictureOutlined />
                        <Text strong>앨범 ID</Text>
                      </Space>
                    }
                    rules={[
                      { required: true, message: '앨범 ID를 입력해주세요.' },
                      { type: 'number', min: 1, message: '1 이상의 숫자를 입력해주세요.' }
                    ]}
                  >
                    <Input 
                      type="number"
                      placeholder="앨범 ID"
                      min={1}
                    />
                  </Form.Item>
                </Col>

                {/* 제목 */}
                <Col xs={24} sm={16}>
                  <Form.Item
                    name="title"
                    label={<Text strong>제목</Text>}
                    rules={[
                      { required: true, message: '제목을 입력해주세요.' },
                      { min: 2, message: '제목은 최소 2자 이상이어야 합니다.' },
                      { max: 200, message: '제목은 200자를 초과할 수 없습니다.' }
                    ]}
                  >
                    <Input 
                      placeholder="사진 제목을 입력하세요"
                      showCount
                      maxLength={200}
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* 이미지 URL */}
              <Form.Item
                name="url"
                label={<Text strong>이미지 URL</Text>}
                rules={[
                  { required: true, message: '이미지 URL을 입력해주세요.' },
                  { type: 'url', message: '올바른 URL 형식을 입력해주세요.' }
                ]}
              >
                <Input 
                  placeholder="https://example.com/image.jpg"
                  prefix={<CameraOutlined />}
                />
              </Form.Item>

              {/* 썸네일 URL */}
              <Form.Item
                name="thumbnailUrl"
                label={<Text strong>썸네일 URL</Text>}
                rules={[
                  { required: true, message: '썸네일 URL을 입력해주세요.' },
                  { type: 'url', message: '올바른 URL 형식을 입력해주세요.' }
                ]}
              >
                <Input 
                  placeholder="https://example.com/thumbnail.jpg"
                  prefix={<PictureOutlined />}
                />
              </Form.Item>

              <Divider />

              {/* 버튼 영역 */}
              <div style={{ textAlign: 'center' }}>
                <Space size="middle">
                  <Button 
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    취소
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    loading={isSubmitting}
                    disabled={!hasUnsavedChanges && !isNewPhoto}
                    style={{ backgroundColor: '#ff9500', borderColor: '#ff9500' }}
                  >
                    {isNewPhoto ? '사진 추가' : '변경사항 저장'}
                  </Button>
                </Space>
              </div>
            </Form>
          </Col>

          {/* 미리보기 영역 */}
          <Col xs={24} lg={10}>
            <div style={{ position: 'sticky', top: '20px' }}>
              <Title level={4} style={{ marginBottom: '16px' }}>미리보기</Title>
              
              {/* 원본 이미지 미리보기 */}
              {previewUrl && (
                <div style={{ marginBottom: '16px' }}>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>원본 이미지</Text>
                  <Image
                    src={previewUrl}
                    alt="원본 이미지 미리보기"
                    style={{ 
                      width: '100%', 
                      maxHeight: '200px', 
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                    placeholder={
                      <div style={{ 
                        height: '200px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '8px'
                      }}>
                        <CameraOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
                      </div>
                    }
                  />
                </div>
              )}

              {/* 썸네일 미리보기 */}
              {previewThumbnailUrl && (
                <div>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>썸네일</Text>
                  <Image
                    src={previewThumbnailUrl}
                    alt="썸네일 미리보기"
                    style={{ 
                      width: '150px', 
                      height: '150px', 
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                    placeholder={
                      <div style={{ 
                        width: '150px',
                        height: '150px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '8px'
                      }}>
                        <PictureOutlined style={{ fontSize: 32, color: '#d9d9d9' }} />
                      </div>
                    }
                  />
                </div>
              )}

              {!previewUrl && !previewThumbnailUrl && (
                <div style={{ 
                  padding: '40px', 
                  textAlign: 'center', 
                  backgroundColor: '#f9f9f9',
                  borderRadius: '8px',
                  border: '2px dashed #d9d9d9'
                }}>
                  <CameraOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: '16px' }} />
                  <Text type="secondary">URL을 입력하면 미리보기가 표시됩니다</Text>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Card>

      {/* 변경사항 알림 */}
      {hasUnsavedChanges && (
        <Alert
          message="저장되지 않은 변경사항이 있습니다."
          type="warning"
          showIcon
          style={{ marginTop: '16px' }}
        />
      )}
    </div>
  )
}

export default PhotosDetail
