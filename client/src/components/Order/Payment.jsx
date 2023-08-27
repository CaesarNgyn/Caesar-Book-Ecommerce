import { Col, Divider, Empty, Form, Input, InputNumber, Radio, Row, message, notification } from 'antd';
import './Order.scss';
import { DeleteOutlined, DeleteTwoTone, LoadingOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { doAddBook, doCreateOrder, doDeleteBook, doUpdateBook } from '../../redux/order/orderSlice';
import { useEffect, useState } from 'react';
import TextArea from 'antd/es/input/TextArea';
import { postCreateOrder } from '../../services/apiServices';
import { PayPalButtons } from '@paypal/react-paypal-js';
import PayPalPayment from './PayPalPayment';


const Payment = (props) => {
  const { setCurrentStep } = props
  const carts = useSelector(state => state.order.carts)
  const [totalPrice, setTotalPrice] = useState(0)
  const dispatch = useDispatch()
  const currentUser = useSelector(state => state.account.user)
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cashOnDelivery');
  const [address, setAddress] = useState('');


  // console.log("sellected", selectedPaymentMethod)
  const handlePaymentMethodChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleChangeQuantity = (value, currentCart) => {
    if (!isNaN(value)) {
      dispatch(doUpdateBook({ quantity: value, _id: currentCart._id, detail: currentCart.detail }))
    }
  }

  const handleSubmit = async (values) => {
    setIsSubmit(true)
    // console.log(values)
    const detailOrders = carts.map((item) => {
      return {
        bookName: item.detail.mainText,
        quantity: item.quantity,
        _id: item._id
      }
    })

    const orderData = {
      name: values.fullName,
      address: values.address,
      phone: values.phone,
      totalPrice: totalPrice,
      detail: detailOrders
    }
    const results = await postCreateOrder(orderData)
    if (results && results.data) {
      message.success('Đặt hàng thành công');
      dispatch(doCreateOrder())
      setCurrentStep(2)
    } else {
      notification.error({
        message: 'Có lỗi xảy ra',
        description: results.message,
        duration: 3
      });
    }
    setIsSubmit(false)
  }


  useEffect(() => {
    if (carts && carts.length > 0) {
      let sum = 0
      carts.map((item) => {
        sum += (item.quantity * item.detail.price)
      })
      setTotalPrice(sum)
    } else {
      setTotalPrice(0)
    }
  }, [carts])

  useEffect(() => {
    form.setFieldsValue(currentUser)
  }, [currentUser])

  return (
    <div style={{ background: '#efefef', padding: "20px 0" }}>
      <div className="order-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
        <Row gutter={[20, 20]}>
          <Col md={16} xs={24}>
            {carts.length > 0 ?
              carts.map((cart, index) => (
                <div className='order-book' key={index}>
                  <div className='book-content'>
                    <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${cart.detail.thumbnail}`} />
                    <div className='title'>
                      {cart.detail.mainText}
                    </div>
                    <div className='price'>
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(cart.detail.price)}
                    </div>
                  </div>
                  <div className='action'>
                    <div className='quantity'>
                      <InputNumber
                        min={1}
                        onChange={(value) => handleChangeQuantity(value, cart)}
                        value={cart.quantity} />
                    </div>
                    <div className='sum'>
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(cart.detail.price * cart.quantity)}
                    </div>
                    <DeleteTwoTone
                      style={{ cursor: 'pointer' }}
                      onClick={() => dispatch(doDeleteBook({ _id: cart._id }))}
                      twoToneColor={"#eb2f96"}
                    />
                  </div>
                </div>
              )) :

              <div style={{ background: '#fff', padding: "20px 0" }}>
                <Empty
                  description={"Hiện tại chưa có sản phẩm nào trong giỏ hàng "}
                />
              </div>}
          </Col>

          <Col md={8} xs={24} >
            <div className='order-sum'>
              <Form
                name="basic"
                // style={{ maxWidth: 600, margin: '0 auto' }}
                autoComplete="off"
                form={form}
                onFinish={handleSubmit}
              >
                <Form.Item
                  labelCol={{ span: 24 }} //whole column
                  label="Tên người nhận"
                  name="fullName"
                  rules={[{ required: true, message: 'Tên người nhận không được để trống!' }]}
                >
                  <Input />
                </Form.Item>


                <Form.Item
                  labelCol={{ span: 24 }} //whole column
                  label="Số điện thoại"
                  name="phone"
                  rules={[{ required: true, message: 'Số điện thoại không được để trống!' },
                  {
                    pattern: /^[0-9]+$/,
                    message: 'Số điện thoại chỉ được chứa chữ số!',
                  },
                  {
                    min: 10,
                    message: 'Số điện thoại phải có ít nhất 10 chữ số!',
                  },]}
                >
                  <Input />
                </Form.Item>


                <Form.Item
                  labelCol={{ span: 24 }} //whole column
                  label="Địa chỉ"
                  name="address"
                  rules={[{ required: true, message: 'Địa chỉ không được để trống!' }]}
                >
                  <TextArea
                    autoFocus
                    rows={4}
                    onChange={handleAddressChange}
                    value={address}
                  />
                </Form.Item>


              </Form>
              <div className='info'>
                <div className='method'>
                  <div> Hình thức thanh toán</div>
                  <Radio.Group
                    onChange={handlePaymentMethodChange}
                    value={selectedPaymentMethod}>
                    <Radio
                      value="cashOnDelivery"
                      disabled={!address}>
                      Thanh toán khi nhận hàng
                    </Radio>
                    <br />
                    <Radio
                      value="electronicWallet"
                      style={{ marginTop: '8px' }}
                      disabled={!address}
                    >
                      Thanh toán bằng ví điện tử
                    </Radio>
                  </Radio.Group>
                </div>
              </div>
              <Divider style={{ margin: "5px 0" }} />
              <div className='calculate'>
                <span> Tổng tiền</span>
                <span className='sum-final'>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(totalPrice)}</span>
              </div>
              {address && selectedPaymentMethod === 'cashOnDelivery' &&
                <button
                  onClick={() => form.submit()}
                // disabled={isSubmit}
                >
                  {isSubmit && <span><LoadingOutlined /> &nbsp;</span>}
                  Đặt Hàng {`(${carts.length})`}
                </button>}
              {address && selectedPaymentMethod === 'electronicWallet' &&
                <PayPalPayment setCurrentStep={setCurrentStep} />
              }
            </div>
          </Col>
        </Row>
      </div>
      <div style={{ marginTop: '300px' }}></div>
    </div>
  )
}

export default Payment;