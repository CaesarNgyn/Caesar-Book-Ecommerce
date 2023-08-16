import { Button, Divider, Form, Input, message, notification } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

import './Login.scss';
import { useState } from 'react';
import { postLogin } from '../../services/apiServices';
import { doLogin } from '../../redux/account/accountSlice';
import { useSelector, useDispatch } from 'react-redux';
import { doCreateOrder } from '../../redux/order/orderSlice';


const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const handleLogin = async (values) => {
    setIsLoading(true)
    const { username, password } = values
    const results = await postLogin(values)
    console.log("results", results)
    if (results && results.data) {
      localStorage.setItem('access_token', results.data?.access_token)
      message.success('Đăng nhập thành công');
      setIsLoading(false)
      dispatch(doLogin(results.data.user))
      dispatch(doCreateOrder())
      navigate('/')
    } else {
      notification.error({
        message: 'Đăng nhập thất bại',
        description: results.message,
        duration: 3
      });
      setIsLoading(false)
    }
  };


  return (
    <div className="login-page">
      <main className="main">
        <div className="container">
          <section className="wrapper">
            <div className="heading">
              <h2 className="text text-large">Đăng Nhập</h2>
              <Divider />

            </div>
            <Form
              name="basic"
              // style={{ maxWidth: 600, margin: '0 auto' }}
              onFinish={handleLogin}
              autoComplete="off"
            >
              <Form.Item
                labelCol={{ span: 24 }} //whole column
                label="Email"
                name="username"
                rules={[{ required: true, message: 'Email không được để trống!' },
                  // {
                  //   type: 'email',
                  //   message: 'Email không hợp lệ!',
                  // },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                labelCol={{ span: 24 }} //whole column
                label="Mật khẩu"
                name="password"
                rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
              // wrapperCol={{ offset: 6, span: 16 }}
              >
                <Button type="primary" htmlType="submit" loading={isLoading}>
                  Đăng nhập
                </Button>
              </Form.Item>
              <Divider></Divider>
              <p className="text text-normal">Chưa có tài khoản ?
                <span>
                  <Link to='/register' > Đăng Ký </Link>
                </span>
              </p>
            </Form>
          </section>
        </div>
      </main>
    </div>
  )
}

export default LoginPage;
