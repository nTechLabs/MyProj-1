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
