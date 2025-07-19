/**
 * CommentsDetail - 댓글 상세/편집 컴포넌트
 * @description 댓글 조회, 추가, 수정을 위한 통합 컴포넌트
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Space, 
  Typography, 
  Alert, 
  Spin,
  InputNumber,
  Tag,
  Divider
} from 'antd'
import { 
  SaveOutlined, 
  UndoOutlined, 
  ArrowLeftOutlined,
  CommentOutlined,
  MailOutlined,
  NumberOutlined
} from '@ant-design/icons'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  useCommentQuery, 
  useAddCommentMutation, 
  useUpdateCommentMutation 
} from '../../hooks/useCommentsQueries'
import '../../styles/pages.css'
import './comments-list.css'

const { Title, Text } = Typography
const { TextArea } = Input

/**
 * 댓글 상세/편집 컴포넌트
 * @returns {JSX.Element} CommentsDetail 컴포넌트
 */
const CommentsDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  
  // 상태 관리
  const [hasChanges, setHasChanges] = useState(false)
  const [initialValues, setInitialValues] = useState({})
  
  // 새 댓글 추가 모드 여부
  const isNewMode = id === 'new'
  
  // React Query 훅
  const {
    data: comment,
    isLoading,
    isError,
    error
  } = useCommentQuery(id, { enabled: !isNewMode })
  
  const addCommentMutation = useAddCommentMutation()
  const updateCommentMutation = useUpdateCommentMutation()

  /**
   * 뮤테이션 로딩 상태
   */
  const isMutating = addCommentMutation.isPending || updateCommentMutation.isPending

  /**
   * 초기값 설정 효과
   */
  useEffect(() => {
    if (isNewMode) {
      const newValues = {
        postId: 1,
        name: '',
        email: '',
        body: ''
      }
      setInitialValues(newValues)
      form.setFieldsValue(newValues)
    } else if (comment) {
      setInitialValues(comment)
      form.setFieldsValue(comment)
    }
  }, [comment, isNewMode, form])

  /**
   * 폼 값 변경 감지
   */
  const handleFormChange = useCallback(() => {
    const currentValues = form.getFieldsValue()
    const changed = JSON.stringify(currentValues) !== JSON.stringify(initialValues)
    setHasChanges(changed)
  }, [form, initialValues])

  /**
   * 폼 제출 핸들러
   * @param {Object} values - 폼 데이터
   */
  const handleSubmit = useCallback(async (values) => {
    try {
      if (isNewMode) {
        await addCommentMutation.mutateAsync(values)
        navigate('/comments')
      } else {
        await updateCommentMutation.mutateAsync({ id: comment.id, data: values })
        setHasChanges(false)
        setInitialValues(values)
      }
    } catch (error) {
      console.error('Submit error:', error)
    }
  }, [isNewMode, comment?.id, addCommentMutation, updateCommentMutation, navigate])

  /**
   * 변경 취소 핸들러
   */
  const handleReset = useCallback(() => {
    form.setFieldsValue(initialValues)
    setHasChanges(false)
  }, [form, initialValues])

  /**
   * 뒤로가기 핸들러
   */
  const handleBack = useCallback(() => {
    if (hasChanges) {
      if (window.confirm('변경사항이 있습니다. 저장하지 않고 나가시겠습니까?')) {
        navigate('/comments')
      }
    } else {
      navigate('/comments')
    }
  }, [hasChanges, navigate])

  /**
   * 폼 검증 규칙
   */
  const validationRules = useMemo(() => ({
    postId: [
      { required: true, message: '게시물 ID를 입력해주세요' },
      { type: 'number', min: 1, message: '유효한 게시물 ID를 입력해주세요' }
    ],
    name: [
      { required: true, message: '댓글 제목을 입력해주세요' },
      { min: 2, message: '댓글 제목은 최소 2글자 이상이어야 합니다' },
      { max: 200, message: '댓글 제목은 최대 200글자까지 입력 가능합니다' }
    ],
    email: [
      { required: true, message: '이메일을 입력해주세요' },
      { type: 'email', message: '올바른 이메일 형식을 입력해주세요' }
    ],
    body: [
      { required: true, message: '댓글 내용을 입력해주세요' },
      { min: 10, message: '댓글 내용은 최소 10글자 이상이어야 합니다' },
      { max: 1000, message: '댓글 내용은 최대 1000글자까지 입력 가능합니다' }
    ]
  }), [])

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <div className="loading-text">댓글 정보를 불러오는 중...</div>
      </div>
    )
  }

  // 에러 상태
  if (isError && !isNewMode) {
    return (
      <Alert
        message="댓글 조회 실패"
        description={error?.message || '댓글 정보를 불러올 수 없습니다.'}
        type="error"
        showIcon
        className="error-alert"
        action={
          <Button onClick={handleBack} type="primary">
            목록으로 돌아가기
          </Button>
        }
      />
    )
  }

  return (
    <div className="comments-page">
      <Card
        title={
          <Space align="center">
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={handleBack}
              type="text"
            />
            <CommentOutlined style={{ color: '#ff9500' }} />
            <Title level={3} style={{ margin: 0 }}>
              {isNewMode ? '새 댓글 추가' : `댓글 #${comment?.id} 편집`}
            </Title>
          </Space>
        }
        extra={
          !isNewMode && comment && (
            <Space>
              <Tag icon={<NumberOutlined />} color="blue">
                Post #{comment.postId}
              </Tag>
              <Tag icon={<CommentOutlined />} color="orange">
                #{comment.id}
              </Tag>
            </Space>
          )
        }
        className="detail-card"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onValuesChange={handleFormChange}
          autoComplete="off"
        >
          <Form.Item
            label="게시물 ID"
            name="postId"
            rules={validationRules.postId}
          >
            <InputNumber
              min={1}
              max={100}
              style={{ width: '100%' }}
              placeholder="연결할 게시물 ID를 입력하세요"
            />
          </Form.Item>

          <Form.Item
            label="댓글 제목"
            name="name"
            rules={validationRules.name}
          >
            <Input
              placeholder="댓글의 제목을 입력하세요"
              showCount
              maxLength={200}
            />
          </Form.Item>

          <Form.Item
            label="이메일"
            name="email"
            rules={validationRules.email}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="이메일 주소를 입력하세요"
            />
          </Form.Item>

          <Form.Item
            label="댓글 내용"
            name="body"
            rules={validationRules.body}
          >
            <TextArea
              rows={6}
              placeholder="댓글 내용을 입력하세요"
              showCount
              maxLength={1000}
            />
          </Form.Item>

          <Divider />

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={isMutating}
                disabled={isNewMode ? false : !hasChanges}
              >
                {isNewMode ? '댓글 추가' : '변경사항 저장'}
              </Button>
              
              {!isNewMode && hasChanges && (
                <Button
                  icon={<UndoOutlined />}
                  onClick={handleReset}
                  disabled={isMutating}
                >
                  변경 취소
                </Button>
              )}
              
              <Button onClick={handleBack} disabled={isMutating}>
                목록으로
              </Button>
            </Space>
          </Form.Item>

          {hasChanges && (
            <Alert
              message="변경된 내용이 있습니다"
              description="저장하지 않으면 변경사항이 사라집니다."
              type="warning"
              showIcon
              style={{ marginTop: 16 }}
            />
          )}
        </Form>
      </Card>
    </div>
  )
}

export default CommentsDetail
