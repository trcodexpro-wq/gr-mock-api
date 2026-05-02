app.post("/api/GoodsReceipt", (req, res) => {
    // ✅ Date yerine docDate kullan — JS built-in Date ile çakışıyor
    const { Date: docDate, DeliveryNo, InvoiceNo, Items } = req.body;

    console.log("GR Request:", JSON.stringify(req.body, null, 2));

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
        if (!item.PurchaseOrder) {
            return res.status(400).json({
                ReturnType:       "E",
                ReturnMessage:    `PurchaseOrder eksik: ${JSON.stringify(item)}`,
                MaterialDocument: null,
                MatDocumentYear:  null
            });
        }
        if (!item.PurchaseOrderItem) {
            return res.status(400).json({
                ReturnType:       "E",
                ReturnMessage:    `PurchaseOrderItem eksik: ${JSON.stringify(item)}`,
                MaterialDocument: null,
                MatDocumentYear:  null
            });
        }
        if (!item.EntryQuantity || item.EntryQuantity <= 0) {
            return res.status(400).json({
                ReturnType:       "E",
                ReturnMessage:    `EntryQuantity geçersiz: ${JSON.stringify(item)}`,
                MaterialDocument: null,
                MatDocumentYear:  null
            });
        }
    }

    // ✅ Başarılı — MatDoc numarası üret
    const matDocNumber = "5000" + Math.floor(Math.random() * 900000 + 100000).toString();
    const matDocYear   = new globalThis.Date().getFullYear().toString();

    return res.status(200).json({
        ReturnType:       "S",
        ReturnMessage:    `Goods Receipt başarıyla oluşturuldu. ${Items.length} kalem işlendi. DeliveryNo: ${DeliveryNo || "-"}`,
        MaterialDocument: matDocNumber,
        MatDocumentYear:  matDocYear
    });
});
