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
  Row,
  Col,
  Divider
} from 'antd'
import { 
  ArrowLeftOutlined, 
  SaveOutlined, 
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  HomeOutlined,
  BankOutlined
} from '@ant-design/icons'
import { useUserQuery, useAddUserMutation, useUpdateUserMutation } from '../../hooks/useUsersQueries'

const { Title } = Typography

/**
 * 사용자 상세 정보 표시 및 편집 컴포넌트
 * 새 항목 추가 모드 (id === 'new') 지원
 * React Query를 사용한 데이터 조회, 추가, 수정
 */
const UsersDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [hasChanges, setHasChanges] = useState(false)

  const isNewUser = id === 'new'

  // React Query 훅들
  const { data: user, isLoading, error } = useUserQuery(id, { enabled: !isNewUser })
  const addUserMutation = useAddUserMutation()
  const updateUserMutation = useUpdateUserMutation()

  // 폼 필드 변경 감지
  const handleFormChange = () => {
    setHasChanges(true)
  }

  // 폼 초기값 설정
  useEffect(() => {
    if (user && !isNewUser) {
      form.setFieldsValue({
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        website: user.website,
        street: user.address?.street,
        suite: user.address?.suite,
        city: user.address?.city,
        zipcode: user.address?.zipcode,
        companyName: user.company?.name,
        companyCatchPhrase: user.company?.catchPhrase,
        companyBs: user.company?.bs,
      })
      setHasChanges(false)
    }
  }, [user, form, isNewUser])

  // 폼 제출 핸들러
  const handleSubmit = async (values) => {
    const userData = {
      name: values.name,
      username: values.username,
      email: values.email,
      phone: values.phone,
      website: values.website,
      address: {
        street: values.street,
        suite: values.suite,
        city: values.city,
        zipcode: values.zipcode,
      },
      company: {
        name: values.companyName,
        catchPhrase: values.companyCatchPhrase,
        bs: values.companyBs,
      }
    }

    try {
      if (isNewUser) {
        const result = await addUserMutation.mutateAsync(userData)
        navigate(`/users/user/${result.id}`)
      } else {
        await updateUserMutation.mutateAsync({ id, data: userData })
        setHasChanges(false)
      }
    } catch (error) {
      console.error('Save error:', error)
    }
  }

  // 변경사항 취소
  const handleCancel = () => {
    if (isNewUser) {
      navigate('/users')
    } else {
      form.resetFields()
      setHasChanges(false)
    }
  }

  // 뒤로 가기
  const handleBack = () => {
    navigate('/users')
  }

  // 로딩 상태
  if (isLoading && !isNewUser) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Spin size="large" />
        <p style={{ marginTop: '20px' }}>사용자 정보를 불러오는 중...</p>
      </div>
    )
  }

  // 에러 상태
  if (error && !isNewUser) {
    return (
      <div style={{ padding: '20px' }}>
        <Button icon={<ArrowLeftOutlined />} onClick={handleBack} style={{ marginBottom: '20px' }}>
          뒤로 가기ㅇㅇㅇ
        </Button>
        <Alert
          message="오류 발생"
          description="사용자 정보를 불러오는데 실패했습니다."
          type="error"
          showIcon
          action={<Button onClick={() => window.location.reload()}>다시 시도</Button>}
        />
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
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
            <UserOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
            <Title level={2}>
              {isNewUser ? '새 사용자 추가' : '사용자 정보 수정'}
            </Title>
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
                <UserOutlined />
                기본 정보
              </Space>
            </Divider>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="name"
                  label="이름"
                  rules={[{ required: true, message: '이름을 입력해주세요.' }]}
                >
                  <Input placeholder="이름을 입력하세요" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="username"
                  label="사용자명"
                  rules={[{ required: true, message: '사용자명을 입력해주세요.' }]}
                >
                  <Input placeholder="사용자명을 입력하세요" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="email"
                  label="이메일"
                  rules={[
                    { required: true, message: '이메일을 입력해주세요.' },
                    { type: 'email', message: '올바른 이메일 형식이 아닙니다.' }
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="이메일을 입력하세요" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="phone"
                  label="전화번호"
                  rules={[{ required: true, message: '전화번호를 입력해주세요.' }]}
                >
                  <Input prefix={<PhoneOutlined />} placeholder="전화번호를 입력하세요" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="website"
              label="웹사이트"
            >
              <Input prefix={<GlobalOutlined />} placeholder="웹사이트를 입력하세요" />
            </Form.Item>

            <Divider orientation="left">
              <Space>
                <HomeOutlined />
                주소 정보
              </Space>
            </Divider>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item name="street" label="거리">
                  <Input placeholder="거리를 입력하세요" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="suite" label="상세 주소">
                  <Input placeholder="상세 주소를 입력하세요" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item name="city" label="도시">
                  <Input placeholder="도시를 입력하세요" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="zipcode" label="우편번호">
                  <Input placeholder="우편번호를 입력하세요" />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">
              <Space>
                <BankOutlined />
                회사 정보
              </Space>
            </Divider>

            <Form.Item name="companyName" label="회사명">
              <Input placeholder="회사명을 입력하세요" />
            </Form.Item>

            <Form.Item name="companyCatchPhrase" label="회사 슬로건">
              <Input placeholder="회사 슬로건을 입력하세요" />
            </Form.Item>

            <Form.Item name="companyBs" label="사업 분야">
              <Input.TextArea 
                rows={2} 
                placeholder="사업 분야를 입력하세요" 
              />
            </Form.Item>

            {/* 버튼 그룹 */}
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <Space size="middle">
                <Button 
                  onClick={handleCancel}
                  disabled={addUserMutation.isPending || updateUserMutation.isPending}
                >
                  취소
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={addUserMutation.isPending || updateUserMutation.isPending}
                  disabled={!isNewUser && !hasChanges}
                >
                  {isNewUser ? '사용자 추가' : '변경사항 저장'}
                </Button>
              </Space>
            </div>
          </Form>
        </Space>
      </Card>
    </div>
  )
}

export default UsersDetail
