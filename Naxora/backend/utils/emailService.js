import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOrderConfirmationEmail = async (order, user) => {
  const itemsHTML = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px;border-bottom:1px solid #f0f0f0">
          <strong>${item.name}</strong>
        </td>
        <td style="padding:10px;border-bottom:1px solid #f0f0f0;text-align:center">
          ${item.quantity}
        </td>
        <td style="padding:10px;border-bottom:1px solid #f0f0f0;text-align:right">
          ₹${(item.price * item.quantity).toLocaleString()}
        </td>
      </tr>`
    )
    .join('');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#f8f4ff;font-family:'Segoe UI',Arial,sans-serif">
  <div style="max-width:600px;margin:30px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08)">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#7c3aed,#4f46e5);padding:40px 30px;text-align:center">
      <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:-0.5px">
        Payal<span style="color:#e9d5ff">&amp;Co</span>
      </h1>
      <p style="margin:8px 0 0;color:#e9d5ff;font-size:14px">Premium Shopping Experience</p>
    </div>

    <!-- Thank You Message -->
    <div style="padding:36px 30px 20px;text-align:center">
      <div style="font-size:48px;margin-bottom:16px">🎉</div>
      <h2 style="margin:0 0 10px;color:#1f2937;font-size:24px;font-weight:700">
        Thank you for shopping, ${user.name.split(' ')[0]}!
      </h2>
      <p style="margin:0;color:#6b7280;font-size:15px;line-height:1.6">
        Your order has been placed successfully. We're so excited to get this to you!
      </p>
    </div>

    <!-- Order Info Box -->
    <div style="margin:0 30px;background:#f8f4ff;border-radius:12px;padding:20px">
      <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px">
        <div>
          <p style="margin:0;font-size:12px;color:#9ca3af;text-transform:uppercase;font-weight:600">Order ID</p>
          <p style="margin:4px 0 0;font-size:14px;color:#1f2937;font-weight:700;font-family:monospace">
            #${order._id.toString().slice(-10).toUpperCase()}
          </p>
        </div>
        <div>
          <p style="margin:0;font-size:12px;color:#9ca3af;text-transform:uppercase;font-weight:600">Date</p>
          <p style="margin:4px 0 0;font-size:14px;color:#1f2937;font-weight:600">
            ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div>
          <p style="margin:0;font-size:12px;color:#9ca3af;text-transform:uppercase;font-weight:600">Payment</p>
          <p style="margin:4px 0 0;font-size:14px;color:#059669;font-weight:600">💰 Cash on Delivery</p>
        </div>
      </div>
    </div>

    <!-- Items Table -->
    <div style="padding:24px 30px">
      <h3 style="margin:0 0 16px;color:#1f2937;font-size:16px;font-weight:700">Order Items</h3>
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="background:#f9fafb">
            <th style="padding:10px;text-align:left;font-size:12px;color:#6b7280;text-transform:uppercase">Product</th>
            <th style="padding:10px;text-align:center;font-size:12px;color:#6b7280;text-transform:uppercase">Qty</th>
            <th style="padding:10px;text-align:right;font-size:12px;color:#6b7280;text-transform:uppercase">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>

      <!-- Price Summary -->
      <div style="margin-top:16px;border-top:2px solid #f0f0f0;padding-top:16px">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px">
          <span style="color:#6b7280;font-size:14px">Subtotal</span>
          <span style="color:#1f2937;font-size:14px">₹${order.itemsTotal.toLocaleString()}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:8px">
          <span style="color:#6b7280;font-size:14px">Shipping</span>
          <span style="color:${order.shippingCharge === 0 ? '#059669' : '#1f2937'};font-size:14px">
            ${order.shippingCharge === 0 ? 'FREE' : '₹' + order.shippingCharge}
          </span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:8px">
          <span style="color:#6b7280;font-size:14px">GST (18%)</span>
          <span style="color:#1f2937;font-size:14px">₹${order.tax.toLocaleString()}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:12px;padding-top:12px;border-top:1px solid #e5e7eb">
          <span style="color:#1f2937;font-size:16px;font-weight:700">Grand Total</span>
          <span style="color:#7c3aed;font-size:18px;font-weight:800">₹${order.grandTotal.toLocaleString()}</span>
        </div>
      </div>
    </div>

    <!-- Shipping Address -->
    <div style="margin:0 30px 24px;background:#f0fdf4;border-radius:12px;padding:18px">
      <h3 style="margin:0 0 10px;color:#1f2937;font-size:14px;font-weight:700">📦 Shipping To</h3>
      <p style="margin:0;color:#374151;font-size:14px;line-height:1.8">
        ${order.shippingAddress.street}<br>
        ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
        ${order.shippingAddress.country}<br>
        📞 ${order.shippingAddress.phone}
      </p>
    </div>

    <!-- COD Note -->
    <div style="margin:0 30px 30px;background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:16px;text-align:center">
      <p style="margin:0;color:#92400e;font-size:14px">
        💰 <strong>Cash on Delivery</strong> — Please keep exact change ready at the time of delivery.
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f8f4ff;padding:24px 30px;text-align:center;border-top:1px solid #ede9fe">
      <p style="margin:0 0 6px;color:#7c3aed;font-size:16px;font-weight:800">Payal&amp;Co</p>
      <p style="margin:0;color:#9ca3af;font-size:12px">
        Thank you for choosing us! Happy Shopping 🛍️
      </p>
      <p style="margin:10px 0 0;color:#d1d5db;font-size:11px">
        This is an automated email. Please do not reply.
      </p>
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: `🎉 Order Confirmed — Thank you for shopping at Payal&Co!`,
    html,
  });
};

// Send welcome email on register
export const sendWelcomeEmail = async (user) => {
  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f8f4ff;font-family:'Segoe UI',Arial,sans-serif">
  <div style="max-width:600px;margin:30px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08)">
    <div style="background:linear-gradient(135deg,#7c3aed,#4f46e5);padding:40px 30px;text-align:center">
      <h1 style="margin:0;color:#fff;font-size:28px;font-weight:800">Payal<span style="color:#e9d5ff">&amp;Co</span></h1>
    </div>
    <div style="padding:40px 30px;text-align:center">
      <div style="font-size:48px;margin-bottom:16px">👋</div>
      <h2 style="margin:0 0 10px;color:#1f2937;font-size:22px">Welcome, ${user.name.split(' ')[0]}!</h2>
      <p style="color:#6b7280;font-size:15px;line-height:1.6">
        Your account has been created successfully.<br>
        Start exploring our amazing collection!
      </p>
    </div>
    <div style="padding:0 30px 40px;text-align:center">
      <p style="color:#9ca3af;font-size:12px">Payal&amp;Co — Happy Shopping 🛍️</p>
    </div>
  </div>
</body>
</html>`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: `Welcome to Payal&Co! 🎉`,
    html,
  });
};