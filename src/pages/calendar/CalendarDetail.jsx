import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Form, Input, Button, DatePicker, Select, TimePicker, Alert, Spin, Space, Typography, Row, Col } from 'antd'
import { CalendarOutlined, SaveOutlined, ArrowLeftOutlined, TeamOutlined, BookOutlined, HeartOutlined, TrophyOutlined, ClockCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { useCalendarQuery, useAddCalendarMutation, useUpdateCalendarMutation } from '../../hooks/useCalendarsQueries'
import './calendar.css'

const { TextArea } = Input
const { Option } = Select
const { Title, Text } = Typography

/**
 * 캘린더 상세/편집 컴포넌트
 * 새 일정 추가 및 기존 일정 수정 기능
 * Task 타입별 아이콘과 색상으로 구별
 */
const CalendarDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [hasChanges, setHasChanges] = useState(false)
  const [initialValues, setInitialValues] = useState(null)

  const isNewCalendar = id === 'new'

  // React Query 훅들
  const { data: calendar, isLoading, error } = useCalendarQuery(id)
  const addCalendarMutation = useAddCalendarMutation()
  const updateCalendarMutation = useUpdateCalendarMutation()

  // Task 타입별 설정
  const taskTypeOptions = [
    { value: 'meeting', label: '회의', icon: <TeamOutlined />, color: '#1890ff' },
    { value: 'task', label: '업무', icon: <BookOutlined />, color: '#52c41a' },
    { value: 'personal', label: '개인', icon: <HeartOutlined />, color: '#fa8c16' },
    { value: 'event', label: '이벤트', icon: <TrophyOutlined />, color: '#722ed1' },
    { value: 'reminder', label: '알림', icon: <ClockCircleOutlined />, color: '#eb2f96' }
  ]

  // 우선순위 옵션
  const priorityOptions = [
    { value: 'low', label: '낮음', color: '#52c41a' },
    { value: 'medium', label: '보통', color: '#faad14' },
    { value: 'high', label: '높음', color: '#ff4d4f' }
  ]

  // 폼 데이터 로드
  useEffect(() => {
    if (isNewCalendar) {
      const defaultValues = {
        title: '',
        description: '',
        type: 'task',
        date: dayjs(),
        time: dayjs(),
        location: '',
        priority: 'medium'
      }
      form.setFieldsValue(defaultValues)
      setInitialValues(defaultValues)
    } else if (calendar) {
      const calendarDateTime = dayjs(calendar.date)
      const formValues = {
        title: calendar.title || '',
        description: calendar.description || '',
        type: calendar.type || 'task',
        date: calendarDateTime,
        time: calendarDateTime,
        location: calendar.location || '',
        priority: calendar.priority || 'medium'
      }
      form.setFieldsValue(formValues)
      setInitialValues(formValues)
    }
  }, [calendar, isNewCalendar, form])

  // 폼 값 변경 감지
  const handleFormChange = useCallback(() => {
    if (!initialValues) return

    const currentValues = form.getFieldsValue()
    const changed = Object.keys(initialValues).some(key => {
      if (key === 'date' || key === 'time') {
        return !dayjs(currentValues[key]).isSame(dayjs(initialValues[key]))
      }
      return currentValues[key] !== initialValues[key]
    })
    setHasChanges(changed)
  }, [form, initialValues])

  // 폼 제출
  const handleSubmit = useCallback(async (values) => {
    try {
      // 날짜와 시간을 합쳐서 하나의 datetime으로 생성
      const combinedDateTime = dayjs(values.date)
        .hour(dayjs(values.time).hour())
        .minute(dayjs(values.time).minute())
        .toISOString()

      const calendarData = {
        title: values.title,
        description: values.description,
        type: values.type,
        date: combinedDateTime,
        location: values.location,
        priority: values.priority
      }

      if (isNewCalendar) {
        const result = await addCalendarMutation.mutateAsync(calendarData)
        navigate(`/calendar/calendar/${result.id}`)
      } else {
        await updateCalendarMutation.mutateAsync({ id, data: calendarData })
        setHasChanges(false)
      }
    } catch (error) {
      console.error('Calendar save error:', error)
    }
  }, [id, isNewCalendar, addCalendarMutation, updateCalendarMutation, navigate])

  // 취소 버튼
  const handleCancel = useCallback(() => {
    if (hasChanges) {
      if (window.confirm('변경사항이 저장되지 않았습니다. 정말 나가시겠습니까?')) {
        navigate('/calendar')
      }
    } else {
      navigate('/calendar')
    }
  }, [hasChanges, navigate])

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="calendar-detail-loading">
        <Spin size="large" />
        <Text className="calendar-detail-loading-text">일정 데이터를 불러오는 중...</Text>
      </div>
    )
  }

  // 에러 상태
  if (error) {
    return (
      <Alert
        message="일정 데이터 로드 실패"
        description={error.message}
        type="error"
        showIcon
        className="calendar-detail-error"
      />
    )
  }

  const selectedType = Form.useWatch('type', form)
  const selectedTypeConfig = taskTypeOptions.find(option => option.value === selectedType)

  return (
    <div className="calendar-detail-container">
      <Card className="calendar-detail-card">
        <div className="calendar-detail-header">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleCancel}
            className="calendar-detail-back-btn"
          >
            뒤로가기
          </Button>
          
          <div className="calendar-detail-title-section">
            <CalendarOutlined className="calendar-detail-icon" />
            <Title level={3} className="calendar-detail-title">
              {isNewCalendar ? '새 일정 추가' : '일정 수정'}
            </Title>
            {selectedTypeConfig && (
              <div className={`calendar-detail-type-indicator calendar-type-${selectedType}`}>
                {selectedTypeConfig.icon}
                <Text className="calendar-type-label">
                  {selectedTypeConfig.label}
                </Text>
              </div>
            )}
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onValuesChange={handleFormChange}
          className="calendar-detail-form"
        >
          <Row gutter={16}>
            <Col xs={24} sm={16}>
              <Form.Item
                name="title"
                label="일정 제목"
                rules={[
                  { required: true, message: '일정 제목을 입력해주세요' },
                  { max: 100, message: '제목은 100자 이내로 입력해주세요' }
                ]}
              >
                <Input 
                  placeholder="일정 제목을 입력하세요"
                  className="calendar-detail-input"
                />
              </Form.Item>
            </Col>
            
            <Col xs={24} sm={8}>
              <Form.Item
                name="type"
                label="일정 유형"
                rules={[{ required: true, message: '일정 유형을 선택해주세요' }]}
              >
                <Select className="calendar-detail-select">
                  {taskTypeOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      <Space className={`calendar-option-space calendar-option-${option.value}`}>
                        {option.icon}
                        <span className="calendar-option-label">{option.label}</span>
                      </Space>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="date"
                label="날짜"
                rules={[{ required: true, message: '날짜를 선택해주세요' }]}
              >
                <DatePicker 
                  className="calendar-detail-date-picker"
                  format="YYYY-MM-DD"
                  placeholder="날짜 선택"
                />
              </Form.Item>
            </Col>
            
            <Col xs={24} sm={12}>
              <Form.Item
                name="time"
                label="시간"
                rules={[{ required: true, message: '시간을 선택해주세요' }]}
              >
                <TimePicker 
                  className="calendar-detail-time-picker"
                  format="HH:mm"
                  placeholder="시간 선택"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={16}>
              <Form.Item
                name="location"
                label="장소"
              >
                <Input 
                  placeholder="장소를 입력하세요 (선택사항)"
                  className="calendar-detail-input"
                />
              </Form.Item>
            </Col>
            
            <Col xs={24} sm={8}>
              <Form.Item
                name="priority"
                label="우선순위"
                rules={[{ required: true, message: '우선순위를 선택해주세요' }]}
              >
                <Select className="calendar-detail-select">
                  {priorityOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      <span className={`calendar-priority-option calendar-priority-option-${option.value}`}>
                        {option.label}
                      </span>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="설명"
          >
            <TextArea
              placeholder="일정에 대한 상세 설명을 입력하세요 (선택사항)"
              rows={4}
              className="calendar-detail-textarea"
            />
          </Form.Item>

          <Form.Item className="calendar-detail-form-actions">
            <Space size="middle">
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={addCalendarMutation.isPending || updateCalendarMutation.isPending}
                className="calendar-detail-save-btn"
              >
                {isNewCalendar ? '일정 추가' : '변경사항 저장'}
              </Button>
              
              <Button onClick={handleCancel} className="calendar-detail-cancel-btn">
                취소
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default CalendarDetail
