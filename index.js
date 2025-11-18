import express from "express";
import "dotenv/config";
import { supabase } from "./supabase.js";

const app = express();
app.use(express.json());


app.get("/debug-env", (req, res) => {
    res.json({
        url: process.env.SUPABASE_URL,
        keyExists: !!process.env.SUPABASE_KEY,
    });
});

// 기본 라우트
app.get("/", (req, res) => {
    res.send("Amazon Price Alert API Running");
});

// Supabase Insert 테스트 라우트
app.post("/test-add-product", async (req, res) => {
    const { asin } = req.body;

    const { data, error } = await supabase
        .from("products")
        .insert({ asin });

    if (error) return res.status(400).json({ error });
    res.json({ data });
});

// 상품 등록 API
app.post("/products", async (req, res) => {
    const { asin } = req.body;

    if (!asin) {
        return res.status(400).json({ error: "ASIN is required" });
    }

    // 1) 이미 존재하는 ASIN인지 확인
    const { data: exists, error: findError } = await supabase
        .from("products")
        .select("*")
        .eq("asin", asin);

    if (findError) {
        console.log("FIND ERROR:", findError);
        return res.status(500).json({ error: findError });
    }


    if (exists.length > 0) {
        return res.json({
            message: "Product already registered",
            product: exists[0],
        });
    }

    // 2) 새 상품 등록
    const { data, error } = await supabase
        .from("products")
        .insert({ asin })
        .select()
        .single();

    if (error) {
        return res.status(500).json({ error: "Failed to register product" });
    }

    res.json({
        message: "Product registered successfully",
        product: data,
    });
});

// 가격 가져오기 (Mock 버전)
app.post("/products/:id/price", async (req, res) => {
  const { id } = req.params;

  // 1) 랜덤 가격 생성 (테스트용)
  const price = Number((Math.random() * 100 + 1).toFixed(2));

  // 2) DB에 저장
  const { data, error } = await supabase
    .from("prices")
    .insert({ product_id: id, price })
    .select()
    .single();

  if (error) return res.status(500).json({ error });

  res.json({
    message: "Price updated",
    price_data: data,
  });
});

// 알림 설정 API
app.post("/products/:id/alert", async (req, res) => {
  const { id } = req.params;
  const { target_price, email } = req.body;

  if (!target_price || !email) {
    return res.status(400).json({ error: "target_price and email required" });
  }

  const { data, error } = await supabase
    .from("alerts")
    .insert({
      product_id: id,
      target_price,
      email,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error });

  res.json({
    message: "Alert created",
    alert: data,
  });
});


app.listen(3000, () => {
    console.log("Server running: http://localhost:3000");
});
