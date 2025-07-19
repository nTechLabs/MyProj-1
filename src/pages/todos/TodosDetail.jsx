import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Space, 
  Typography, 
  Spin, 
  Alert,
  Switch,
  InputNumber,
  Divider,
  Tag
} from 'antd'
import { 
  ArrowLeftOutlined, 
  SaveOutlined, 
  CheckSquareOutlined,
  UserOutlined,
  FileTextOutlined
} from '@ant-design/icons'
import { useTodoQuery, useAddTodoMutation, useUpdateTodoMutation } from '../../hooks/useTodosQueries'

const { Title } = Typography
const { TextArea } = Input

/**
 * 할일 상세 정보 표시 및 편집 컴포넌트
 * 새 항목 추가 모드 (id === 'new') 지원
 * React Query를 사용한 데이터 조회, 추가, 수정
 */
const TodosDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [hasChanges, setHasChanges] = useState(false)

  const isNewTodo = id === 'new'

  // React Query 훅들
  const { data: todo, isLoading, error } = useTodoQuery(id, { enabled: !isNewTodo })
  const addTodoMutation = useAddTodoMutation()
  const updateTodoMutation = useUpdateTodoMutation()

  // 폼 필드 변경 감지
  const handleFormChange = () => {
    setHasChanges(true)
  }

  // 폼 초기값 설정
  useEffect(() => {
    if (todo && !isNewTodo) {
      form.setFieldsValue({
        title: todo.title,
        completed: todo.completed,
        userId: todo.userId,
      })
      setHasChanges(false)
    } else if (isNewTodo) {
      // 새 할일의 기본값 설정
      form.setFieldsValue({
        title: '',
        completed: false,
        userId: 1,
      })
    }
  }, [todo, form, isNewTodo])

  // 폼 제출 핸들러
  const handleSubmit = async (values) => {
    const todoData = {
      title: values.title,
      completed: values.completed || false,
      userId: values.userId || 1,
    }

    try {
      if (isNewTodo) {
        const result = await addTodoMutation.mutateAsync(todoData)
        navigate(`/todos/todo/${result.id}`)
      } else {
        await updateTodoMutation.mutateAsync({ id, data: todoData })
        setHasChanges(false)
      }
    } catch (error) {
      console.error('Save error:', error)
    }
  }

  // 변경사항 취소
  const handleCancel = () => {
    if (isNewTodo) {
      navigate('/todos')
    } else {
      form.resetFields()
      setHasChanges(false)
    }
  }

  // 뒤로 가기
  const handleBack = () => {
    navigate('/todos')
  }

  // 로딩 상태
  if (isLoading && !isNewTodo) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Spin size="large" />
        <p style={{ marginTop: '20px' }}>할일 정보를 불러오는 중...</p>
      </div>
    )
  }

  // 에러 상태
  if (error && !isNewTodo) {
    return (
      <div style={{ padding: '20px' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={handleBack} style={{ marginBottom: '20px' }}>
          뒤로 가기
        </Button>
        <Alert
          message="오류 발생"
          description="할일 정보를 불러오는데 실패했습니다."
          type="error"
          showIcon
          action={<Button onClick={() => window.location.reload()}>다시 시도</Button>}
        />
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={handleBack}
        style={{ marginBottom: '20px' }}
      >
        뒤로 가기
      </Button>

      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <CheckSquareOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }} />
            <Title level={2}>
              {isNewTodo ? '새 할일 추가' : '할일 정보 수정'}
            </Title>
            
            {!isNewTodo && todo && (
              <div style={{ marginTop: '16px' }}>
                <Tag color={todo.completed ? 'success' : 'processing'} style={{ fontSize: '14px', padding: '4px 12px' }}>
                  {todo.completed ? '완료됨' : '진행중'}
                </Tag>
              </div>
            )}
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            onValuesChange={handleFormChange}
            requiredMark="optional"
          >
            <Divider orientation="left">
              <Space>
                <FileTextOutlined />
                할일 정보
              </Space>
            </Divider>

            <Form.Item
              name="title"
              label="할일 제목"
              rules={[
                { required: true, message: '할일 제목을 입력해주세요.' },
                { min: 3, message: '할일 제목은 최소 3자 이상이어야 합니다.' },
                { max: 200, message: '할일 제목은 200자를 초과할 수 없습니다.' }
              ]}
            >
              <TextArea
                rows={3}
                placeholder="할일 제목을 입력하세요"
                showCount
                maxLength={200}
              />
            </Form.Item>

            <Form.Item
              name="completed"
              label="완료 상태"
              valuePropName="checked"
            >
              <Switch 
                checkedChildren="완료됨" 
                unCheckedChildren="진행중"
                size="default"
              />
            </Form.Item>

            <Divider orientation="left">
              <Space>
                <UserOutlined />
                사용자 정보
              </Space>
            </Divider>

            <Form.Item
              name="userId"
              label="사용자 ID"
              rules={[
                { required: true, message: '사용자 ID를 입력해주세요.' },
                { type: 'number', min: 1, message: '사용자 ID는 1 이상이어야 합니다.' }
              ]}
            >
              <InputNumber
                placeholder="사용자 ID를 입력하세요"
                style={{ width: '100%' }}
                min={1}
                max={10}
              />
            </Form.Item>

            {/* 할일 ID 표시 (수정 모드에서만) */}
            {!isNewTodo && todo && (
              <Form.Item label="할일 ID">
                <Input value={todo.id} disabled />
              </Form.Item>
            )}

            {/* 버튼 그룹 */}
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <Space size="middle">
                <Button 
                  onClick={handleCancel}
                  disabled={addTodoMutation.isPending || updateTodoMutation.isPending}
                >
                  취소
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={addTodoMutation.isPending || updateTodoMutation.isPending}
                  disabled={!isNewTodo && !hasChanges}
                >
                  {isNewTodo ? '할일 추가' : '변경사항 저장'}
                </Button>
              </Space>
            </div>
          </Form>
        </Space>
      </Card>
    </div>
  )
}

export default TodosDetail
