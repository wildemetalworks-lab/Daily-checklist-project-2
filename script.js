// Wait for page to fully load
document.addEventListener('DOMContentLoaded', function () {
  // Set today's date
  document.getElementById('checkDate').valueAsDate = new Date();

  const equipmentSelect = document.getElementById('equipmentType');
  const forkliftSection = document.getElementById('forkliftSection');
  const loaderSection = document.getElementById('loaderSection');
  const message = document.getElementById('selectionMessage');

  // Function to update visibility
  function updateChecklist() {
    const value = equipmentSelect.value;

    forkliftSection.classList.toggle('active', value === 'forklift');
    loaderSection.classList.toggle('active', value === 'loader');

    if (value === '') {
      message.style.display = 'block';
    } else {
      message.style.display = 'none';
    }
  }

  // Run on change and also immediately in case page reloads with a value
  equipmentSelect.addEventListener('change', updateChecklist);
  updateChecklist(); // Initial check

  // Submit button logic
  document.getElementById('submitBtn').addEventListener('click', function () {
    const equipmentType = equipmentSelect.value;
    if (!equipmentType) {
      alert('Please select an equipment type.');
      return;
    }

    const date = document.getElementById('checkDate').value;
    const operator = document.getElementById('operatorName').value.trim();
    const eqID = document.getElementById('equipmentID').value.trim();

    if (!date || !operator || !eqID) {
      alert('Please fill in Date, Operator Name, and Equipment ID.');
      return;
    }

    const section = equipmentType === 'forklift' ? forkliftSection : loaderSection;
    const items = section.querySelectorAll('.item');
    let hasFail = false;
    let summaryHTML = `
      <h2>Equipment Check Summary</h2>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Equipment:</strong> ${equipmentType === 'forklift' ? 'Forklift' : 'Front-End Loader'} - ${eqID}</p>
      <p><strong>Operator:</strong> ${operator}</p>
      <hr><h3>Checklist Results</h3>
    `;

    items.forEach(item => {
      const name = item.getAttribute('data-name');
      const pass = item.querySelector('.pass').checked;
      const fail = item.querySelector('.fail').checked;
      const notes = item.querySelector('textarea').value.trim();

      let status = 'Not checked';
      let statusClass = '';
      if (pass && !fail) { status = 'PASS'; statusClass = 'pass'; }
      if (fail && !pass) { status = 'FAIL'; statusClass = 'fail'; hasFail = true; }
      if (pass && fail) { status = 'Invalid'; statusClass = 'fail'; hasFail = true; }

      summaryHTML += `
        <div style="margin: 15px 0;">
          <strong>${name}</strong><br>
          <span class="${statusClass}">${status}</span>
          ${notes ? '<br><em>Notes: ' + notes + '</em>' : ''}
        </div>
      `;
    });

    if (hasFail) {
      summaryHTML = `<div class="warning">⚠️ Equipment not safe – report defects immediately!</div>` + summaryHTML;
    } else {
      summaryHTML = `<div class="safe">✓ All checks passed – Equipment safe to operate</div>` + summaryHTML;
    }

    summaryHTML += `<br><button onclick="window.print()" style="padding:12px 24px; font-size:16px; cursor:pointer;">Print / Save as PDF</button>`;

    document.getElementById('summary').innerHTML = summaryHTML;
    document.getElementById('summary').style.display = 'block';
    document.getElementById('formSection').style.display = 'none';
    document.getElementById('summary').scrollIntoView({ behavior: 'smooth' });
  });
});


