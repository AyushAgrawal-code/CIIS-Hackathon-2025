// Alerts & Timeline functionality

function initAlerts() {
    // Initialize timeline animations
    animateTimelineItems();
    
    // Animate progress bars
    animateProgressBars();
    
    // Animate statistics
    animateStatistics();
}

function animateTimelineItems() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Add a slight delay to each timeline item for staggered animation
    timelineItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'all 0.5s ease';
            
            // Trigger animation
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 100);
        }, index * 200);
    });
}

function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach(bar => {
        const targetWidth = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.transition = 'width 2s ease-in-out';
            bar.style.width = targetWidth;
        }, 1000);
    });
}

function animateStatistics() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const targetValue = parseInt(stat.textContent);
        if (!isNaN(targetValue)) {
            animateNumber(stat, 0, targetValue, 1500);
        }
    });
}

// Add pulse animation to in-progress items
function pulseInProgressItems() {
    const inProgressItems = document.querySelectorAll('.timeline-item.in-progress');
    
    inProgressItems.forEach(item => {
        const marker = item.querySelector('.timeline-marker');
        if (marker) {
            marker.style.animation = 'pulse 2s ease-in-out infinite';
        }
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    initAlerts();
    pulseInProgressItems();
});