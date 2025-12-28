// Set today's date automatically
document.getElementById('date').valueAsDate = new Date();

// Show correct checklist when equipment is selected
document.getElementById('equipment').addEventListener('change', function() {
    const value = this.value;
    document.getElementById('forklift-checklist').classList.toggle('active', value === 'forklift');
    document.getElementById('loader-checklist').classList.toggle('active', value === 'loader');
});

// Updates card styles to show if a user has selected failed or not
function updateItemStyle(item) {
    if (item.querySelector('.fail').checked) {
        item.classList.add('fail');
    } else {
        item.classList.remove('fail');
    }
}

// Ensure only one checkbox (Pass or Fail) can be checked per item
document.querySelectorAll('.item').forEach(item => {
    const pass = item.querySelector('.pass');
    const fail = item.querySelector('.fail');

    pass.addEventListener('change', () => {
        if (pass.checked) fail.checked = false;
        updateItemStyle(item);
    });
    fail.addEventListener('change', () => {
        if (fail.checked) pass.checked = false;
        updateItemStyle(item);
    });
});

// Form submission
document.getElementById('checkForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const equipmentType = document.getElementById('equipment').options[document.getElementById('equipment').selectedIndex].text;
    const date = document.getElementById('date').value;
    const operator = document.getElementById('operator').value;
    const equipmentId = document.getElementById('equipmentId').value;

    const items = document.querySelectorAll('.checklist.active .item');
    let hasFail = false;
    let results = [];

    items.forEach(item => {
        const name = item.querySelector('strong').textContent;
        const pass = item.querySelector('.pass').checked;
        const fail = item.querySelector('.fail').checked;
        const notes = item.querySelector('textarea').value.trim();

        let status = 'Not checked';
        if (pass) status = 'Pass';
        if (fail) {
            status = 'Fail';
            hasFail = true;
        }

        results.push({
            name: name,
            status: status,
            notes: notes || 'No notes'
        });
    });

    // Show warning if any fail
    document.getElementById('warning').style.display = hasFail ? 'block' : 'none';

    // Generate summary
    let summaryHTML = `
        <h2>Daily Check Summary</h2>
        <p><strong>Equipment:</strong> ${equipmentType}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Operator:</strong> ${operator}</p>
        <p><strong>Equipment ID:</strong> ${equipmentId}</p>
        <hr>
        <h3>Checklist Results</h3>
    `;

    results.forEach(r => {
        const color = r.status === 'Pass' ? 'green' : r.status === 'Fail' ? 'red' : 'gray';
        summaryHTML += `
            <p><strong>${r.name}</strong><br>
            <span style="color:${color}; font-weight:bold;">${r.status}</span><br>
            Notes: ${r.notes}</p>
        `;
    });

    if (hasFail) {
        summaryHTML += `<p style="color:red; font-weight:bold; font-size:1.2em;">Equipment not safe – report defects immediately!</p>`;
    } else {
        summaryHTML += `<p style="color:green; font-weight:bold;">All checks passed – equipment ready for use.</p>`;
    }

    summaryHTML += `<p style="margin-top:30px; font-size:0.9em; color:#666;">Print this page (Ctrl+P) to keep a record.</p>`;

    const summaryDiv = document.getElementById('summary');
    summaryDiv.innerHTML = summaryHTML;
    summaryDiv.style.display = 'block';

    // Scroll to summary
    summaryDiv.scrollIntoView({ behavior: 'smooth' });

    // Begin processing sending the payload
    const payload = {
      date,
      equipmentType,
      equipmentId,
      operator,
      hasFail,
      items: results
    };

    console.log("Payload is being sent...")
    console.log(payload)

    // Send an email containing a spreadsheet with the data provided
    fetch("https://script.google.com/macros/s/AKfycbzjzDgKCWxM2YDA8etWSd-hO14fdVG81xTGf51oNCwjWpi6xzWliT7MnUiLDTbzt4ozqg/exec", {
      method: "POST",
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then((response) => {
        // Note: GAS always returns 200 OK even on script errors, 
        // so check the 'success' property we set in the GAS script
        if(response.success){
            console.log("Payload is sent.");
        } else {
            console.error("Script Error:", response.error);
        }
    })
    .catch((err) => console.log(err));
});