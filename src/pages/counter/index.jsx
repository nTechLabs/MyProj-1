import { Typography, Space, Divider, Button, Card, Statistic } from 'antd'
import { ArrowLeftOutlined, NumberOutlined, PlusOutlined, MinusOutlined, ReloadOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import useCountStore from '../../store/useCountStore'

const { Title, Paragraph } = Typography

const CounterPage = () => {
  const navigate = useNavigate()
  const { count, increment, decrement, reset } = useCountStore()

  return (
    <div style={{ padding: '20px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <NumberOutlined style={{ fontSize: '64px', color: '#52c41a', marginBottom: '20px' }} />
          <Title level={2}>카운터 페이지</Title>
          <Paragraph>
            Zustand를 사용한 상태 관리 데모 페이지입니다.
            <br />
            간단한 카운터로 상태 변경을 확인할 수 있습니다.
          </Paragraph>
        </div>
        
        <Divider>Zustand 상태 관리</Divider>
        <Card 
          title="Zustand 카운터" 
          style={{ width: 300, margin: '20px auto' }}
        >
          <Statistic
            title="현재 카운트"
            value={count}
            valueStyle={{ color: '#3f8600', textAlign: 'center' }}
          />
          <Space style={{ marginTop: 16, width: '100%', justifyContent: 'center' }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={increment}
            >
              증가
            </Button>
            <Button
              icon={<MinusOutlined />}
              onClick={decrement}
            >
              감소
            </Button>
            <Button
              type="default"
              icon={<ReloadOutlined />}
              onClick={reset}
            >
              리셋
            </Button>
          </Space>
        </Card>
      </Space>
    </div>
  )
}

export default CounterPage
