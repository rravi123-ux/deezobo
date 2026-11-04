import { useEffect, useState } from 'react';
import { money } from '../../lib/catalog';
import { fetchOrders } from '../../services/orders';
import type { Order } from '../../types/catalog';

export default function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    void fetchOrders()
      .then((data) => {
        if (active) setOrders(data);
      })
      .catch((reason: unknown) => {
        if (active)
          setError(
            reason instanceof Error
              ? reason.message
              : 'Orders could not be loaded.',
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  if (loading) return <p role="status">Loading orders…</p>;
  if (error)
    return (
      <p className="notice" role="alert">
        {error}
      </p>
    );
  if (!orders.length)
    return (
      <p className="empty-state">No Stripe orders have been created yet.</p>
    );
  return (
    <div className="order-list">
      {orders.map((order) => (
        <article className="order-card" key={order.id}>
          <div className="order-card-heading">
            <div>
              <strong>{order.customerEmail}</strong>
              <span>
                {new Date(order.createdAt).toLocaleString()} ·{' '}
                {order.fulfillmentMethod}
              </span>
            </div>
            <span className={`status-badge status-${order.status}`}>
              {order.status.replaceAll('_', ' ')}
            </span>
          </div>
          <ul>
            {order.items.map((item) => (
              <li key={item.id}>
                <span>
                  {item.quantity} × {item.productName} — {item.optionLabel}
                </span>
                <strong>{money(item.lineTotalMinor)}</strong>
              </li>
            ))}
          </ul>
          <div className="order-total">
            <span>Order {order.id.slice(0, 8).toUpperCase()}</span>
            <strong>
              {money(order.amountTotalMinor ?? order.itemSubtotalMinor)}
            </strong>
          </div>
        </article>
      ))}
    </div>
  );
}
