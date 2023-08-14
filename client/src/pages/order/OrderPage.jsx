import { useState } from "react";
import ViewOrder from "../../components/Order/ViewOrder";
import { Button, Result, Steps } from "antd";
import './Order.scss'
import Payment from "../../components/Order/Payment";
import { useNavigate } from "react-router-dom";
const OrderPage = (props) => {
  const [currentStep, setCurrentStep] = useState(0)
  const navigate = useNavigate()
  return (
    <>
      <div style={{ background: '#efefef', padding: "20px 0" }}>
        <div className="order-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
          <div className="order-steps" style={{ marginBottom: '0' }}>
            <Steps
              size="small"
              current={currentStep}
              items={[
                {
                  title: 'Kiểm tra đơn hàng',
                },
                {
                  title: 'Đặt hàng',
                },
                {
                  title: 'Thanh toán',
                },
              ]}
            />
          </div>
          {currentStep === 0 && <ViewOrder setCurrentStep={setCurrentStep} />}
          {currentStep === 1 && <Payment setCurrentStep={setCurrentStep} />}
          {currentStep === 2 &&
            <div style={{ marginBottom: '200px' }}>
              <Result
                status="success"
                title="Đơn hàng đã được đặt thành công!"
                subTitle="Cảm ơn quý khách hàng đã tin tưởng Caesar's Books. Chúc quý khách hàng luôn an khang thịnh vượng!"
                extra={[
                  <Button type="primary" key="console"
                    onClick={() => navigate('/history')}>
                    Xem lịch sử đặt hàng
                  </Button>,
                  ,
                ]}

              />
            </div>
          }
        </div>
      </div>


    </>
  )
}

export default OrderPage;