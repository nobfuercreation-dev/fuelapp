// 保存ボタンのクリックイベント
document.getElementById("saveBtn").addEventListener("click", saveRecord);

// 編集中の行番号（編集していないときは null）
let editIndex = null;

// 保存（新規 or 更新）
function saveRecord() {
    let records = JSON.parse(localStorage.getItem("fuelRecords")) || [];

    const record = {
        date: document.getElementById("date").value,
        type: document.getElementById("type").value,
        amount: parseFloat(document.getElementById("amount").value),
        price: parseFloat(document.getElementById("price").value),
        odometer: parseFloat(document.getElementById("odometer").value)
    };

//★給油金額を自動計算(四捨五入）
record.priceTotal = Math.round(record.amount * record.price); 


    // --- 差分計算 ---
    let lastRecord = null;

    if (editIndex === null) {
        // 新規追加 → 最後のレコードが前回
        lastRecord = records.length > 0 ? records[records.length - 1] : null;
    } else {
        // 編集更新 → ひとつ前のレコードを参照
        lastRecord = editIndex > 0 ? records[editIndex - 1] : null;
    }

    const distance = lastRecord ? record.odometer - lastRecord.odometer : 0;
    const fuelEfficiency = distance > 0 ? (distance / record.amount).toFixed(2) : "-";

    record.distance = distance;
    record.fuelEfficiency = fuelEfficiency;

    // --- 保存処理 ---
    if (editIndex === null) {
        records.push(record);
    } else {
        records[editIndex] = record;
        editIndex = null;
        document.getElementById("saveBtn").textContent = "保存";
    }

//★保存前に日付でソート
records.sort((a, b) => new Date(a.date) - new Date(b.date));

    localStorage.setItem("fuelRecords", JSON.stringify(records));
    displayRecords();

    // フォームクリア
    document.getElementById("date").value = "";
    document.getElementById("type").value = "レギュラー";
    document.getElementById("amount").value = "";
    document.getElementById("price").value = "";
    document.getElementById("odometer").value = "";
}

// 削除処理
function deleteRecord(index) {
    const records = JSON.parse(localStorage.getItem("fuelRecords")) || [];

    if (!confirm("この記録を削除しますか？")) {
        return;
    }

    records.splice(index, 1);

    localStorage.setItem("fuelRecords", JSON.stringify(records));
    displayRecords();
}

// 一覧表示
function displayRecords() {
    let records = JSON.parse(localStorage.getItem("fuelRecords")) || [];

//★日付でソート（古い順）
    records.sort((a, b) => new Date(a.date) - new Date(b.Date));

    const list = document.getElementById("recordList");
    list.innerHTML = "";

    records.forEach((record, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${record.date}</td>
            <td>${record.type}</td>
            <td>${record.amount}</td>
            <td>${record.price}</td>
	    <td>${record.priceTotal}</td>
            <td>${record.odometer}</td>
            <td>${record.distance}</td>
            <td>${record.fuelEfficiency}</td>
            <td>
                <button onclick="editRecord(${index})">編集</button>
                <button onclick="deleteRecord(${index})">削除</button>
            </td>
        `;

        list.appendChild(row);
    });
}

// 編集処理
function editRecord(index) {
    const records = JSON.parse(localStorage.getItem("fuelRecords")) || [];
    const record = records[index];

    document.getElementById("date").value = record.date;
    document.getElementById("type").value = record.type;
    document.getElementById("amount").value = record.amount;
    document.getElementById("price").value = record.price;
    document.getElementById("odometer").value = record.odometer;

    editIndex = index;
    document.getElementById("saveBtn").textContent = "更新";
}

// 初回表示
displayRecords();
