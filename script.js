document.addEventListener('DOMContentLoaded', () => {
  // Auto today's date
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('date').value = today;
  
  const checklists = {
    Forklift: [
      "Brakes", "Horn", "Steering", "Tires/Wheels", "Forks/Mast/Chains",
      "Hydraulic Hoses/Fluid Levels", "Battery/Fuel Level", "Lights/Seat Belt", "Leaks/Damage"
    ],
    "Front-End Loader": [
      "Brakes", "Horn", "Steering", "Tires/Wheels", "Bucket/Attachments",
      "Hydraulic Hoses/Fluid Levels", "Engine Oil/Coolant/Fuel", "Lights/Seat Belt/ROPS", "Leaks/Damage"
    ]
  };
  
  const equipmentSelect = document.getElementById('equipmentType');
  const checklistSection = document.getElementById('checklistSection');
  
  equipmentSelect.addEventListener('change', () => {
    const type = equipmentSelect.value;
    checklistSection.innerHTML = '';
    
    if (type && checklists[type]) {
      checklists[type].forEach(item => {
        const div = document.createElement('div');
        div.className = 'checklist-item';
        div.innerHTML = `
          <strong>${item}</strong><br>
          <label><input type="radio" name="${item}_status" value="Pass" required> Pass</label>
          <label><input type="radio" name="${item}_status" value="Fail"> Fail</label>
          <label><input type="radio" name="${item}_status" value="NA"> NA</label><br>
          <label>Comments (required if Fail): 
            <textarea name="${item}_comment" rows="2" cols="50"></textarea>
          </label>
        `;
        checklistSection.appendChild(div);
      });
    }
  });
  
  // Required comments if Fail
  checklistSection.addEventListener('change', (e) => {
    if (e.target.type === 'radio' && e.target.value === 'Fail') {
      const commentTextarea = e.target.closest('.checklist-item').querySelector('textarea');
      commentTextarea.required = true;
    } else if (e.target.type === 'radio') {
      const commentTextarea = e.target.closest('.checklist-item').querySelector('textarea');
      if (e.target.value !== 'Fail') commentTextarea.required = false;
    }
  });
  
  // Form submit
  const form = document.getElementById('checkForm');
  const messageDiv = document.getElementById('message');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    
    const data = {
      date: formData.get('date'),
      crewMember: formData.get('crewMember'),
      equipmentType: formData.get('equipmentType'),
      unitID: formData.get('unitID'),
      overallComments: formData.get('overallComments'),
      checklist: []
    };
    
    const type = data.equipmentType;
    checklists[type].forEach(item => {
      const status = formData.get(`${item}_status`);
      const comment = formData.get(`${item}_comment`);
      data.checklist.push({item, status, comment});
    });
    
    // Replace with your Web App URL
    const WEB_APP_URL = 'https://script.google.com/macros/s/YOUR-DEPLOYMENT-ID/exec';
    
    try {
      const response = await fetch(WEB_APP_URL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'},
        mode: 'no-cors'  // Avoids CORS issues for simple success
      });
      
      messageDiv.textContent = 'Submission successful!';
      messageDiv.style.color = 'green';
      form.reset();
      document.getElementById('date').value = today;
      checklistSection.innerHTML = '';
    } catch (error) {
      messageDiv.textContent = 'Error submitting. Check console.';
      messageDiv.style.color = 'red';
      console.error(error);
    }
  });
});