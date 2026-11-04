import { useEffect, useState } from 'react';
import { money } from '../../lib/catalog';
import { fetchOrders } from '../../services/orders';
import type { Order } from '../../types/catalog';

const statusLabels: Record<Order['status'], string> = {
  pending_checkout: 'Checkout started',
  pending_payment: 'Payment pending',
  paid: 'Paid',
  payment_failed: 'Payment failed',
  expired: 'Expired',
  refunded: 'Refunded',
};

export default function OrderHistory() {
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
  if (loading) return <p role="status">Loading your orders…</p>;
  if (error)
    return (
      <p className="notice" role="alert">
        {error}
      </p>
    );
  if (!orders.length)
    return (
      <p className="empty-state">You do not have any signed-in orders yet.</p>
    );
  return (
    <section className="order-list" aria-labelledby="order-history-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Receipts and fulfillment</p>
          <h2 id="order-history-title">Your orders</h2>
        </div>
      </div>
      {orders.map((order) => (
        <article className="order-card" key={order.id}>
          <div className="order-card-heading">
            <div>
              <strong>{new Date(order.createdAt).toLocaleDateString()}</strong>
              <span>Order {order.id.slice(0, 8).toUpperCase()}</span>
            </div>
            <span className={`status-badge status-${order.status}`}>
              {statusLabels[order.status]}
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
            <span>
              {order.fulfillmentMethod.replace(/^./, (c) => c.toUpperCase())}
            </span>
            <strong>
              {money(order.amountTotalMinor ?? order.itemSubtotalMinor)}
            </strong>
          </div>
        </article>
      ))}
    </section>
  );
}
