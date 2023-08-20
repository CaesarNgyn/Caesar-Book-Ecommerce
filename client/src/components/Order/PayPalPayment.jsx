import { PayPalButtons } from '@paypal/react-paypal-js';
import { postCaptureOrderPaypal, postCreateOrderPaypal } from '../../services/apiServices';
const baseURL = import.meta.env.VITE_BACKEND_URL

const PayPalPayment = () => {
  // const createOrder = async (data, actions) => {
  //   try {
  //     const response = await fetch(`${baseURL}api/v1/paypal/create-order`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         product: {
  //           description: 'Wood Candy Sofa',
  //           price: '399.00'
  //         }
  //       }),
  //     });

  //     const order = await response.json();
  //     return order.id;
  //   } catch (error) {
  //     // Handle any errors that might occur during the fetch or JSON parsing
  //     console.error("Error creating PayPal order:", error);
  //     throw error; // Rethrow the error to be handled elsewhere if needed
  //   }
  // };

  const createOrder = async (data, actions) => {
    try {
      const bodyData = {
        product: {
          description: 'Wood Candy Sofa',
          price: '399.00',
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
      const orderID = data.orderID
      const response = await postCaptureOrderPaypal(orderID);
      console.log("ordeeriD>", orderID)
      const responseData = await response.data
      return responseData
    } catch {
      console.error("Error creating PayPal order:", error);
      throw error; // Rethrow the error to be handled elsewhere if needed
    }
  };


  // const onApprove = async (data, actions) => {
  //   // Order is captured on the server and the response is returned to the browser
  //   try {
  //     const response = await fetch(`${baseURL}api/v1/paypal/capture-order`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         orderID: data.orderID
  //       })
  //     })
  //     console.log("ordeeriD>", orderID)
  //     const responseData = await response.json()
  //     return responseData
  //   } catch {
  //     console.error("Error creating PayPal order:", error);
  //     throw error; // Rethrow the error to be handled elsewhere if needed
  //   }
  // };


  return (
    <PayPalButtons
      createOrder={(data, actions) => createOrder(data, actions)}
      onApprove={(data, actions) => onApprove(data, actions)}
    />
  );
}



export default PayPalPayment