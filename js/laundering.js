// Money Laundering Network functionality

let selectedNode = null;
let isAnimating = false;
let canvas, ctx;

const nodes = [
    { id: "user1", x: 100, y: 200, label: "John Doe", type: "user", status: "safe" },
    { id: "mule1", x: 300, y: 150, label: "Mule Account A", type: "mule", status: "suspicious", amount: 50000 },
    { id: "mule2", x: 300, y: 250, label: "Mule Account B", type: "mule", status: "suspicious", amount: 75000 },
    { id: "merchant1", x: 500, y: 100, label: "FakeBank Pro", type: "merchant", status: "suspicious" },
    { id: "merchant2", x: 500, y: 200, label: "Amazon", type: "merchant", status: "safe" },
    { id: "merchant3", x: 500, y: 300, label: "Unknown App", type: "merchant", status: "suspicious" }
];

const connections = [
    { from: "user1", to: "mule1", amount: 50000, suspicious: true },
    { from: "user1", to: "mule2", amount: 75000, suspicious: true },
    { from: "mule1", to: "merchant1", amount: 48000, suspicious: true },
    { from: "mule1", to: "merchant2", amount: 2000, suspicious: false },
    { from: "mule2", to: "merchant3", amount: 73000, suspicious: true }
];

function initLaundering() {
    canvas = document.getElementById('network-canvas');
    ctx = canvas.getContext('2d');
    
    if (canvas && ctx) {
        drawNetwork();
        canvas.addEventListener('click', handleCanvasClick);
        
        // Make canvas responsive
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }
}

function resizeCanvas() {
    const container = canvas.parentElement;
    const containerWidth = container.clientWidth;
    const aspectRatio = 600 / 400;
    
    canvas.style.width = containerWidth + 'px';
    canvas.style.height = (containerWidth / aspectRatio) + 'px';
}

function getNodeColor(node) {
    if (node.status === "suspicious") {
        return node.type === "mule" ? "#ef4444" : "#dc2626"; // red variants
    }
    return "#22c55e"; // green
}

function drawNetwork() {
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw connections
    connections.forEach(connection => {
        const fromNode = nodes.find(n => n.id === connection.from);
        const toNode = nodes.find(n => n.id === connection.to);
        
        if (fromNode && toNode) {
            drawConnection(fromNode, toNode, connection);
        }
    });
    
    // Draw nodes
    nodes.forEach(node => {
        drawNode(node);
    });
}

function drawConnection(fromNode, toNode, connection) {
    // Draw line
    ctx.beginPath();
    ctx.moveTo(fromNode.x, fromNode.y);
    ctx.lineTo(toNode.x, toNode.y);
    ctx.strokeStyle = connection.suspicious ? "#ef4444" : "#22c55e";
    ctx.lineWidth = connection.suspicious ? 3 : 2;
    ctx.stroke();
    
    // Draw arrow
    const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
    const arrowLength = 15;
    
    ctx.beginPath();
    ctx.moveTo(
        toNode.x - arrowLength * Math.cos(angle - Math.PI / 6),
        toNode.y - arrowLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(toNode.x, toNode.y);
    ctx.lineTo(
        toNode.x - arrowLength * Math.cos(angle + Math.PI / 6),
        toNode.y - arrowLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.strokeStyle = connection.suspicious ? "#ef4444" : "#22c55e";
    ctx.stroke();
}

function drawNode(node) {
    // Draw node circle
    ctx.beginPath();
    ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
    ctx.fillStyle = getNodeColor(node);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw node label
    ctx.fillStyle = "#ffffff";
    ctx.font = "12px Inter";
    ctx.textAlign = "center";
    ctx.fillText(node.label, node.x, node.y - 35);
}

function handleCanvasClick(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;
    
    // Find clicked node
    const clickedNode = nodes.find(node => {
        const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
        return distance <= 20;
    });
    
    selectedNode = clickedNode || null;
    updateNodeDetails();
}

function updateNodeDetails() {
    const detailsContainer = document.getElementById('node-details');
    
    if (selectedNode) {
        detailsContainer.innerHTML = `
            <div class="node-info">
                <h4 class="node-name">${selectedNode.label}</h4>
                <div class="node-status mb-2">
                    <span class="badge badge-${selectedNode.status}">
                        ${selectedNode.status === "suspicious" ? "🚨" : "✅"} ${selectedNode.status}
                    </span>
                </div>
                
                <div class="node-type mb-4">
                    <p class="detail-label">Type:</p>
                    <p class="detail-value">${selectedNode.type.charAt(0).toUpperCase() + selectedNode.type.slice(1)}</p>
                    <p class="detail-description">${getNodeTypeDescription(selectedNode.type)}</p>
                </div>

                ${selectedNode.amount ? `
                    <div class="node-amount mb-4">
                        <p class="detail-label">Traced Amount:</p>
                        <p class="detail-value amount-value">${formatCurrency(selectedNode.amount)}</p>
                    </div>
                ` : ''}

                ${selectedNode.type === "mule" ? `
                    <div class="mule-warning">
                        <strong>Mule Account Detected:</strong> This account is being used 
                        to launder money through multiple transactions.
                    </div>
                ` : ''}
            </div>
        `;
    } else {
        detailsContainer.innerHTML = `
            <div class="no-selection text-center p-8">
                <i class="fas fa-project-diagram no-selection-icon"></i>
                <p class="text-muted">Click on a node in the network to view details</p>
            </div>
        `;
    }
}

function getNodeTypeDescription(type) {
    switch (type) {
        case "user": return "Original account holder";
        case "mule": return "Intermediate money transfer account";
        case "merchant": return "Final destination merchant";
        default: return "Unknown";
    }
}

function animateNetwork() {
    const animateBtn = document.getElementById('animate-btn');
    
    if (isAnimating) return;
    
    isAnimating = true;
    animateBtn.innerHTML = '<i class="fas fa-pause"></i> Animating...';
    animateBtn.disabled = true;
    
    let frame = 0;
    const maxFrames = 180; // 3 seconds at 60fps
    
    function animate() {
        frame++;
        
        // Add some visual effects during animation
        drawNetwork();
        
        if (frame < maxFrames) {
            requestAnimationFrame(animate);
        } else {
            isAnimating = false;
            animateBtn.innerHTML = '<i class="fas fa-play"></i> Animate';
            animateBtn.disabled = false;
        }
    }
    
    animate();
}

function resetNetwork() {
    selectedNode = null;
    isAnimating = false;
    drawNetwork();
    updateNodeDetails();
    
    const animateBtn = document.getElementById('animate-btn');
    animateBtn.innerHTML = '<i class="fas fa-play"></i> Animate';
    animateBtn.disabled = false;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initLaundering);