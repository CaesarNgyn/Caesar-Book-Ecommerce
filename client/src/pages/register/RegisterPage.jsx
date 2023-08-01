import React, { useState } from 'react';
import { Button, Checkbox, Divider, Form, Input, message, notification } from 'antd';
import './Register.scss'
import { Link, useNavigate } from 'react-router-dom';
import { postRegister } from '../../services/apiServices';


const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const handleRegister = async (values) => {
    setIsLoading(true)
    const { email, fullName, password, phone } = values
    const results = await postRegister(values)
    console.log("result", results.statusCode)
    if (results && results.data) {
      message.success('Đăng ký tài khoản thành công');
      setIsLoading(false)
      navigate('/login')
    } else {
      notification.error({
        message: 'Đăng ký người dùng thất bại',
        description: results.message,
        duration: 5
      });
      setIsLoading(false)
    }

  };


  // Custom validator for phone number minimum length of 10 characters
  const validatePhoneNumber = (_, value) => {
    if (value && value.length < 10) {
      return Promise.reject('Số điện thoại phải có độ dài ít nhất là 10');
    }
    return Promise.resolve();
  };

  return (
    <>
      <div className="register-page">
        <main className="main">
          <div className="container">
            <section className="wrapper">
              <div className="heading">
                <h2 className="text text-large">Đăng Ký Tài Khoản</h2>
                <Divider />
              </div>
              <Form
                name="basic"
                // style={{ maxWidth: 600, margin: '0 auto' }}
                onFinish={handleRegister}
                autoComplete="off"
              >
                <Form.Item
                  labelCol={{ span: 24 }} //whole column
                  label="Họ tên"
                  name="fullName"
                  rules={[{ required: true, message: 'Họ tên không được để trống!' }]}
                >
                  <Input />
                </Form.Item>


                <Form.Item
                  labelCol={{ span: 24 }} //whole column
                  label="Email"
                  name="email"
                  rules={[{ required: true, message: 'Email không được để trống!' },
                  { validator: validatePhoneNumber, message: "Hãy nhập đúng định dạng Email" }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  labelCol={{ span: 24 }} //whole column
                  label="Mật khẩu"
                  name="password"
                  rules={[{ required: true, message: 'Mật khẩu không được để trống!' },
                  {
                    min: 6,
                    message: 'Mật khẩu nên có ít nhất 6 ký tự',
                  }]}
                >
                  <Input.Password />
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
                // wrapperCol={{ offset: 6, span: 16 }}
                >
                  <Button type="primary" htmlType="submit" loading={isLoading} >
                    Đăng ký
                  </Button>
                </Form.Item>
                <Divider></Divider>
                <p className="text text-normal">Đã có tài khoản ?
                  <span>
                    <Link to='/login' > Đăng Nhập </Link>
                  </span>
                </p>
              </Form>
            </section>
          </div>
        </main>
      </div>

    </>
  )
}

export default RegisterPage