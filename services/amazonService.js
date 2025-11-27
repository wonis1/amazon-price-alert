export async function fetchAmazonPrice(asin) {
  console.log(`🔍 [Mock] ASIN 가격 조회: ${asin}`);
  return Number((Math.random() * 100 + 1).toFixed(2));
}
