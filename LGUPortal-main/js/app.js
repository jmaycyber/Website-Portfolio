// Initialize Lucide icon library onto document components
lucide.createIcons();

// 1. OCR Simulation Handler
function triggerOCR() {
    const statusBox = document.getElementById('ocr-status-box');
    const iconContainer = document.getElementById('ocr-icon-container');
    const textEl = document.getElementById('ocr-text');
    const extractedField = document.getElementById('ocr-extracted-field');

    statusBox.className = "mt-4 w-full max-w-md flex items-center justify-between p-3 rounded-lg border bg-amber-50 border-amber-200 text-amber-800";
    iconContainer.innerHTML = `<i data-lucide="refresh-cw" class="w-4 h-4 animate-spin text-amber-600"></i>`;
    textEl.innerText = "OCR ANALYZER: Verifying Authenticity...";
    statusBox.classList.remove('hidden');
    lucide.createIcons();

    setTimeout(() => {
        statusBox.className = "mt-4 w-full max-w-md flex items-center justify-between p-3 rounded-lg border bg-emerald-50 border-emerald-200 text-emerald-800";
        iconContainer.innerHTML = `<i data-lucide="user-check" class="w-4 h-4 text-emerald-600"></i>`;
        textEl.innerText = "IDENTITY VERIFIED: Structural Metadata Extracted";
        extractedField.classList.remove('hidden');
        lucide.createIcons();
    }, 2000);
}

// 2. Dynamic Infant & Dependent Disqualification Threshold Calculations
function evaluateAgeThreshold() {
    const dobInput = document.getElementById('dependent-dob').value;
    const resultBox = document.getElementById('matrix-result-box');
    const badge = document.getElementById('matrix-badge');
    const mainText = document.getElementById('matrix-main-text');
    const subText = document.getElementById('matrix-sub-text');

    if (!dobInput) return;

    const dob = new Date(dobInput);
    const today = new Date();
    const thresholdAge = 18;
    
    // Calculate absolute separation target date
    const targetDate = new Date(dob.getFullYear() + thresholdAge, dob.getMonth(), dob.getDate());
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    resultBox.classList.remove('hidden');

    if (diffDays > 0) {
        badge.className = "px-2 py-0.5 rounded text-[10px] font-black font-mono uppercase tracking-wider bg-amber-100 text-amber-800";
        badge.innerText = "Dependent Pipeline";
        mainText.innerText = `Segregation Event in ${diffDays.toLocaleString()} Days`;
        subText.innerText = `Calculated Legal Transition Date: ${targetDate.toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}`;
    } else {
        badge.className = "px-2 py-0.5 rounded text-[10px] font-black font-mono uppercase tracking-wider bg-emerald-100 text-emerald-800";
        badge.innerText = "Independent Eligible";
        mainText.innerText = "System Threshold Achieved: Eligible for Individual Account Registration";
        subText.innerText = "Minor can separate from the household registry setup instantly.";
    }
}

// Toggle handling for the scholar assurance monitoring module
function toggleScholarModule() {
    const toggle = document.getElementById('scholar-toggle');
    const infoBox = document.getElementById('scholar-info-box');
    if (toggle.checked) {
        infoBox.classList.remove('hidden');
    } else {
        infoBox.classList.add('hidden');
    }
}

// 3. Government Official Camera Mock Validation
function simulateCamera() {
    const preview = document.getElementById('camera-preview');
    preview.innerHTML = `<i data-lucide="refresh-cw" class="w-5 h-5 text-slate-700 animate-spin"></i><span class="text-xs text-slate-600 font-mono ml-2">Registering biometric image...</span>`;
    lucide.createIcons();

    setTimeout(() => {
        preview.className = "border border-emerald-200 rounded-lg bg-emerald-50/50 flex flex-col items-center justify-center p-4 text-center";
        preview.innerHTML = `
            <i data-lucide="check-circle" class="w-6 h-6 text-emerald-600 mb-1"></i>
            <p class="text-xs font-bold text-emerald-800">IMAGE SECURED</p>
            <p class="text-[10px] text-emerald-600 font-mono mt-0.5">Lat/Long & Timestamp Encrypted</p>
        `;
        lucide.createIcons();
    }, 1500);
}

// 4. Communication & Broadcaster Alert Systems
function dispatchBroadcast() {
    const input = document.getElementById('broadcast-input');
    if (!input.value.trim()) return alert("Please type a message to dispatch.");
    alert(`SYSTEM BROADCAST COMMITTED:\n"${input.value}"\n\nSent to all active client tokens across regional networks.`);
    input.value = '';
}

// 5. Citizen Input Forum Mock Callback
function submitSuggestion() {
    const input = document.getElementById('forum-input');
    if (!input.value.trim()) return;
    alert(`CONSULTATION LOGGED:\nYour resource suggestion has been attached to your household token file for local evaluation.`);
    input.value = '';
}
