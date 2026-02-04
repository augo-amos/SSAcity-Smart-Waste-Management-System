// ULTRA SIMPLE WORKING DASHBOARD
console.log('🎯 SSAcity Dashboard Loading...');

const API = 'http://localhost:5000';
let dashboardData = { bins: [], alerts: [] };

async function loadAllData() {
    console.log('📥 Loading data from:', API);
    
    try {
        // Load bins
        const binsRes = await fetch(`${API}/api/v2/smart-bins`);
        dashboardData.bins = await binsRes.json();
        console.log(`✅ Loaded ${dashboardData.bins.length} bins`);
        
        // Load alerts
        const alertsRes = await fetch(`${API}/api/v2/predictive-alerts`);
        dashboardData.alerts = await alertsRes.json();
        console.log(`✅ Loaded ${dashboardData.alerts.length} alerts`);
        
        // Load KPIs
        const kpisRes = await fetch(`${API}/api/v2/operational-kpis`);
        dashboardData.kpis = await kpisRes.json();
        console.log('✅ Loaded KPIs');
        
        updateDashboard();
        document.getElementById('statusText').textContent = 'Connected';
        document.getElementById('statusDot').style.background = '#22c55e';
        
        // Update timestamp
        document.getElementById('lastUpdated').textContent = new Date().toLocaleTimeString();
        
    } catch (error) {
        console.error('❌ Error:', error);
        document.getElementById('statusText').textContent = 'Connection Failed';
        document.getElementById('statusDot').style.background = '#ef4444';
        
        // Show fallback data
        dashboardData.bins = [
            {bin_id: 'BIN-001', location: 'Downtown', fill_level: 75, waste_type: 'General'},
            {bin_id: 'BIN-002', location: 'Park', fill_level: 90, waste_type: 'Recyclable'},
            {bin_id: 'BIN-003', location: 'Mall', fill_level: 45, waste_type: 'Organic'}
        ];
        dashboardData.alerts = [
            {type: 'overflow', severity: 'critical', location: 'Downtown', recommended_action: 'Collect now'}
        ];
        dashboardData.kpis = {total_bins: 3, avg_fill: 70, critical_bins: 1, active_alerts: 1};
        updateDashboard();
    }
}

function updateDashboard() {
    updateKPIs();
    updateBins();
    updateAlerts();
}

function updateKPIs() {
    const k = dashboardData.kpis;
    const bins = dashboardData.bins;
    
    document.getElementById('totalBins').textContent = k.total_bins || bins.length;
    document.getElementById('avgFill').textContent = (k.avg_fill || 
        (bins.length ? Math.round(bins.reduce((s,b) => s + b.fill_level, 0)/bins.length) : 0)) + '%';
    document.getElementById('criticalBins').textContent = k.critical_bins || 
        bins.filter(b => b.fill_level > 85).length;
    document.getElementById('activeAlerts').textContent = k.active_alerts || dashboardData.alerts.length;
}

function updateBins() {
    const container = document.getElementById('binsList');
    if (!container) return;
    
    if (dashboardData.bins.length === 0) {
        container.innerHTML = '<div class="loading">No bins data</div>';
        return;
    }
    
    let html = '';
    dashboardData.bins.forEach(bin => {
        const fill = bin.fill_level;
        let color = '#10b981';
        if (fill > 85) color = '#ef4444';
        else if (fill > 70) color = '#f97316';
        else if (fill > 50) color = '#f59e0b';
        
        html += `
            <div class="bin">
                <div class="bin-header">
                    <div>
                        <div class="bin-id">${bin.bin_id}</div>
                        <div class="bin-location">${bin.location}</div>
                    </div>
                    <div style="background: ${color}; color: white; padding: 8px 15px; border-radius: 20px; font-weight: bold;">
                        ${fill}%
                    </div>
                </div>
                <div class="fill-level">
                    <div class="fill-bar" style="width: ${fill}%; background: ${color};"></div>
                </div>
                <div style="margin-top: 10px; font-size: 14px;">
                    <span style="color: #94a3b8;">Type:</span> ${bin.waste_type} &nbsp;
                    <span style="color: #94a3b8;">Status:</span> <span style="color: ${fill > 85 ? '#ef4444' : '#10b981'}">${fill > 85 ? 'Critical' : 'Normal'}</span>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function updateAlerts() {
    const container = document.getElementById('alertsList');
    if (!container) return;
    
    if (dashboardData.alerts.length === 0) {
        container.innerHTML = '<div class="loading">No alerts</div>';
        return;
    }
    
    let html = '';
    dashboardData.alerts.forEach(alert => {
        const severity = alert.severity || 'medium';
        html += `
            <div class="alert ${severity}">
                <div class="alert-title">
                    <i class="fas fa-exclamation-triangle"></i>
                    ${alert.type ? alert.type.toUpperCase() : 'ALERT'}
                </div>
                <div class="alert-location">${alert.location}</div>
                <div class="alert-action">
                    <i class="fas fa-lightbulb"></i> ${alert.recommended_action || 'Take action'}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function updateTime() {
    const el = document.getElementById('currentTime');
    if (el) el.textContent = new Date().toLocaleTimeString();
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Page loaded');
    setInterval(updateTime, 1000);
    loadAllData();
    setInterval(loadAllData, 30000); // Refresh every 30 seconds
});

// Make functions global
window.loadData = loadAllData;
window.showTab = function(tabName) {
    // Hide all tabs
    document.querySelectorAll('.content').forEach(tab => {
        tab.style.display = 'none';
    });
    // Show selected tab
    document.getElementById(tabName).style.display = 'block';
    // Update active tab button
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
};
