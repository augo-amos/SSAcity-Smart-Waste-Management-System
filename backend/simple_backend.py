# File: ~/ssacity-smart-city/backend/simple_backend.py
from flask import Flask, jsonify
from flask_cors import CORS
import random
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

print("=" * 60)
print("SSAcity Backend v2.1 - SIMPLIFIED RESPONSE")
print("=" * 60)

def generate_smart_bins():
    """Generate fresh smart bins data"""
    zones = ["Downtown", "Residential", "Commercial", "Industrial", "Park", "University"]
    waste_types = ["General", "Recyclable", "Organic", "Plastic", "Glass"]
    
    bins = []
    for i in range(1, 16):
        fill_level = random.randint(15, 95)
        battery_level = random.randint(40, 100)
        
        status = "active"
        if battery_level < 20:
            status = "maintenance"
        elif battery_level < 40:
            status = "low_battery"
        
        bin_data = {
            "bin_id": f"BIN-{i:03d}",
            "location": f"{random.choice(zones)} Zone, Location {i}",
            "zone": random.choice(zones),
            "fill_level": fill_level,
            "waste_type": random.choice(waste_types),
            "battery_level": battery_level,
            "status": status,
            "last_emptied": (datetime.now() - timedelta(hours=random.randint(1, 72))).isoformat(),
            "temperature": round(random.uniform(20, 35), 1)
        }
        bins.append(bin_data)
    
    return bins

def generate_dynamic_alerts():
    """Generate dynamic alerts"""
    alerts = []
    
    # Generate 2-5 random alerts
    alert_types = [
        ("overflow_prediction", "critical", "Schedule immediate collection"),
        ("battery_low", "medium", "Schedule battery replacement"),
        ("odor_detection", "high", "Check for organic waste build-up"),
        ("high_temperature", "high", "Check for potential fire hazard"),
        ("sensor_failure", "medium", "Diagnostic check required"),
        ("compaction_fault", "medium", "Inspect compaction mechanism")
    ]
    
    zones = ["Downtown", "Residential", "Commercial", "Industrial", "Park"]
    
    for i in range(random.randint(2, 5)):
        alert_type, severity, action = random.choice(alert_types)
        zone = random.choice(zones)
        
        alerts.append({
            "id": f"ALERT-{i+1:03d}",
            "type": alert_type,
            "location": f"{zone} Zone - BIN-{random.randint(1, 15):03d}",
            "predicted_time": (datetime.now() + timedelta(hours=random.randint(1, 8))).isoformat(),
            "severity": severity,
            "confidence": round(random.uniform(0.7, 0.95), 2),
            "recommended_action": action
        })
    
    return alerts

@app.route('/')
def home():
    return jsonify({
        "service": "SSAcity Smart City API",
        "version": "2.1",
        "status": "running",
        "timestamp": datetime.now().isoformat()
    })

@app.route('/health')
def health():
    return jsonify({
        "status": "healthy",
        "message": "Backend is running",
        "timestamp": datetime.now().isoformat()
    })

# IMPORTANT: Return array directly (not wrapped in object)
@app.route('/api/v2/smart-bins')
def get_smart_bins():
    bins = generate_smart_bins()
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Returning {len(bins)} smart bins")
    # Return array directly - frontend expects bins.filter() to work
    return jsonify(bins)

# IMPORTANT: Return array directly (not wrapped in object)
@app.route('/api/v2/predictive-alerts')
def get_predictive_alerts():
    alerts = generate_dynamic_alerts()
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Returning {len(alerts)} alerts")
    # Return array directly - frontend expects alerts to be array
    return jsonify(alerts)

@app.route('/api/v2/operational-kpis')
def get_operational_kpis():
    # Generate fresh bins for KPIs
    bins = generate_smart_bins()
    total_bins = len(bins)
    avg_fill = round(sum(b["fill_level"] for b in bins) / total_bins, 1) if total_bins > 0 else 0
    critical_bins = len([b for b in bins if b["fill_level"] > 80])
    
    kpis = {
        "total_waste_collected_kg": random.randint(8000, 12000),
        "total_collections_today": random.randint(80, 150),
        "avg_route_efficiency": random.randint(82, 94),
        "bins_above_80": critical_bins,
        "collection_coverage": random.randint(88, 96),
        "avg_fill_level": avg_fill,
        "total_bins": total_bins
    }
    
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Returning KPIs")
    return jsonify(kpis)

if __name__ == '__main__':
    print("✅ Backend initialized successfully!")
    print("📊 Simple array responses for frontend compatibility")
    print("")
    print("🌐 Endpoints:")
    print("   - Health:     http://localhost:5000/health")
    print("   - Smart bins: http://localhost:5000/api/v2/smart-bins")
    print("   - Alerts:     http://localhost:5000/api/v2/predictive-alerts")
    print("=" * 60)
    app.run(host='0.0.0.0', port=5000, debug=False, threaded=True)