// TODO: Fetch the current customer's orders; authorize admin reads, manual entry and status changes on the server.
// Intentionally unimplemented; do not return fake successful results.
import { supabase } from "../lib/supabase";
import type { BasketItem } from "../types/catalog";

export async function updateOrders(items: BasketItem[], totalPrice: number) {

    await supabase?.from("Orders").insert({
        products: items,
        total_price: totalPrice / 100,
        user: (await supabase.auth.getUser()).data.user?.id,
        shipping_address: "TODO",
        stripe_session_id: ""
    })
}