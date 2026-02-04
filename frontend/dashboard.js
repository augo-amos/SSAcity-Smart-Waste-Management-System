/**
 * SSAcity Smart City Dashboard v2.0
 */
console.log('SSAcity Dashboard v2.0 loading...');

const API_BASE_URL = 'http://localhost:5001';

class SSAcityDashboardV2 {
    constructor() {
        this.smartBins = [];
        this.cityZones = [];
        this.predictiveAlerts = [];
        this.platformMetrics = {};
        this.operationalKPIs = {};
        
        this.init();
    }

    async init() {
        console.log('Initializing dashboard v2.0...');
        
        this.setupEventListeners();
        this.setupTabs();
        this.updateCurrentTime();
        setInterval(() => this.updateCurrentTime(), 1000);
        
        await this.loadAllData();
        this.startAutoRefresh();
        
        console.log('Dashboard v2.0 ready!');
    }

    setupEventListeners() {
        // Search
        document.getElementById('binSearch')?.addEventListener('input', (e) => {
            this.filterBins(e.target.value);
        });
        
        // Filter
        document.getElementById('fillFilter')?.addEventListener('change', (e) => {
            this.filterBinsByFillLevel(e.target.value);
        });
        
        // Refresh button
        document.getElementById('refreshBtn')?.addEventListener('click', () => {
            this.loadAllData();
        });
        
        // Export button
        document.getElementById('exportBtn')?.addEventListener('click', () => {
            this.exportData();
        });
    }

    setupTabs() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabId = e.target.dataset.tab;
                this.switchTab(tabId);
            });
        });
    }

    switchTab(tabId) {
        // Update buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        
        // Update panes
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(`${tabId}-tab`).classList.add('active');
        
        // Refresh tab data
        if (tabId === 'analytics') {
            this.updateAnalyticsTab();
        } else if (tabId === 'alerts') {
            this.updateAlertsTab();
        }
    }

    async loadAllData() {
        console.log('Loading all data...');
        
        try {
            // Update status
            this.showLoading();
            
            // Load smart bins
            const binsRes = await fetch(`${API_BASE_URL}/api/v2/smart-bins`);
            if (binsRes.ok) this.smartBins = await binsRes.json();
            
            // Load operational KPIs
            const kpisRes = await fetch(`${API_BASE_URL}/api/v2/operational-kpis`);
            if (kpisRes.ok) this.operationalKPIs = await kpisRes.json();
            
            // Load zone analytics
            const zonesRes = await fetch(`${API_BASE_URL}/api/v2/zone-analytics`);
            if (zonesRes.ok) this.cityZones = await zonesRes.json();
            
            // Load platform metrics
            const platformRes = await fetch(`${API_BASE_URL}/api/v2/platform-metrics`);
            if (platformRes.ok) this.platformMetrics = await platformRes.json();
            
            // Load predictive alerts
            const alertsRes = await fetch(`${API_BASE_URL}/api/v2/predictive-alerts`);
            if (alertsRes.ok) this.predictiveAlerts = await alertsRes.json();
            
            // Update UI
            this.updateAllUI();
            
            // Update timestamp
            document.getElementById('lastUpdated').textContent = new Date().toLocaleTimeString();
            
        } catch (error) {
            console.error('Error loading data:', error);
            this.showError('Failed to load data');
        }
    }

    showLoading() {
        document.getElementById('statusText').textContent = 'Loading...';
        document.getElementById('systemStatus').style.background = '#f57c00';
    }

    updateAllUI() {
        // Update status
        document.getElementById('statusText').textContent = 'Connected';
        document.getElementById('systemStatus').style.background = '#2e7d32';
        
        // Update KPIs
        this.updateKPIs();
        
        // Update smart bins tab
        this.updateSmartBinsTab();
    }

    updateKPIs() {
        const container = document.getElementById('kpisGrid');
        if (!container) return;
        
        const kpis = this.operationalKPIs;
        
        container.innerHTML = `
            <div class="stat-card">
                <h3>Smart Bins</h3>
                <div class="stat-value">${this.smartBins.length}</div>
                <div class="stat-change">Active</div>
            </div>
            <div class="stat-card">
                <h3>Waste Collected</h3>
                <div class="stat-value">${this.formatNumber(kpis.total_waste_collected_kg || 0)} kg</div>
                <div class="stat-change">Today</div>
            </div>
            <div class="stat-card">
                <h3>Collections</h3>
                <div class="stat-value">${kpis.total_collections_today || 0}</div>
                <div class="stat-change">Completed</div>
            </div>
            <div class="stat-card">
                <h3>Efficiency</h3>
                <div class="stat-value">${kpis.avg_route_efficiency || 0}%</div>
                <div class="stat-change">Route Opt.</div>
            </div>
            <div class="stat-card">
                <h3>Critical Bins</h3>
                <div class="stat-value">${kpis.bins_above_80 || 0}</div>
                <div class="stat-change">>80% full</div>
            </div>
            <div class="stat-card">
                <h3>Coverage</h3>
                <div class="stat-value">${kpis.collection_coverage || 0}%</div>
                <div class="stat-change">City Wide</div>
            </div>
        `;
    }

    updateSmartBinsTab() {
        // Update total count
        document.getElementById('totalBins').textContent = this.smartBins.length;
        
        // Update bins grid
        this.updateBinsGrid();
    }

    updateBinsGrid() {
        const container = document.getElementById('binsGrid');
        if (!container) return;
        
        // Sort by fill level (highest first)
        const sortedBins = [...this.smartBins].sort((a, b) => b.fill_level - a.fill_level);
        
        container.innerHTML = sortedBins.map(bin => {
            const fillLevel = bin.fill_level;
            let fillClass = 'low';
            if (fillLevel > 80) fillClass = 'critical';
            else if (fillLevel > 60) fillClass = 'high';
            else if (fillLevel > 30) fillClass = 'medium';
            
            return `
                <div class="bin-card">
                    <div class="bin-header">
                        <div>
                            <div class="bin-id">${bin.bin_id}</div>
                            <div class="bin-location">${bin.location}</div>
                        </div>
                        <span class="badge ${fillClass}">${fillLevel}%</span>
                    </div>
                    
                    <div class="fill-level">
                        <div class="fill-bar ${fillClass}" style="width: ${fillLevel}%"></div>
                    </div>
                    
                    <div class="bin-details">
                        <div class="bin-detail">
                            <span>Type:</span>
                            <span>${bin.waste_type}</span>
                        </div>
                        <div class="bin-detail">
                            <span>Battery:</span>
                            <span>${bin.battery_level?.toFixed(1) || 'N/A'}%</span>
                        </div>
                        <div class="bin-detail">
                            <span>Status:</span>
                            <span class="${bin.status === 'active' ? 'status-active' : 'status-offline'}">
                                ${bin.status}
                            </span>
                        </div>
                    </div>
                    
                    <button class="btn btn-small" onclick="dashboard.viewBinDetails('${bin.bin_id}')">
                        <i class="fas fa-info-circle"></i> Details
                    </button>
                </div>
            `;
        }).join('');
    }

    updateAnalyticsTab() {
        // Update zones table
        const zonesContainer = document.getElementById('zonesTable');
        if (zonesContainer && this.cityZones.length > 0) {
            zonesContainer.innerHTML = `
                <table style="width: 100%;">
                    <thead>
                        <tr>
                            <th>Zone</th>
                            <th>Bins</th>
                            <th>Avg Fill</th>
                            <th>Priority</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.cityZones.map(zone => `
                            <tr>
                                <td>${zone.name}</td>
                                <td>${zone.active_bins}/${zone.smart_bin_count}</td>
                                <td>${zone.avg_fill_level}%</td>
                                <td><span class="badge priority-${zone.priority_level}">P${zone.priority_level}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }
        
        // Update platform metrics
        const platformContainer = document.getElementById('platformMetrics');
        if (platformContainer && this.platformMetrics) {
            const metrics = this.platformMetrics;
            platformContainer.innerHTML = `
                <div class="metrics-grid">
                    <div class="metric-item">
                        <div class="metric-value">${this.formatNumber(metrics.total_users || 0)}</div>
                        <div class="metric-label">Total Users</div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-value">${this.formatNumber(metrics.active_users || 0)}</div>
                        <div class="metric-label">Active Users</div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-value">${metrics.avg_separation_rate || 0}%</div>
                        <div class="metric-label">Separation Rate</div>
                    </div>
                    <div class="metric-item">
                        <div class="metric-value">${this.formatNumber(metrics.total_rewards || 0)}</div>
                        <div class="metric-label">Total Rewards</div>
                    </div>
                </div>
            `;
        }
    }

    updateAlertsTab() {
        const container = document.getElementById('predictiveAlerts');
        if (!container) return;
        
        // Update count
        document.getElementById('alertCount').textContent = this.predictiveAlerts.length;
        
        if (this.predictiveAlerts.length === 0) {
            container.innerHTML = '<div class="no-alerts">No predictive alerts at this time</div>';
            return;
        }
        
        container.innerHTML = this.predictiveAlerts.map(alert => {
            let severityClass = 'alert-low';
            if (alert.severity === 'critical') severityClass = 'alert-critical';
            else if (alert.severity === 'high') severityClass = 'alert-high';
            
            return `
                <div class="alert-item ${severityClass}">
                    <div class="alert-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div class="alert-content">
                        <div class="alert-title">${alert.type.replace('_', ' ').toUpperCase()}</div>
                        <div class="alert-message">${alert.location}</div>
                        <div class="alert-meta">
                            ${new Date(alert.predicted_time).toLocaleString()} | 
                            Confidence: ${(alert.confidence * 100).toFixed(0)}%
                        </div>
                    </div>
                    <div class="alert-action">
                        ${alert.recommended_action}
                    </div>
                </div>
            `;
        }).join('');
    }

    filterBins(searchTerm) {
        const filtered = this.smartBins.filter(bin => 
            bin.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bin.bin_id.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.displayFilteredBins(filtered);
    }

    filterBinsByFillLevel(filter) {
        let filtered = this.smartBins;
        
        switch(filter) {
            case 'critical': filtered = this.smartBins.filter(b => b.fill_level > 80); break;
            case 'high': filtered = this.smartBins.filter(b => b.fill_level > 60 && b.fill_level <= 80); break;
            case 'medium': filtered = this.smartBins.filter(b => b.fill_level > 30 && b.fill_level <= 60); break;
            case 'low': filtered = this.smartBins.filter(b => b.fill_level <= 30); break;
        }
        
        this.displayFilteredBins(filtered);
    }

    displayFilteredBins(bins) {
        const container = document.getElementById('binsGrid');
        if (!container) return;
        
        document.getElementById('totalBins').textContent = `${bins.length} of ${this.smartBins.length}`;
        
        if (bins.length === 0) {
            container.innerHTML = '<div class="no-bins">No bins match the filter</div>';
            return;
        }
        
        // Same display logic as updateBinsGrid but with filtered bins
        container.innerHTML = bins.map(bin => {
            const fillLevel = bin.fill_level;
            let fillClass = 'low';
            if (fillLevel > 80) fillClass = 'critical';
            else if (fillLevel > 60) fillClass = 'high';
            else if (fillLevel > 30) fillClass = 'medium';
            
            return `
                <div class="bin-card">
                    <div class="bin-header">
                        <div>
                            <div class="bin-id">${bin.bin_id}</div>
                            <div class="bin-location">${bin.location}</div>
                        </div>
                        <span class="badge ${fillClass}">${fillLevel}%</span>
                    </div>
                    
                    <div class="fill-level">
                        <div class="fill-bar ${fillClass}" style="width: ${fillLevel}%"></div>
                    </div>
                    
                    <button class="btn btn-small" onclick="dashboard.viewBinDetails('${bin.bin_id}')">
                        <i class="fas fa-info-circle"></i> Details
                    </button>
                </div>
            `;
        }).join('');
    }

    viewBinDetails(binId) {
        const bin = this.smartBins.find(b => b.bin_id === binId);
        if (!bin) return;
        
        alert(`Bin Details: ${bin.bin_id}\n\n` +
              `Location: ${bin.location}\n` +
              `Fill Level: ${bin.fill_level}%\n` +
              `Type: ${bin.waste_type}\n` +
              `Battery: ${bin.battery_level?.toFixed(1) || 'N/A'}%\n` +
              `Status: ${bin.status}\n` +
              `Last Emptied: ${bin.last_emptied ? new Date(bin.last_emptied).toLocaleString() : 'Never'}\n` +
              `Temperature: ${bin.temperature?.toFixed(1) || 'N/A'}°C`);
    }

    exportData() {
        const data = {
            timestamp: new Date().toISOString(),
            smartBins: this.smartBins,
            operationalKPIs: this.operationalKPIs,
            predictiveAlerts: this.predictiveAlerts
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ssacity-report-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert('Data exported successfully!');
    }

    toggleTheme() {
        const body = document.body;
        const isDark = body.style.backgroundColor === 'white';
        
        if (isDark) {
            body.style.backgroundColor = '';
            body.style.color = '';
            alert('Switched to dark mode');
        } else {
            body.style.backgroundColor = 'white';
            body.style.color = '#333';
            alert('Switched to light mode');
        }
    }

    showError(message) {
        console.error(message);
        document.getElementById('statusText').textContent = 'Error';
        document.getElementById('systemStatus').style.background = '#d32f2f';
        
        const kpisGrid = document.getElementById('kpisGrid');
        if (kpisGrid) {
            kpisGrid.innerHTML = `
                <div class="stat-card" style="grid-column: 1 / -1; text-align: center;">
                    <h3>❌ Connection Error</h3>
                    <p>${message}</p>
                    <button class="btn btn-primary" onclick="dashboard.loadAllData()" style="margin-top: 1rem;">
                        Retry Connection
                    </button>
                </div>
            `;
        }
    }

    formatNumber(num) {
        if (num === undefined || num === null) return '0';
        return new Intl.NumberFormat().format(num);
    }

    updateCurrentTime() {
        const timeElement = document.getElementById('currentTime');
        if (timeElement) {
            timeElement.textContent = new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        }
    }

    startAutoRefresh() {
        // Refresh every 30 seconds
        setInterval(() => {
            console.log('Auto-refreshing data...');
            this.loadAllData();
        }, 30000);
    }
}

// Initialize dashboard when page loads
window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, creating dashboard v2...');
    window.dashboard = new SSAcityDashboardV2();
});