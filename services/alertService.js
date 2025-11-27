// services/alertService.js
import { supabase } from "../supabase.js";

// ✔ 알림 체크 메인 함수
export async function checkAlerts() {
  // 1) alerts 테이블에서 모든 알림 설정 가져오기
  const { data: alerts, error: alertError } = await supabase
    .from("alerts")
    .select("*");

  if (alertError) {
    console.error("❌ alerts 조회 실패:", alertError);
    return;
  }

  if (!alerts || alerts.length === 0) {
    console.log("ℹ️ 알림 설정 없음");
    return;
  }

  console.log(`🔔 알림 체크 시작: 총 ${alerts.length}개`);

  // 2) 각 alert에 대해 가격 비교
  for (const alert of alerts) {
    const { product_id, target_price } = alert;

    // 최신 가격 1개만 가져오기
    const { data: priceRow, error: priceError } = await supabase
      .from("prices")
      .select("*")
      .eq("product_id", product_id)
      .order("checked_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (priceError) {
      console.error(`❌ 가격 조회 실패 product_id=${product_id}`, priceError);
      continue;
    }

    if (!priceRow) {
      console.log(`⚠️ 최근 가격 없음 product_id=${product_id}`);
      continue;
    }

    const currentPrice = priceRow.price;

    console.log(
      `🔎 product_id=${product_id} | 현재가격=${currentPrice} | 목표가격=${target_price}`
    );

    // 3) 조건 검사
    if (currentPrice <= target_price) {
      console.log(
        `🎉 알림 조건 충족! product_id=${product_id} 가격=${currentPrice}`
      );

      // ✔ 여기서 나중에 FCM push 보내면 됨.
      // 지금은 알림 대기 상태로 큐에 넣기
      await registerPendingAlert(alert, currentPrice);
    }
  }
}

// ✔ 알림 대기 상태 insert (나중에 푸시로 전송됨)
async function registerPendingAlert(alert, price) {
  const payload = {
    alert_id: alert.id,
    product_id: alert.product_id,
    price: price,
    detected_at: new Date().toISOString(),
  };

  // pending_alerts 테이블 없으면 만들라고 할게
  const { error } = await supabase.from("pending_alerts").insert(payload);

  if (error) {
    console.error("❌ pending_alerts 저장 실패:", error);
  } else {
    console.log("📩 pending_alerts 저장됨!", payload);
  }
}
