// Transaction Analysis functionality

let transactions = [];

const demoTransactions = [
    {
        id: "TXN001",
        user: "John Doe",
        amount: 25000,
        merchant: "Amazon",
        location: "Mumbai",
        status: "safe",
        timestamp: "2025-01-01 10:30"
    },
    {
        id: "TXN002",
        user: "Jane Smith",
        amount: 75000,
        merchant: "UnknownApp",
        location: "Delhi",
        status: "fraudulent",
        timestamp: "2025-01-01 11:15"
    },
    {
        id: "TXN003",
        user: "Mike Johnson",
        amount: 5000,
        merchant: "Zomato",
        location: "Bangalore",
        status: "safe",
        timestamp: "2025-01-01 12:00"
    },
    {
        id: "TXN004",
        user: "Sarah Wilson",
        amount: 150000,
        merchant: "FakeBank Pro",
        location: "Chennai",
        status: "fraudulent",
        timestamp: "2025-01-01 14:30"
    },
    {
        id: "TXN005",
        user: "Alex Brown",
        amount: 3500,
        merchant: "Flipkart",
        location: "Pune",
        status: "safe",
        timestamp: "2025-01-01 16:45"
    }
];

function initTransactions() {
    const fileInput = document.getElementById('csv-upload');
    
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        showAnalysisProgress();
        
        // Simulate CSV processing
        setTimeout(() => {
            analyzeTransactions(demoTransactions);
        }, 2000);
    }
}

function loadDemoData() {
    const demoBtn = document.getElementById('demo-btn');
    demoBtn.disabled = true;
    demoBtn.textContent = 'Analyzing...';
    
    showAnalysisProgress();
    
    setTimeout(() => {
        analyzeTransactions(demoTransactions);
        demoBtn.disabled = false;
        demoBtn.textContent = 'Use Demo Data';
    }, 1500);
}

function showAnalysisProgress() {
    document.getElementById('analysis-progress').classList.remove('hidden');
    document.getElementById('results-section').classList.add('hidden');
}

function analyzeTransactions(data) {
    // Apply fraud detection rules
    transactions = data.map(transaction => {
        let status = "safe";
        
        // Fraud detection rules
        if (transaction.amount > 50000) {
            status = "fraudulent";
        }
        if (transaction.merchant.toLowerCase().includes("unknown") || 
            transaction.merchant.toLowerCase().includes("fake")) {
            status = "fraudulent";
        }
        
        return { ...transaction, status };
    });
    
    hideAnalysisProgress();
    showResults();
}

function hideAnalysisProgress() {
    document.getElementById('analysis-progress').classList.add('hidden');
}

function showResults() {
    const resultsSection = document.getElementById('results-section');
    resultsSection.classList.remove('hidden');
    
    updateSummaryCards();
    populateTransactionsTable();
    showFraudAlert();
}

function updateSummaryCards() {
    const totalCount = transactions.length;
    const fraudulentTransactions = transactions.filter(t => t.status === "fraudulent");
    const fraudCount = fraudulentTransactions.length;
    const fraudAmount = fraudulentTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    // Animate numbers
    const totalCountEl = document.getElementById('total-count');
    const fraudCountEl = document.getElementById('fraud-count');
    const fraudAmountEl = document.getElementById('fraud-amount');
    
    animateNumber(totalCountEl, 0, totalCount);
    animateNumber(fraudCountEl, 0, fraudCount);
    
    // Format amount
    fraudAmountEl.textContent = formatCurrency(fraudAmount);
}

function populateTransactionsTable() {
    const tableBody = document.getElementById('transactions-table');
    tableBody.innerHTML = '';
    
    transactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.className = transaction.status === "fraudulent" ? "fraud-row" : "";
        
        row.innerHTML = `
            <td class="transaction-id">${transaction.id}</td>
            <td>${transaction.user}</td>
            <td class="amount">${formatCurrency(transaction.amount)}</td>
            <td>${transaction.merchant}</td>
            <td>${transaction.location}</td>
            <td class="status">
                <span class="badge badge-${transaction.status}">
                    ${transaction.status === "fraudulent" ? "❌" : "✅"}
                    ${transaction.status === "fraudulent" ? "Fraudulent" : "Safe"}
                </span>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

function showFraudAlert() {
    const fraudulentCount = transactions.filter(t => t.status === "fraudulent").length;
    const alertDiv = document.getElementById('fraud-alert');
    const alertText = document.getElementById('fraud-alert-text');
    
    if (fraudulentCount > 0) {
        alertText.textContent = `${fraudulentCount} fraudulent transactions have been identified and reported to the Cyber Department.`;
        alertDiv.classList.remove('hidden');
    } else {
        alertDiv.classList.add('hidden');
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initTransactions);