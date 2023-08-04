import { Descriptions, Drawer } from "antd"

const UserViewDetail = (props) => {

  const onClose = () => {
    props.setOpenViewDetail(false)
  }
  return (
    <>
      <Drawer
        title="Thông tin chi tiết người dùng"
        placement="right"
        onClose={onClose}
        open={props.openViewDetail}
        width="50%">
        <Descriptions title="User Info" bordered column={2}>
          {props.dataViewDetail.map((item) => (
            <Descriptions.Item
              key={item.key}
              label={item.label}
              span={item.span}>
              {item.children}
            </Descriptions.Item>
          ))}
        </Descriptions>;
      </Drawer>
    </>
  )
}

export default UserViewDetail