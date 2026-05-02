
const express = require("express");
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ status: "GR Mock API çalışıyor" });
});

app.post("/api/GoodsReceipt", (req, res) => {
    const { Date, DeliveryNo, InvoiceNo, Items } = req.body;

    console.log("GR Request:", JSON.stringify(req.body, null, 2));

    if (!Date) {
        return res.status(400).json({
            ReturnType:    "E",
            ReturnMessage: "Date zorunlu"
        });
    }

    if (!Items || !Array.isArray(Items) || Items.length === 0) {
        return res.status(400).json({
            ReturnType:    "E",
            ReturnMessage: "Items array boş olamaz"
        });
    }

    for (const item of Items) {
        if (!item.PurchaseOrder) {
            return res.status(400).json({
                ReturnType:    "E",
                ReturnMessage: `PurchaseOrder eksik: ${JSON.stringify(item)}`
            });
        }
        if (!item.PurchaseOrderItem) {
            return res.status(400).json({
                ReturnType:    "E",
                ReturnMessage: `PurchaseOrderItem eksik: ${JSON.stringify(item)}`
            });
        }
        if (!item.EntryQuantity || item.EntryQuantity <= 0) {
            return res.status(400).json({
                ReturnType:    "E",
                ReturnMessage: `EntryQuantity geçersiz: ${JSON.stringify(item)}`
            });
        }
    }

    return res.status(200).json({
        ReturnType:    "S",
        ReturnMessage: `Goods Receipt başarıyla oluşturuldu. ${Items.length} kalem işlendi. DeliveryNo: ${DeliveryNo || "-"}`
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`GR API port ${PORT}de çalışıyor`));
