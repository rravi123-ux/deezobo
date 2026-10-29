import express from "express";
import Stripe from "stripe";
import cors from "cors";
import dotenv from "dotenv";


dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { cartItems, customer, beverages} = req.body;

    const subtotal = cartItems.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );


    const orderPayload = {
        products: items,
        total_price: subtotal,
        user: (await supabase.auth.getUser()).data.user?.id,
        shipping_address: "TODO"
    };

    const { data: orderData, error: orderError } = await supabase
      .from("Orders")
      .insert([orderPayload])
      .select()
      .single();

    if (orderError) {
      console.error("Supabase pending order insert error:", orderError);
      return res.status(500).json({ error: orderError.message });
    }

    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: beverages.find((x) => {
            x.id === item.productId && x.active;
          }).name,
          images: beverages.find((x) => {
            x.id === item.productId && x.active;
          }).imageUrl ? [beverages.find((x) => {
            x.id === item.productId && x.active;
          }).imageUrl] : []
        },
        unit_amount: Math.round(Number(beverages.find((x) => {
            x.id === item.productId && x.active;
          }).options.priceMinor) * 100),
      },
      quantity: item.quantity,
    }));

    

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      customer_email: customer.email,
      phone_number_collection: {
        enabled: true,
      },
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      success_url: `${process.env.CLIENT_URL}/cart?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart?canceled=true`,
      metadata: {
        order_id: orderData.order_id,
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Create checkout error:", err);
    res.status(500).json({ error: err.message });
  }
});


app.listen(4242, () => {
  console.log("Stripe server running on http://localhost:4242");
});