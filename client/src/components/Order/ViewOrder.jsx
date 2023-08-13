import { Col, Divider, Empty, InputNumber, Row } from 'antd';
import './Order.scss';
import { DeleteOutlined, DeleteTwoTone } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { doAddBook, doDeleteBook, doUpdateBook } from '../../redux/order/orderSlice';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ViewOrder = (props) => {
    const carts = useSelector(state => state.order.carts)
    const [totalPrice, setTotalPrice] = useState(0)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const handleChangeQuantity = (value, currentCart) => {
        if (!isNaN(value)) {
            dispatch(doUpdateBook({ quantity: value, _id: currentCart._id, detail: currentCart.detail }))
        }
    }

    const handleClickPayment = () => {
        props.setCurrentStep(1)
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

    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <div className="order-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
                <Row gutter={[20, 20]}>
                    <Col md={18} xs={24}>
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

                    <Col md={6} xs={24} >
                        <div className='order-sum'>
                            <div className='calculate'>
                                <span>  Tạm tính</span>
                                <span>
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    }).format(totalPrice)}</span>
                            </div>
                            <Divider style={{ margin: "10px 0" }} />
                            <div className='calculate'>
                                <span> Tổng tiền</span>
                                <span className='sum-final'>
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    }).format(totalPrice)}</span>
                            </div>
                            <Divider style={{ margin: "10px 0" }} />
                            <button onClick={() => handleClickPayment()}>Mua Hàng {`(${carts.length})`}</button>
                        </div>
                    </Col>
                </Row>
            </div>
            <div style={{ marginTop: '300px' }}></div>
        </div>
    )
}

export default ViewOrder;