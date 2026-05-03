const express = require("express");
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

const getNow = () => new (global.Date)();

// ✅ Mock PO Data
const mockPOList = [
    { EBELN: "4500000001", EBELP: "10", MATNR: "STK-005", MAKTX: "BALDO 5 KG PİRİNÇ",   EINDT: "2020-02-17", WERKS: "1000", WERKS_TEXT: "İstanbul Fabrikası" },
    { EBELN: "4500000001", EBELP: "20", MATNR: "STK-006", MAKTX: "BALDO 10 KG PİRİNÇ",  EINDT: "2020-02-17", WERKS: "1000", WERKS_TEXT: "İstanbul Fabrikası" },
    { EBELN: "4500000002", EBELP: "10", MATNR: "STK-005", MAKTX: "BALDO 5 KG PİRİNÇ",   EINDT: "2020-03-01", WERKS: "2000", WERKS_TEXT: "Ankara Fabrikası"   },
    { EBELN: "4500000002", EBELP: "20", MATNR: "STK-010", MAKTX: "JASMINE PİRİNÇ 5 KG", EINDT: "2020-03-01", WERKS: "2000", WERKS_TEXT: "Ankara Fabrikası"   },
    { EBELN: "4500000003", EBELP: "10", MATNR: "STK-007", MAKTX: "BULGUR 5 KG",          EINDT: "2020-02-20", WERKS: "1000", WERKS_TEXT: "İstanbul Fabrikası" },
    { EBELN: "4500000003", EBELP: "20", MATNR: "STK-008", MAKTX: "MERCİMEK 5 KG",        EINDT: "2020-02-20", WERKS: "3000", WERKS_TEXT: "İzmir Fabrikası"    },
    { EBELN: "4500000004", EBELP: "10", MATNR: "STK-005", MAKTX: "BALDO PİRİNÇ 5 KG",   EINDT: "2020-01-15", WERKS: "3000", WERKS_TEXT: "İzmir Fabrikası"    },
    { EBELN: "4500000004", EBELP: "20", MATNR: "STK-009", MAKTX: "NOHUT 1 KG",           EINDT: "2020-01-15", WERKS: "1000", WERKS_TEXT: "İstanbul Fabrikası" }
];

app.get("/", (req, res) => {
    res.json({ status: "GR Mock API çalışıyor" });
});

// ✅ GET /api/POList — tüm liste, opsiyonel filtreler
app.get("/api/POList", (req, res) => {
    console.log("POList isteği alındı, query:", req.query);

    const { EBELN, MATNR, WERKS } = req.query;
    let result = [...mockPOList];

    if (EBELN) result = result.filter(p => p.EBELN === EBELN);
    if (MATNR) result = result.filter(p => p.MATNR === MATNR);
    if (WERKS) result = result.filter(p => p.WERKS === WERKS);

    console.log(`POList response: ${result.length} kayıt`);
    return res.status(200).json({ value: result });
});

// ✅ GET /api/POList/:ebeln — tekil PO
app.get("/api/POList/:ebeln", (req, res) => {
    const { ebeln } = req.params;
    const result = mockPOList.filter(p => p.EBELN === ebeln);

    if (!result.length) {
        return res.status(404).json({ error: `PO bulunamadı: ${ebeln}` });
    }

    return res.status(200).json({ value: result });
});

// ✅ POST /api/GoodsReceipt
app.post("/api/GoodsReceipt", (req, res) => {
    const body       = req.body;
    const docDate    = body.Date;
    const DeliveryNo = body.DeliveryNo;
    const Items      = body.Items;

    console.log("GR Request:", JSON.stringify(body, null, 2));

    if (!docDate) {
        const errorResp = { ReturnType: "E", ReturnMessage: "Date zorunlu", MaterialDocument: null, MatDocumentYear: null };
        console.log("GR Response 400:", JSON.stringify(errorResp));
        return res.status(400).json(errorResp);
    }

    if (!Items || !Array.isArray(Items) || Items.length === 0) {
        const errorResp = { ReturnType: "E", ReturnMessage: "Items array boş olamaz", MaterialDocument: null, MatDocumentYear: null };
        console.log("GR Response 400:", JSON.stringify(errorResp));
        return res.status(400).json(errorResp);
    }

    for (const item of Items) {
        if (!item.PurchaseOrder || item.PurchaseOrder.trim() === "") {
            const errorResp = { ReturnType: "E", ReturnMessage: "PurchaseOrder eksik — lütfen önce PO eşleştirmesi yapın", MaterialDocument: null, MatDocumentYear: null };
            console.log("GR Response 400:", JSON.stringify(errorResp));
            return res.status(400).json(errorResp);
        }
        if (!item.PurchaseOrderItem || item.PurchaseOrderItem.trim() === "") {
            const errorResp = { ReturnType: "E", ReturnMessage: "PurchaseOrderItem eksik — lütfen önce PO eşleştirmesi yapın", MaterialDocument: null, MatDocumentYear: null };
            console.log("GR Response 400:", JSON.stringify(errorResp));
            return res.status(400).json(errorResp);
        }
        if (!item.EntryQuantity || item.EntryQuantity <= 0) {
            const errorResp = { ReturnType: "E", ReturnMessage: "EntryQuantity geçersiz", MaterialDocument: null, MatDocumentYear: null };
            console.log("GR Response 400:", JSON.stringify(errorResp));
            return res.status(400).json(errorResp);
        }
    }

    const matDocNumber = "5000" + Math.floor(Math.random() * 900000 + 100000).toString();
    const matDocYear   = String(getNow().getFullYear());

    const successResp = {
        ReturnType:       "S",
        ReturnMessage:    `Goods Receipt başarıyla oluşturuldu. ${Items.length} kalem işlendi. DeliveryNo: ${DeliveryNo || "-"}`,
        MaterialDocument: matDocNumber,
        MatDocumentYear:  matDocYear
    };
    console.log("GR Response 200:", JSON.stringify(successResp));
    return res.status(200).json(successResp);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`GR API port ${PORT}de çalışıyor`));
