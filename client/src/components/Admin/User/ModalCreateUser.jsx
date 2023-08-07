import { Divider, Form, Input, Modal, Button, message, notification } from "antd"
import { postCreateUser } from "../../../services/apiServices";
import { useState } from "react";

const ModalCreateUser = (props) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false)
  const handleOkCreateUser = () => {
    props.setOpenModalCreateUser(false);
  };

  const handleCancelCreateUser = () => {
    props.setOpenModalCreateUser(false);
  };

  const handleCancel = () => {
    handleCancelCreateUser()
    form.resetFields()
  }

  const handleSubmit = async (values) => {
    setIsSubmit(true)
    // console.log(values)
    const results = await postCreateUser(values)
    if (results && results.data) {
      message.success('Tạo mới người dùng thành công');
      handleCancel()
      props.fetchListUser()
    } else {
      notification.error({
        message: 'Tạo mới người dùng thất bại',
        description: results.message,
        duration: 3
      });
    }
    setIsSubmit(false)
  }

  return (
    <>
      <Modal
        title="Thêm mới một người dùng"
        maskClosable={false}
        closable={false}
        centered={true}
        okText={'Tạo mới'}
        cancelButtonProps={false}
        cancelText={'Hủy'}
        closeIcon={false}
        open={props.openModalCreateUser}
        onOk={form.submit}
        onCancel={handleCancel}
        confirmLoading={isSubmit}
      >
        <Form
          name="basic"
          // style={{ maxWidth: 600, margin: '0 auto' }}

          autoComplete="off"
          form={form}
          onFinish={handleSubmit}
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
            {
              type: 'email',
              message: 'Email không hợp lệ!',
            },

            ]}
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


        </Form>
      </Modal>
    </>
  )
}
export default ModalCreateUser