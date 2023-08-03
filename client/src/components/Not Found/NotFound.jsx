
import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';


const NotFound = () => {
  const navigate = useNavigate()
  return (
    <>
      <Result
        status="404"
        title="404"
        subTitle="Xin lỗi, địa chỉ bạn yêu cầu hiện không thể
        tìm thấy trên máy chủ của chúng tôi."
        extra={<Button type="primary" onClick={() => navigate('/')}>Về Trang Chủ</Button>}
      />
    </>
  )
}

export default NotFound

