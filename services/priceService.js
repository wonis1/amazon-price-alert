import { supabase } from "../supabase.js";
import { fetchAmazonPrice } from "./amazonService.js";

export async function updateAllProductPrices() {
  const { data: products, error } = await supabase
    .from("products")
    .select("*");

  if (error) {
    console.error("❌ products 조회 실패:", error);
    return;
  }

  console.log(`📦 ${products.length}개 상품 가격 체크 시작`);

  for (const p of products) {
    const price = await fetchAmazonPrice(p.asin);

    const { error: insertError } = await supabase
      .from("prices")
      .insert({
        product_id: p.id,
        price: price,
        checked_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error(`❌ 가격 저장 실패 (${p.asin}):`, insertError);
    } else {
      console.log(`💰 ${p.asin} 가격 저장됨 → $${price}`);
    }
  }
}
