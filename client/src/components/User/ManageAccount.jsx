import { Modal, Tabs } from "antd"
import ChangeUserInfo from "./ChangeUserInfo";
import ChangePassword from "./ChangePassword";

const ManageAccount = (props) => {
  const { user } = props
  const items = [
    {
      key: 'info',
      label: `Thông tin`,
      children: <ChangeUserInfo
        user={user}
        setOpenModalManageAccount={props.setOpenModalManageAccount}
      />,
    },
    {
      key: 'password',
      label: `Đổi mật khẩu`,
      children: <ChangePassword user={user}
        setOpenModalManageAccount={props.setOpenModalManageAccount}
      />,
    }
  ];
  return (
    <Modal
      title="Quản lý tài khoản"
      maskClosable={false}
      centered={true}
      footer={null}
      open={props.openModalManageAccount}
      width={"50vw"}
      onCancel={() => props.setOpenModalManageAccount(false)}
    >
      <Tabs
        defaultActiveKey="info"
        items={items}
      />
    </Modal>

  )

}

export default ManageAccount