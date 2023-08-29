import { PayPalButtons } from '@paypal/react-paypal-js';
import { postCaptureOrderPaypal, postCreateOrder, postCreateOrderPaypal } from '../../services/apiServices';
import { doCreateOrder } from '../../redux/order/orderSlice';
import { message, notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
const baseURL = import.meta.env.VITE_BACKEND_URL

const PayPalPayment = (props) => {
  const { setCurrentStep, phone, fullName, address, totalPrice } = props
  // console.log("check props paypal", phone, fullName, address, totalPrice)
  const carts = useSelector(state => state.order.carts)
  const [orderFinal, setOrderFinal] = useState('')
  const dispatch = useDispatch()

  const convertToUsd = (priceVND) => {
    const priceUSD = priceVND / 25000
    return priceUSD
  }

  const createOrder = async (data, actions) => {
    try {
      const bodyData = {
        product: {
          address: address,
          price: convertToUsd(totalPrice),
        },
      };
      const response = await postCreateOrderPaypal(bodyData);
      console.log("res", response)
      const order = await response.id;
      return order;
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      throw error;
    }
  };

  const onApprove = async (data, actions) => {
    // Order is captured on the server and the response is returned to the browser
    try {

      //paypal
      const orderID = data.orderID
      const response = await postCaptureOrderPaypal(orderID);
      console.log("ordeeriD>", orderID)
      if (orderID) {
        // setOrderFinal(orderID)
        const detailOrders = carts.map((item) => {
          return {
            bookName: item.detail.mainText,
            quantity: item.quantity,
            _id: item._id
          }
        })
        const orderData = {
          name: fullName,
          address: address,
          phone: phone,
          totalPrice: totalPrice,
          detail: detailOrders
        }
        const results = await postCreateOrder(orderData)
        if (results && results.data) {
          console.log("results", results, results.data)
          message.success('Đặt hàng thành công');
          console.log("success")
          dispatch(doCreateOrder())
          setCurrentStep(2)
        } else {
          notification.error({
            message: 'Có lỗi xảy ra',
            description: results.message,
            duration: 3
          });
        }

      }
      return orderID

    } catch {
      console.error("Error creating PayPal order:", error);
      throw error; // Rethrow the error to be handled elsewhere if needed
    }
  };


  return (
    <PayPalButtons
      createOrder={(data, actions) => createOrder(data, actions)}
      onApprove={(data, actions) => onApprove(data, actions)}
    />
  );
}



export default PayPalPayment