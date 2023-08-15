import { Descriptions, Divider, Drawer, Modal, Upload } from "antd"
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

const OrderViewDetail = (props) => {

  const onClose = () => {
    props.setOpenViewDetail(false)
  }
  return (
    <>
      <Drawer
        title="Thông tin chi tiết đơn hàng"
        placement="right"
        onClose={onClose}
        open={props.openViewDetail}
        width="50%">
        <Descriptions title="Order Info" bordered column={2}>
          {props.dataViewDetail.map((item) => (
            <Descriptions.Item
              key={item.key}
              label={item.label}
              span={item.span}>
              {item.children}
            </Descriptions.Item>
          ))}

        </Descriptions>
      </Drawer>
    </>
  )
}

export default OrderViewDetail