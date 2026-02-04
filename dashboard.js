// SSAcity Dashboard - SIMPLE WORKING VERSION
console.log('🚀 SSAcity Dashboard loading...');

const API_BASE = 'http://localhost:5000';
let currentData = { bins: [], alerts: [], kpis: {} };

async function loadData() {
    console.log('📥 Loading data...');
    try {
        // Load bins
        const binsRes = await fetch(`${API_BASE}/api/v2/smart-bins`);
        currentData.bins = await binsRes.json();
        console.log(`✅ Loaded ${currentData.bins.length} bins`);
        
        // Load alerts
        const alertsRes = await fetch(`${API_BASE}/api/v2/predictive-alerts`);
        currentData.alerts = await alertsRes.json();
        console.log(`✅ Loaded ${currentData.alerts.length} alerts`);
        
        // Load KPIs
        const kpisRes = await fetch(`${API_BASE}/api/v2/operational-kpis`);
        currentData.kpis = await kpisRes.json();
        console.log('✅ Loaded KPIs');
        
        updateDashboard();
        setStatus('connected', 'Connected');
        
        // Update timestamp
        document.getElementById('lastUpdated').textContent = new Date().toLocaleTimeString();
        
    } catch (error) {
        console.error('❌ Error:', error);
        setStatus('error', 'Connection failed');
        document.getElementById('binsList').innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #94a3b8;">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Connection Error</h3>
                <p>Backend not responding</p>
                <button onclick="loadData()" class="secondary" style="margin-top: 20px;">
                    <i class="fas fa-sync"></i> Retry
                </button>
            </div>
        `;
    }
}

function updateDashboard() {
    updateKPIs();
    updateBins();
    updateAlerts();
    updateRecentAlerts();
}

function updateKPIs() {
    const { bins, alerts, kpis } = currentData;
    
    document.getElementById('totalBins').textContent = kpis.total_bins || bins.length;
    document.getElementById('avgFill').textContent = kpis.avg_fill ? `${kpis.avg_fill}%` : 
        (bins.length ? `${(bins.reduce((s, b) => s + b.fill_level, 0) / bins.length).toFixed(1)}%` : '0%');
    document.getElementById('criticalBins').textContent = kpis.critical_bins || 
        bins.filter(b => b.fill_level > 85).length;
    document.getElementById('activeAlerts').textContent = kpis.active_alerts || alerts.length;
}

function updateBins() {
    const container = document.getElementById('binsList');
    if (!container) return;
    
    if (currentData.bins.length === 0) {
        container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i><p>No bins loaded</p></div>';
        return;
    }
    
    let html = '';
    currentData.bins.forEach(bin => {
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
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px; margin-top: 15px;">
                    <div><span style="color: #94a3b8;">Type:</span> ${bin.waste_type}</div>
                    <div><span style="color: #94a3b8;">Battery:</span> ${bin.battery_level}%</div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function updateAlerts() {
    const container = document.getElementById('alertsList');
    if (!container) return;
    
    if (currentData.alerts.length === 0) {
        container.innerHTML = '<div class="loading"><i class="fas fa-check-circle"></i><p>No alerts</p></div>';
        return;
    }
    
    let html = '';
    currentData.alerts.forEach(alert => {
        const severity = alert.severity || 'medium';
        html += `
            <div class="alert ${severity}">
                <div class="alert-title">
                    <i class="fas fa-exclamation-triangle"></i>
                    ${alert.type.replace('_', ' ').toUpperCase()}
                </div>
                <div class="alert-location">${alert.location}</div>
                <div class="alert-action">
                    <i class="fas fa-lightbulb"></i> ${alert.recommended_action}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function updateRecentAlerts() {
    const container = document.getElementById('recentAlerts');
    if (!container) return;
    
    const recent = currentData.alerts.slice(0, 3);
    if (recent.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 20px; color: #94a3b8;"><i class="fas fa-check"></i> No alerts</div>';
        return;
    }
    
    let html = '';
    recent.forEach(alert => {
        html += `
            <div class="alert ${alert.severity || 'medium'}" style="margin-bottom: 10px;">
                <strong>${alert.type.replace('_', ' ')}</strong><br>
                <small>${alert.location}</small>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function setStatus(state, message) {
    const dot = document.getElementById('statusDot');
    const text = document.getElementById('statusText');
    if (text) text.textContent = message;
    if (dot) {
        if (state === 'connected') dot.style.background = '#22c55e';
        else if (state === 'loading') dot.style.background = '#f59e0b';
        else if (state === 'error') dot.style.background = '#ef4444';
    }
}

function updateTime() {
    const el = document.getElementById('currentTime');
    if (el) el.textContent = new Date().toLocaleTimeString();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM loaded');
    setInterval(updateTime, 1000);
    setStatus('loading', 'Loading...');
    loadData();
    setInterval(loadData, 30000);
});

// Global functions
window.loadData = loadData;
window.showTab = function(tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.getElementById(tabName).style.display = 'block';
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
};
