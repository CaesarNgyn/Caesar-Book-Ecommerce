import { Button, Col, Form, Input, message, notification } from "antd"
import { useEffect, useState } from "react";
import { postChangeUserPassword } from "../../services/apiServices";

const ChangePassword = (props) => {
  const { user, setOpenModalManageAccount } = props
  const [form] = Form.useForm();
  const [initForm, setInitForm] = useState(user)

  const onFinish = async (values) => {
    const { email, oldpassword, newpassword } = values
    const res = await postChangeUserPassword(email, oldpassword, newpassword)
    if (res && res.data) {
      message.success('Đổi mật khẩu thành công');
      setOpenModalManageAccount(false)
    } else {
      notification.error({
        message: 'Đã có lỗi xảy ra',
        description: res.message
      })
    }
  };

  useEffect(() => {
    const init = {
      email: user.email,
    }
    setInitForm(init);
    form.setFieldsValue(init);
  }
    , [user])

  return (
    <>
      <div style={{ minHeight: 360, marginLeft: '16px' }}>
        <Col sm={24} md={12}>
          <Form
            form={form}
            name="basic"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              hidden
              labelCol={{ span: 24 }} //whole column
              label="ID"
              name="_id"
            >
              <Input />
            </Form.Item>
            <Col span={24}>
              <Form.Item
                labelCol={{ span: 24 }} //whole column
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Email không được để trống!' },
                {
                  type: 'email',
                  message: 'Email không hợp lệ!',
                },

                ]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                labelCol={{ span: 24 }} //whole column
                label="Mật khẩu hiện tại"
                name="oldpassword"
                rules={[{ required: true, message: 'Mật khẩu hiện tại không được để trống!' }]}
              >
                <Input.Password />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                labelCol={{ span: 24 }} //whole column
                label="Mật khẩu mới"
                name="newpassword"
                rules={[{ required: true, message: 'Mật khẩu mới không được để trống!' },
                {
                  min: 6,
                  message: 'Mật khẩu phải có ít nhất 6 kí tự!',
                },]}
              >
                <Input.Password />
              </Form.Item>
            </Col>

          </Form>
          <Button type="primary" onClick={() => form.submit()}>Đổi mật khẩu</Button>
        </Col>
      </div>

    </>
  )
}

export default ChangePassword