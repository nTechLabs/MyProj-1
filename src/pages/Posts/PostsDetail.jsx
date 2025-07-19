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
  Col
} from 'antd'
import { 
  ArrowLeftOutlined, 
  SaveOutlined, 
  UserOutlined 
} from '@ant-design/icons'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  usePostQuery, 
  useAddPostMutation, 
  useUpdatePostMutation 
} from '../../hooks/usePostsQueries'
import useNotificationStore from '../../store/useNotificationStore'

const { Title, Text } = Typography
const { TextArea } = Input

/**
 * Post 상세 정보 및 편집 컴포넌트
 * 새 게시글 추가와 기존 게시글 수정을 모두 처리
 */
const PostsDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const { showError } = useNotificationStore()

  // 로컬 상태
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [initialValues, setInitialValues] = useState({})

  // 새 게시글인지 확인
  const isNewPost = id === 'new'

  // 쿼리 및 뮤테이션
  const { 
    data: post, 
    isLoading: isLoadingPost, 
    error: postError 
  } = usePostQuery(id, {
    enabled: !isNewPost
  })

  const addPostMutation = useAddPostMutation()
  const updatePostMutation = useUpdatePostMutation()

  // 현재 진행 중인 뮤테이션 확인
  const isSubmitting = useMemo(() => 
    addPostMutation.isPending || updatePostMutation.isPending,
    [addPostMutation.isPending, updatePostMutation.isPending]
  )

  // 폼 초기값 설정
  useEffect(() => {
    if (isNewPost) {
      const newPostDefaults = {
        title: '',
        body: '',
        userId: 1 // 기본 사용자 ID
      }
      setInitialValues(newPostDefaults)
      form.setFieldsValue(newPostDefaults)
    } else if (post) {
      const postValues = {
        title: post.title || '',
        body: post.body || '',
        userId: post.userId || 1
      }
      setInitialValues(postValues)
      form.setFieldsValue(postValues)
    }
  }, [isNewPost, post, form])

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
      if (isNewPost) {
        const newPost = await addPostMutation.mutateAsync({
          title: values.title.trim(),
          body: values.body.trim(),
          userId: values.userId
        })
        navigate(`/posts/post/${newPost.id}`)
      } else {
        await updatePostMutation.mutateAsync({
          id: parseInt(id),
          title: values.title.trim(),
          body: values.body.trim(),
          userId: values.userId
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
        if (isNewPost) {
          navigate('/posts')
        } else {
          form.setFieldsValue(initialValues)
          setHasUnsavedChanges(false)
        }
      }
    } else {
      navigate('/posts')
    }
  }

  // 로딩 상태
  if (isLoadingPost) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Spin size="large" tip="게시글 정보를 불러오는 중..." />
      </div>
    )
  }

  // 에러 상태
  if (postError && !isNewPost) {
    return (
      <div style={{ padding: '20px' }}>
        <Alert
          message="데이터 로딩 오류"
          description="게시글 정보를 불러오는 중 오류가 발생했습니다."
          type="error"
          showIcon
          style={{ marginBottom: '20px' }}
        />
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/posts')}>
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
            {isNewPost ? '새 게시글 작성' : '게시글 편집'}
          </Title>
        }
        style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onValuesChange={handleFormChange}
          className="detail-form post-detail-form"
        >
          <Row gutter={[16, 0]}>
            {/* 사용자 ID */}
            <Col xs={24} sm={8}>
              <Form.Item
                name="userId"
                label={
                  <Space>
                    <UserOutlined />
                    <Text strong>사용자 ID</Text>
                  </Space>
                }
                rules={[
                  { required: true, message: '사용자 ID를 입력해주세요.' },
                  { type: 'number', min: 1, message: '1 이상의 숫자를 입력해주세요.' }
                ]}
              >
                <Input 
                  type="number"
                  placeholder="사용자 ID"
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
                  { max: 100, message: '제목은 100자를 초과할 수 없습니다.' }
                ]}
              >
                <Input 
                  placeholder="게시글 제목을 입력하세요"
                  showCount
                  maxLength={100}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* 내용 */}
          <Form.Item
            name="body"
            label={<Text strong>내용</Text>}
            rules={[
              { required: true, message: '내용을 입력해주세요.' },
              { min: 10, message: '내용은 최소 10자 이상이어야 합니다.' },
              { max: 1000, message: '내용은 1000자를 초과할 수 없습니다.' }
            ]}
          >
            <TextArea
              rows={6}
              placeholder="게시글 내용을 입력하세요"
              showCount
              maxLength={1000}
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
                disabled={!hasUnsavedChanges && !isNewPost}
              >
                {isNewPost ? '게시글 작성' : '변경사항 저장'}
              </Button>
            </Space>
          </div>
        </Form>
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

export default PostsDetail
