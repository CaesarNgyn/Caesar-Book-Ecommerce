import { Descriptions, Divider, Drawer, Modal, Upload } from "antd"
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

const BookViewDetail = (props) => {
  const { dataViewDetail, setDataViewDetail } = props
  const getBase64 = () =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });


  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([]);

  const handleCancel = () => {
    setPreviewOpen(false)
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || (file.preview));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const handleChange = ({ fileList: newFileList }) => {

    setFileList(newFileList);
  }


  useEffect(() => {
    if (dataViewDetail) {
      let imgThumbnail = {}
      let imgSlider = []
      if (dataViewDetail[7]?.thumbnail) {
        imgThumbnail = {
          uid: uuidv4(),
          name: dataViewDetail[7]?.thumbnail,
          status: 'done',
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataViewDetail[7]?.thumbnail}`
        }
      }
      if (dataViewDetail[8]?.slider && dataViewDetail[8]?.slider.length > 0) {
        dataViewDetail[8]?.slider.map((item) => {
          imgSlider.push({
            uid: uuidv4(),
            name: item,
            status: 'done',
            url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`
          })
        })
      }
      setFileList([imgThumbnail, ...imgSlider])
    }
  }, [dataViewDetail])

  const onClose = () => {
    props.setOpenViewDetail(false)
  }

  const getAvatarFromServer = (imgUrl) => {
    // console.log(">>", `${baseURL}/images/book/${imgUrl}`)
    return `${baseURL}/images/book/${imgUrl}`
  }



  return (
    <>
      <Drawer
        title="Thông tin chi tiết sách"
        placement="right"
        onClose={onClose}
        open={props.openViewDetail}
        width="50%">
        <Descriptions title="Book Info" bordered column={2}>
          {props.dataViewDetail.map((item) => (
            <Descriptions.Item
              key={item.key}
              label={item.label}
              span={item.span}>
              {item.children}
            </Descriptions.Item>
          ))}

        </Descriptions>
        <Divider orientation="left" style={{ fontStyle: "italic" }}>Ảnh Sách</Divider>
        <Upload
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          showUploadList={
            { showRemoveIcon: false }
          }
        >

        </Upload>
        <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </Drawer>
    </>
  )
}

export default BookViewDetail