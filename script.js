// Set today's date
document.getElementById('checkDate').valueAsDate = new Date();

// Show/hide correct checklist
document.getElementById('equipmentType').addEventListener('change', function() {
  const type = this.value;
  document.getElementById('forkliftSection').classList.toggle('active', type === 'forklift');
  document.getElementById('loaderSection').classList.toggle('active', type === 'loader');
});

// Submit button
document.getElementById('submitBtn').addEventListener('click', function() {
  const equipmentType = document.getElementById('equipmentType').value;
  if (!equipmentType) return alert('Please select an equipment type.');

  const date = document.getElementById('checkDate').value;
  const operator = document.getElementById('operatorName').value.trim();
  const eqID = document.getElementById('equipmentID').value.trim();

  if (!date || !operator || !eqID) return alert('Please fill in all fields.');

  const section = document.getElementById(equipmentType === 'forklift' ? 'forkliftSection' : 'loaderSection');
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
    if (pass && fail) { status = 'Invalid (both checked)'; statusClass = 'fail'; hasFail = true; }

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

  summaryHTML += `<br><button onclick="window.print()" style="padding:12px 24px; font-size:16px;">Print / Save as PDF</button>`;

  document.getElementById('summary').innerHTML = summaryHTML;
  document.getElementById('summary').style.display = 'block';
  document.getElementById('formSection').style.display = 'none';

  // Smooth scroll to summary
  document.getElementById('summary').scrollIntoView({ behavior: 'smooth' });
});