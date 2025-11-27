import cron from "node-cron";
import { updateAllProductPrices } from "./services/priceService.js";
import { checkAlerts } from "./services/alertService.js";

console.log("🟢 Cron Started");

cron.schedule("*/5 * * * *", async () => {
  console.log("⏰ 5분 크론 실행");

  await updateAllProductPrices();  // 1) 가격 업데이트
  await checkAlerts();             // 2) 알림 조건 체크
});
