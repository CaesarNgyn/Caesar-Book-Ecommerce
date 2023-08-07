import { InboxOutlined } from "@ant-design/icons";
import { Modal, Table, Upload, message, notification } from "antd"
import { useEffect, useState } from "react";
const { Dragger } = Upload;
import * as XLSX from 'xlsx';
import { postCreateManyUser } from "../../../services/apiServices";
import templateFile from '../dataImport/template.xlsx?url'

const ModalUserImport = (props) => {
  const { openModalImportUser } = props

  const handleOkImportUser = () => {
    handleImport()
    props.setOpenModalImportUser(false);
  };

  const handleImport = async () => {
    console.log("check data send", dataUserExcel)
    const results = await postCreateManyUser(dataUserExcel)
    if (results && results?.data) {
      message.success('Tạo mới người dùng thành công');
      setDataUserExcel([])
      handleCancelImportUser()
      props.fetchListUser()
    } else {
      notification.error({
        message: 'Tạo mới người dùng thất bại',
        description: results?.message,
        duration: 3
      });
    }
  }

  const handleCancelImportUser = () => {
    setDataUserExcel([])
    props.setOpenModalImportUser(false);
  };

  const [dataUserExcel, setDataUserExcel] = useState([])
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 1500);
  };
  const propsUpload = {
    name: 'file',
    multiple: false,
    maxCount: 1,
    accept: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
    customRequest: dummyRequest,
    async onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        const file = info.file.originFileObj
        const res = await handleExcelToJson(file)
        console.log(">>res", res)
        if (res) {
          const data = res.map((item, index) => ({
            key: `data-${index}`,
            fullName: item['Tên hiển thị'],
            email: item['Email'],
            phone: item['Số điện thoại'],

          }))
          setDataUserExcel(data)
        }


        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const handleExcelToJson = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            // header: ["fullName", "email", "phone"]
          });
          resolve(jsonData); // Resolve the promise with jsonData
        } catch (error) {
          reject(error); // Reject the promise if an error occurs
        }
      };
      reader.onerror = (error) => {
        reject(error); // Reject the promise in case of an error
      };
      reader.readAsArrayBuffer(file);
    });
  };



  return (
    <>
      <Modal
        title="Import User Data (File)"
        maskClosable={false}
        closable={false}
        centered={true}
        okText={'Import'}
        cancelButtonProps={false}
        cancelText={'Hủy'}
        closeIcon={false}
        open={openModalImportUser}
        okButtonProps={{
          disabled: dataUserExcel.length < 1
        }}
        onOk={handleOkImportUser}
        onCancel={handleCancelImportUser}
        width={"70%"}

      >
        <Dragger {...propsUpload}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
            Support for a single upload. Only accept .xlsx .csv .xls file type.
            <a
              onClick={e => e.stopPropagation()}
              href={templateFile} download> Download Sample File</a>
          </p>
        </Dragger>
        <div style={{ padding: '20px 0px' }}>
          <Table
            caption={() => <span>Dữ liệu upload:</span>}
            columns={[
              { dataIndex: 'fullName', title: 'Tên hiển thị' },
              { dataIndex: 'email', title: 'Email' },
              { dataIndex: 'phone', title: 'Số điện thoại' }
            ]}
            dataSource={dataUserExcel}
          />
        </div>
      </Modal>
    </>
  )
}

export default ModalUserImport