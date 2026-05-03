server.js : "const express = require("express");
const app = express();
// ✅ CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    next();
});
app.use(express.json());
const getNow = () => new ([global.Date](http://global.Date))();
app.get("/", (req, res) => {
    res.json({ status: "GR Mock API çalışıyor" });
});
[app.post](http://app.post)("/api/GoodsReceipt", (req, res) => {
    const body       = req.body;
    const docDate    = [body.Date](http://body.Date);
    const DeliveryNo = body.DeliveryNo;
    const Items      = body.Items;
    console.log("GR Request:", JSON.stringify(body, null, 2));
    if (!docDate) {
        return res.status(400).json({
            ReturnType:       "E",
            ReturnMessage:    "Date zorunlu",
            MaterialDocument: null,
            MatDocumentYear:  null
        });
    }
    if (!Items || !Array.isArray(Items) || Items.length === 0) {
        return res.status(400).json({
            ReturnType:       "E",
            ReturnMessage:    "Items array boş olamaz",
            MaterialDocument: null,
            MatDocumentYear:  null
        });
    }
    for (const item of Items) {
        if (!item.PurchaseOrder || item.PurchaseOrder.trim() === "") {
            return res.status(400).json({
                ReturnType:       "E",
                ReturnMessage:    "PurchaseOrder eksik — lütfen önce PO eşleştirmesi yapın",
                MaterialDocument: null,
                MatDocumentYear:  null
            });
        }
        if (!item.PurchaseOrderItem || item.PurchaseOrderItem.trim() === "") {
            return res.status(400).json({
                ReturnType:       "E",
                ReturnMessage:    "PurchaseOrderItem eksik — lütfen önce PO eşleştirmesi yapın",
                MaterialDocument: null,
                MatDocumentYear:  null
            });
        }
        if (!item.EntryQuantity || item.EntryQuantity <= 0) {
            return res.status(400).json({
                ReturnType:       "E",
                ReturnMessage:    "EntryQuantity geçersiz",
                MaterialDocument: null,
                MatDocumentYear:  null
            });
        }
    }
    const matDocNumber = "5000" + Math.floor(Math.random() * 900000 + 100000).toString();
    const matDocYear   = String(getNow().getFullYear());
    return res.status(200).json({
        ReturnType:       "S",
        ReturnMessage:    `Goods Receipt başarıyla oluşturuldu. ${Items.length} kalem işlendi. DeliveryNo: ${DeliveryNo || "-"}`,
        MaterialDocument: matDocNumber,
        MatDocumentYear:  matDocYear
    });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`GR API port ${PORT}de çalışıyor`));
" mevcut hali bu şekilde sen ekleyip verebilir misin tamamını
