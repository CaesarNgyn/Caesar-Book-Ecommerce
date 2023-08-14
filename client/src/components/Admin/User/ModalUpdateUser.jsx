import { Divider, Form, Input, Modal, Button, message, notification } from "antd"
// import { postUpdateUser } from "../../../services/apiServices";
import { useEffect, useState } from "react";
import { patchUpdateUser } from "../../../services/apiServices";

const ModalUpdateUser = (props) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false)
  const { dataUpdate } = props
  const handleOkUpdateUser = () => {
    props.setOpenModalUpdateUser(false);
  };

  const handleCancelUpdateUser = () => {
    props.setOpenModalUpdateUser(false);
  };

  const handleCancel = () => {
    handleCancelUpdateUser()
    form.resetFields()
  }

  const handleSubmit = async (values) => {
    const { id, fullName, email, phone } = values
    setIsSubmit(true)
    // console.log(values)
    const results = await patchUpdateUser(id, fullName, email, phone)
    if (results && results.data) {
      message.success('Cập nhật người dùng thành công');
      handleCancel()
      props.fetchListUser()
    } else {
      notification.error({
        message: 'Cập nhật người dùng thất bại',
        description: results.message,
        duration: 3
      });
    }
    setIsSubmit(false)
  }

  useEffect(() => {
    form.setFieldsValue(dataUpdate)
  }, [dataUpdate])

  return (
    <>
      <Modal
        title="Cập nhật người dùng"
        maskClosable={false}
        closable={false}
        centered={true}
        okText={'Cập nhật'}
        cancelButtonProps={false}
        cancelText={'Hủy'}
        closeIcon={false}
        open={props.openModalUpdateUser}
        onOk={form.submit}
        onCancel={handleCancel}
        confirmLoading={isSubmit}

      >
        <Form
          name="basic"
          // style={{ maxWidth: 600, margin: '0 auto' }}
          initialValues={dataUpdate}
          autoComplete="off"
          form={form}
          onFinish={handleSubmit}
        >
          <Form.Item
            hidden
            labelCol={{ span: 24 }} //whole column
            label="ID"
            name="id"

          >
            <Input />
          </Form.Item>
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
            <Input disabled />
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
export default ModalUpdateUser