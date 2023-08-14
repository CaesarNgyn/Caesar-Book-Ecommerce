import { Avatar, Button, Col, Form, Input, Modal, Row, Upload, message } from "antd"
import { AntDesignOutlined, LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { patchUpdateUser, postUploadAvatar } from "../../services/apiServices";
import { doUpdateUserInfo, doUploadAvatar } from "../../redux/account/accountSlice";
import { useDispatch } from 'react-redux';

const ChangeUserInfo = (props) => {
  const { user, setOpenModalManageAccount } = props
  const [userAvatar, setUserAvatar] = useState(user?.avatar ?? "")
  const [isSubmit, setIsSubmit] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [imageUrl, setImageUrl] = useState("");
  const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${userAvatar}`
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false)
  const [initForm, setInitForm] = useState(user)
  const dispatch = useDispatch()

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange = (info, type) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    } else if (info.file.status === 'error') {
      message.error("Upload thất bại")
    }
  };

  const handleUploadAvatar = async ({ file, onSuccess, onError }) => {
    const res = await postUploadAvatar(file);
    console.log(">>res upload file", res)
    if (res && res.data) {
      const newAvatar = res.data.fileName;
      dispatch(doUploadAvatar({ avatar: newAvatar }))
      setUserAvatar(newAvatar)
      onSuccess('ok')
    } else {
      onError('Đã có lỗi khi upload file');
    }
  };

  const handlePreview = async (file) => {
    console.log(">>preview")
    getBase64(file.originFileObj, (url) => {
      setPreviewImage(url);
      setPreviewOpen(true);
      setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    });
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const onFinish = async (values) => {
    const { id, fullName, email, phone } = values
    setIsSubmit(true)
    const res = await patchUpdateUser(id, fullName, email, phone, userAvatar)
    if (res && res.data) {
      dispatch(doUpdateUserInfo({ avatar: userAvatar, phone, fullName, email }))
      message.success('Cập nhật thông tin tài khoản thành công');
      setOpenModalManageAccount(false)
      localStorage.removeItem('access_token')
    } else {
      notification.error({
        message: 'Đã có lỗi xảy ra',
        description: res.message
      })
    }
    setIsSubmit(false)
  };

  useEffect(() => {
    const init = {
      email: user.email,
      fullName: user.fullName,
      phone: user.phone
    }
    setInitForm(init);
    form.setFieldsValue(init);
  }
    , [user])

  return (
    <div style={{ minHeight: 400 }}>
      <Row>
        <Col sm={24} md={12}>
          <Row gutter={[30, 30]}>
            <Col span={24} style={{ margin: '16px 16px' }}>
              <Avatar
                // size={{ xs: 32, sm: 64, md: 80, lg: 128, xl: 160, xxl: 280 }}
                size={240}
                icon={<AntDesignOutlined />}
                src={urlAvatar}
                shape="circle"
              />
              <Col span={24} style={{ margin: '36px 0 0 36px' }}>
                <Upload
                  name="avatar"
                  className="avatar-uploader"
                  maxCount={1}
                  multiple={false}
                  customRequest={handleUploadAvatar}
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                  onPreview={handlePreview}
                  showUploadList={false}
                >
                  {loading ? <LoadingOutlined /> : <Button icon={<UploadOutlined />}>
                    Upload Avatar
                  </Button>}

                </Upload>
              </Col>
            </Col>
          </Row>
        </Col>
        <Col sm={24} md={12}>
          <Form
            form={form}
            name="basic"
            onFinish={onFinish}
            autoComplete="off"
          // initialValues={dataUpdate}
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
                label="Họ tên"
                name="fullName"
                rules={[{ required: true, message: 'Họ tên không được để trống!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
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
            </Col>

          </Form>
          <Button type="primary" onClick={() => form.submit()}>Cập nhật</Button>
        </Col>
      </Row>


    </div>
  )
}

export default ChangeUserInfo