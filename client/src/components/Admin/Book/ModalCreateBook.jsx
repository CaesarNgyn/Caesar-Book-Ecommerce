import React, { useEffect, useState } from 'react';
import { Button, Col, Divider, Form, Input, InputNumber, message, Modal, notification, Row, Select, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { getCategory, postCreateBook, postUploadBookImg } from '../../../services/apiServices';
const BookModalCreate = (props) => {
  const { openModalCreateBook, setOpenModalCreateBook } = props;
  const [isSubmit, setIsSubmit] = useState(false);

  const [listCategory, setListCategory] = useState([])
  const [form] = Form.useForm();


  const [loading, setLoading] = useState(false);
  const [loadingSlider, setLoadingSlider] = useState(false);

  const [imageUrl, setImageUrl] = useState("");

  const [dataThumbnail, setDataThumbnail] = useState([])
  const [dataSlider, setDataSlider] = useState([])

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  useEffect(() => {
    const fetchCategory = async () => {
      const res = await getCategory();
      if (res && res.data) {
        const d = res.data.map(item => {
          return { label: item, value: item }
        })
        setListCategory(d);
      }
    }
    fetchCategory();
  }, [])

  const handleCancel = () => {
    setOpenModalCreateBook(false)
    form.resetFields()
  }

  const onFinish = async (values) => {

    if (dataThumbnail.length === 0) {
      notification.error({
        message: 'Lỗi chưa tải ảnh',
        description: 'Vui lòng upload ảnh thumbnail'
      })
    }
    // if(dataSlider.length === 0){
    //   notification.error({
    //     message: 'Lỗi validate',
    //     description: 'Vui lòng upload ảnh thumbnail'
    //   })
    // }
    const { author, mainText, price, quantity, sold, category } = values;
    const thumbnail = dataThumbnail[0].name
    const slider = dataSlider.map((item) =>
      item.name
    )
    setIsSubmit(true)
    if (dataThumbnail.length > 0) {
      const res = await postCreateBook(author, mainText, price, quantity, sold, category, thumbnail, slider);
      if (res && res.data) {
        message.success('Tạo mới book thành công');
        form.resetFields();
        setDataSlider([])
        setDataThumbnail([])
        setOpenModalCreateBook(false);
        await props.fetchListBook()
      } else {
        notification.error({
          message: 'Đã có lỗi xảy ra',
          description: res.message
        })
      }
    }
    setIsSubmit(false)
  };


  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

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

  const handleRemoveFile = (file, type) => {
    if (type === 'thumbnail') {
      setDataThumbnail([])
    }
    if (type === 'slider') {
      const newSlider = dataSlider.filter(x => x.uid !== file.uid);
      setDataSlider(newSlider);
    }
  }


  const handleChange = (info, type) => {
    if (info.file.status === 'uploading') {
      type ? setLoadingSlider(true) : setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        type ? setLoadingSlider(false) : setLoading(false);
        setImageUrl(url);
      });
    }
  };


  const handleUploadFileThumbnail = async ({ file, onSuccess, onError }) => {
    const res = await postUploadBookImg(file);
    console.log(">>res upload file", res)
    if (res && res.data) {
      setDataThumbnail([{
        name: res.data.fileName,
        uid: file.uid
      }])
      onSuccess('ok')
    } else {
      onError('Đã có lỗi khi upload file');
    }
  };

  const handleUploadFileSlider = async ({ file, onSuccess, onError }) => {
    const res = await postUploadBookImg(file);
    if (res && res.data) {
      //copy previous state => upload multiple images
      setDataSlider((dataSlider) => [...dataSlider, {
        name: res.data.fileName,
        uid: file.uid
      }])
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




  return (
    <>

      <Modal
        title="Thêm mới một quyển sách"
        open={openModalCreateBook}
        onOk={() => { form.submit() }}
        onCancel={() => handleCancel()}
        okText={"Tạo mới"}
        cancelText={"Hủy"}
        confirmLoading={isSubmit}
        width={"70vw"}
        //do not close when click fetchBook
        maskClosable={false}
      >
        <Divider />

        <Form
          form={form}
          name="basic"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={15}>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Tên sách"
                name="mainText"
                rules={[{ required: true, message: 'Vui lòng nhập tên sách!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Tác giả"
                name="author"
                rules={[{ required: true, message: 'Vui lòng nhập tác giả!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Giá tiền"
                name="price"
                rules={[{ required: true, message: 'Vui lòng nhập giá tiền!' }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  addonAfter="VND"
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Thể loại"
                name="category"
                rules={[{ required: true, message: 'Vui lòng chọn thể loại!' }]}
              >
                <Select
                  defaultValue={null}
                  showSearch
                  allowClear
                  //  onChange={handleChange}
                  options={listCategory}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Số lượng"
                name="quantity"
                rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Đã bán"
                name="sold"
                rules={[{ required: true, message: 'Vui lòng nhập số lượng đã bán!' }]}
                initialValue={0}
              >
                <InputNumber min={0} defaultValue={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Ảnh Thumbnail"
                name="thumbnail"
              >
                <Upload
                  name="thumbnail"
                  listType="picture-card"
                  className="avatar-uploader"
                  maxCount={1}
                  multiple={false}
                  customRequest={handleUploadFileThumbnail}
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                  onRemove={(file) => handleRemoveFile(file, "slider")}
                  onPreview={handlePreview}
                >
                  <div>
                    {loading ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>

            </Col>
            <Col span={12}>
              <Form.Item
                labelCol={{ span: 24 }}
                label="Ảnh Slider"
                name="slider"
              >
                <Upload
                  multiple
                  name="slider"
                  listType="picture-card"
                  className="avatar-uploader"
                  customRequest={handleUploadFileSlider}
                  beforeUpload={beforeUpload}
                  onRemove={(file) => handleRemoveFile(file, "slider")}
                  onChange={(info) => handleChange(info, 'slider')}
                  onPreview={handlePreview}
                >
                  <div>
                    {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Modal width={"40vw"} open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default BookModalCreate;