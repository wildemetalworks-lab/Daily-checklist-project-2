document.getElementById('checkForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const form = this;
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    // Basic validation
    const activeChecklist = document.querySelector('.checklist.active');
    if (!activeChecklist) {
        alert("Please select an equipment type first.");
        resetButton();
        return;
    }

    const items = activeChecklist.querySelectorAll('.item');
    const unchecked = Array.from(items).filter(item => 
        !item.querySelector('.pass').checked && !item.querySelector('.fail').checked
    );
    if (unchecked.length > 0) {
        if (!confirm(`You have ${unchecked.length} unchecked item(s). Submit anyway?`)) {
            resetButton();
            return;
        }
    }

    // Gather data (your existing code is fine here – keep it)
    const equipmentType = document.getElementById('equipment').options[document.getElementById('equipment').selectedIndex].text;
    const date = document.getElementById('date').value;
    const operator = document.getElementById('operator').value;
    const equipmentId = document.getElementById('equipmentId').value;

    let hasFail = false;
    let results = [];
    items.forEach(item => {
        const name = item.querySelector('strong').textContent;
        const pass = item.querySelector('.pass').checked;
        const fail = item.querySelector('.fail').checked;
        const notes = item.querySelector('textarea').value.trim();
        let status = 'Not checked';
        if (pass) status = 'Pass';
        if (fail) { status = 'Fail'; hasFail = true; }
        results.push({ name, status, notes: notes || 'No notes' });
    });

    // Show warning & build summary (keep your existing code for this part)

    // ... (your summaryHTML generation and display code here) ...

    // Payload
    const payload = { date, equipmentType, equipmentId, operator, hasFail, items: results };

    // Send to GAS – update the URL after you redeploy!
    fetch("https://script.google.com/macros/s/AKfycbzjzDgKCWxM2YDA8etWSd-hO14fdVG81xTGf51oNCwjWpi6xzWliT7MnUiLDTbzt4ozqg/exec", {
        method: "POST",
        mode: "no-cors",                     // Key for GAS reliability
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(() => {
        alert("Daily check submitted! (Data should now be in your Google Sheet)");
    })
    .catch(err => {
        console.error("Send error:", err);
        alert("There was a problem sending the data – check console. Summary still saved locally.");
    })
    .finally(() => {
        resetButton();
    });

    function resetButton() {
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit Check";
    }

    // Your scroll to summary code...
});
