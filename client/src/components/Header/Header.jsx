import React, { useState } from 'react';
import { FaReact } from 'react-icons/fa'
import { FiShoppingCart } from 'react-icons/fi';
import { VscSearchFuzzy } from 'react-icons/vsc';
import { Divider, Badge, Drawer, message, Avatar, Popover, Empty } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import { useNavigate } from 'react-router';
import './Header.scss';
import { postLogout } from '../../services/apiServices';
import { doLogout } from '../../redux/account/accountSlice';
import { Link } from 'react-router-dom';
import ManageAccount from '../User/ManageAccount';
import { doCreateOrder } from '../../redux/order/orderSlice';

const baseURL = import.meta.env.VITE_BACKEND_URL

const Header = (props) => {
  const { searchTerm, setSearchTerm } = props
  const [openDrawer, setOpenDrawer] = useState(false);
  const isAuthenticated = useSelector(state => state.account.isAuthenticated);
  const user = useSelector(state => state.account.user);
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [openModalManageAccount, setOpenModalManageAccount] = useState(false)


  const carts = useSelector(state => state.order.carts)

  const handleLogout = async () => {
    const res = await postLogout();
    if (res && res.data) {
      dispatch(doCreateOrder())
      dispatch(doLogout());
      message.success('Đăng xuất thành công');
      navigate('/')
    }
  }
  const handleNavigateHome = () => {
    navigate('/')
  }

  const handleOpenManageAccount = () => {
    setOpenModalManageAccount(true)
  }


  const getAvatarFromServer = (imgUrl) => {
    // console.log(">>", `${baseURL}/images/avatar/${imgUrl}`)
    return `${baseURL}/images/avatar/${imgUrl}`
  }

  const items = [
    {
      label: <label
        style={{ cursor: 'pointer' }}
        onClick={() => handleOpenManageAccount()}>
        Quản lý tài khoản
      </label>,
      key: 'account',
    },

    {
      label: <label
        style={{ cursor: 'pointer' }}
        onClick={() => handleLogout()}
      >Đăng xuất</label>,
      key: 'logout',
    },

  ];
  if (user.role === 'ADMIN') {
    items.unshift({
      label: <Link to='/admin'
        style={{ cursor: 'pointer' }}

      >Trang quản trị</Link>,
      key: 'admin',
    })
  }

  const handleSearchTerm = (value) => {
    setSearchTerm(value)
  }


  const contentPopover = () => {
    return (
      <div className='pop-cart-body'>
        <div className='pop-cart-content'>
          {carts.length > 0 ? (
            <>
              {carts.map((cart, index) => (
                <div className='book' key={index}>
                  <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${cart.detail.thumbnail}`} alt={cart.detail.mainText} />
                  <div>{cart.detail.mainText}</div>
                  <div className='price'>
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(cart.detail.price)}
                  </div>
                </div>
              ))}
              <div className='pop-cart-footer'>
                <button onClick={() => navigate('/order')}>Xem giỏ hàng</button>
              </div>
            </>
          ) : (
            <div style={{ background: '#fff', padding: '20px 0' }}>
              <Empty description="Giỏ hàng chưa có sản phẩm nào ^^" />
            </div>
          )}
        </div>
      </div >
    )
  }

  return (

    <>
      <div className='header-container'>
        <header className="page-header">
          <div className="page-header__top">
            <div className="page-header__toggle" onClick={() => {
              setOpenDrawer(true)
            }}>☰</div>
            <div className='page-header__logo'>
              <span className='logo'
                onClick={handleNavigateHome}
                style={{ fontSize: '18px' }}
              >
                <FaReact className='rotate icon-react'
                /> Caesar's Books
                <VscSearchFuzzy className='icon-search' />
              </span>
              <input
                className="input-search" type={'text'}
                placeholder="Tìm ngay cuốn sách ưa thích (VD: Tinh hoa kinh tế học)"
                onChange={(e) => handleSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <nav className="page-header__bottom">
            <ul id="navigation" className="navigation">
              <li className="navigation__item">
                <Popover
                  className='popover-carts'
                  placement='topRight'
                  rootClassName='popover-carts'
                  title={"Giỏ hàng"}
                  content={contentPopover}
                  arrow={true}
                >
                  <Badge
                    count={carts.length}
                    size={"small"}
                  >
                    <FiShoppingCart className='icon-cart' />
                  </Badge>
                </Popover>
              </li>
              <li className="navigation__item mobile"><Divider type='vertical' /></li>
              <li className="navigation__item mobile">
                {!isAuthenticated ?
                  <span onClick={() => navigate('/login')}> Tài Khoản</span>
                  :
                  <Dropdown menu={{ items }} trigger={['click']}>
                    <a onClick={(e) => e.preventDefault()}>
                      <Space>
                        <Avatar size={32}
                          src={getAvatarFromServer(user.avatar)} /> {user?.fullName}
                        <DownOutlined />
                      </Space>
                    </a>
                  </Dropdown>
                }
              </li>
            </ul>
          </nav>
        </header>
      </div>
      <Drawer
        title="Menu chức năng"
        placement="left"
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
      >
        <p>Quản lý tài khoản</p>
        <Divider />
        <p>Đăng xuất</p>
        <Divider />
      </Drawer>
      <ManageAccount
        openModalManageAccount={openModalManageAccount}
        setOpenModalManageAccount={setOpenModalManageAccount}
        user={user}
      />
    </>
  )
};

export default Header;
