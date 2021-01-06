import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listOrders, deleteOrder } from '../actions/orderActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { ORDER_DELETE_RESET } from '../constants/orderConstants';

export default function OrderListScreen(props) {
  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;
  const orderDelete = useSelector((state) => state.orderDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = orderDelete;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: ORDER_DELETE_RESET });
    dispatch(listOrders());
  }, [dispatch, successDelete]);
  const deleteHandler = (order) => {
    //  delete handler
    if (window.confirm('Are you sure to delete?')) {
      dispatch(deleteOrder(order._id));
    }
  };
  return (
    <div>
      <h1>Đơn hàng</h1>
      {loadingDelete && <LoadingBox></LoadingBox>}
      {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tài khoản</th>
                  <th>Ngày</th>
                  <th>Tổng</th>
                  <th>Đã thanh toán</th>
                  <th>Đã giao hàng</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.user.name}</td>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>{order.totalPrice.toFixed(2)}</td>
                    <td>{order.isPaid ? 'Yes' : 'No'}</td>
                    <td>
                      {order.isDelivered
                        ? order.deliveredAt.substring(0, 10)
                        : 'No'}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="small"
                        onClick={() => {
                          props.history.push(`/order/${order._id}`);
                        }}
                      >
                        Chi tiết
                  </button>
                      <button
                        type="button"
                        className="small"
                        onClick={() => deleteHandler(order)}
                      >
                        Xóa
                  </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
    </div>
  );
}