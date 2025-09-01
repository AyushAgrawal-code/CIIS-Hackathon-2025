// APK Detection functionality

let analysisResult = null;

function initAPKDetection() {
    const fileInput = document.getElementById('apk-upload');
    const uploadArea = document.getElementById('upload-area');
    
    // File input change handler
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }
    
    // Drag and drop functionality
    if (uploadArea) {
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].name.endsWith('.apk')) {
                handleFileSelection(files[0]);
            }
        });
    }
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        handleFileSelection(file);
    }
}

function handleFileSelection(file) {
    showAnalysisProgress();
    
    // Simulate analysis delay
    setTimeout(() => {
        analyzeAPK(file);
    }, 2000);
}

function showAnalysisProgress() {
    document.getElementById('analysis-progress').classList.remove('hidden');
    document.getElementById('analysis-results').classList.add('hidden');
}

function analyzeAPK(file) {
    // Simulate APK analysis
    const isSuspicious = file.name.toLowerCase().includes("secure") || 
                        file.name.toLowerCase().includes("bank") ||
                        file.name.toLowerCase().includes("pay");
    
    const permissions = [
        { name: "READ_SMS", risk: "high" },
        { name: "INTERNET", risk: "low" },
        { name: "READ_CONTACTS", risk: "medium" },
        { name: "ACCESS_FINE_LOCATION", risk: "medium" },
        { name: "CAMERA", risk: isSuspicious ? "high" : "low" },
        { name: "WRITE_EXTERNAL_STORAGE", risk: "low" }
    ];
    
    analysisResult = {
        filename: file.name,
        status: isSuspicious ? "suspicious" : "safe",
        permissions: permissions
    };
    
    hideAnalysisProgress();
    showAnalysisResults();
}

function hideAnalysisProgress() {
    document.getElementById('analysis-progress').classList.add('hidden');
}

function showAnalysisResults() {
    const resultsDiv = document.getElementById('analysis-results');
    const statusCard = document.getElementById('status-card');
    const statusIcon = document.getElementById('status-icon');
    const statusTitle = document.getElementById('status-title');
    const statusDescription = document.getElementById('status-description');
    const fileName = document.getElementById('file-name');
    const alertBanner = document.getElementById('alert-banner');
    
    // Show results container
    resultsDiv.classList.remove('hidden');
    
    // Update status card
    if (analysisResult.status === "suspicious") {
        statusCard.className = "card card-danger mb-8";
        statusIcon.innerHTML = '<i class="fas fa-times-circle text-destructive"></i>';
        statusTitle.textContent = "❌ Suspicious APK Detected";
        statusTitle.className = "status-title text-destructive mb-2";
        statusDescription.textContent = "This application shows signs of malicious behavior";
        statusDescription.className = "text-destructive";
        alertBanner.classList.remove('hidden');
    } else {
        statusCard.className = "card card-success mb-8";
        statusIcon.innerHTML = '<i class="fas fa-check-circle text-success"></i>';
        statusTitle.textContent = "✅ Safe Application";
        statusTitle.className = "status-title text-success mb-2";
        statusDescription.textContent = "No immediate security threats detected";
        statusDescription.className = "text-success";
        alertBanner.classList.add('hidden');
    }
    
    fileName.textContent = `File: ${analysisResult.filename}`;
    
    // Populate permissions table
    populatePermissionsTable();
}

function populatePermissionsTable() {
    const tableBody = document.getElementById('permissions-table');
    tableBody.innerHTML = '';
    
    analysisResult.permissions.forEach(permission => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="permission-name">${permission.name}</td>
            <td class="risk-level">
                <span class="badge badge-${permission.risk}">
                    ${getRiskIcon(permission.risk)} ${permission.risk.charAt(0).toUpperCase() + permission.risk.slice(1)}
                </span>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function getRiskIcon(risk) {
    switch (risk) {
        case "high": return "❌";
        case "medium": return "⚠";
        case "low": return "✅";
        default: return "⚠";
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initAPKDetection);