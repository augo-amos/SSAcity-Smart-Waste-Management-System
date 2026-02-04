"""
COMPLETE WORKING BACKEND - GUARANTEED TO WORK
"""
from flask import Flask, jsonify
from flask_cors import CORS
import random
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

print("=" * 60)
print("🚀 SSAcity WORKING BACKEND - PORT 5000")
print("✅ Arrays returned for bins and alerts")
print("=" * 60)

def generate_bins():
    """Generate smart bins data - returns ARRAY"""
    bins = []
    locations = ["Downtown Square", "Central Park", "Shopping Mall", 
                 "Train Station", "Hospital Area", "University Campus"]
    
    for i in range(1, 13):  # 12 bins
        fill_level = random.randint(20, 95)
        
        # Determine status based on fill level
        status = "Normal"
        overflow_risk = "low"
        if fill_level > 85:
            status = "Critical"
            overflow_risk = "critical"
        elif fill_level > 70:
            status = "Warning"
            overflow_risk = "high"
        elif fill_level > 50:
            overflow_risk = "medium"
        
        bin_data = {
            "bin_id": f"BIN-{i:03d}",
            "location": f"{locations[i % len(locations)]} - Area {i}",
            "fill_level": fill_level,
            "waste_type": random.choice(["General", "Recyclable", "Organic"]),
            "battery_level": random.randint(60, 100),
            "temperature": random.randint(20, 35),
            "status": status,
            "overflow_risk": overflow_risk,
            "last_updated": datetime.now().isoformat()
        }
        bins.append(bin_data)
    
    print(f"✅ Generated {len(bins)} bins")
    return bins

def generate_alerts():
    """Generate alerts data - returns ARRAY"""
    alerts = []
    alert_types = [
        ("overflow_prediction", "critical", "Schedule immediate collection"),
        ("battery_low", "high", "Replace battery within 24 hours"),
        ("temperature_high", "medium", "Check for organic waste buildup"),
        ("rapid_fill", "high", "Increase collection frequency")
    ]
    
    for i in range(1, 6):  # 5 alerts
        alert_type, severity, action = random.choice(alert_types)
        
        alert_data = {
            "id": f"ALERT-{i:03d}",
            "type": alert_type,
            "severity": severity,
            "location": f"Zone {i} - BIN-{i:03d}",
            "predicted_time": (datetime.now() + timedelta(hours=i)).isoformat(),
            "current_fill": random.randint(70, 95),
            "confidence": round(random.uniform(0.7, 0.95), 2),
            "recommended_action": action,
            "timestamp": datetime.now().isoformat()
        }
        alerts.append(alert_data)
    
    print(f"✅ Generated {len(alerts)} alerts")
    return alerts

@app.route('/')
def home():
    return jsonify({
        "service": "SSAcity Smart City API",
        "version": "3.0",
        "status": "running",
        "timestamp": datetime.now().isoformat(),
        "message": "Use /health, /api/v2/smart-bins, /api/v2/predictive-alerts"
    })

@app.route('/health')
def health():
    return jsonify({
        "status": "healthy",
        "message": "Backend is running perfectly",
        "timestamp": datetime.now().isoformat()
    })

# CRITICAL: These endpoints MUST return arrays, not objects
@app.route('/api/v2/smart-bins')
def get_smart_bins():
    """GET smart bins - returns ARRAY"""
    bins = generate_bins()
    return jsonify(bins)  # Direct array, no wrapper

@app.route('/api/v2/predictive-alerts')
def get_predictive_alerts():
    """GET alerts - returns ARRAY"""
    alerts = generate_alerts()
    return jsonify(alerts)  # Direct array, no wrapper

@app.route('/api/v2/operational-kpis')
def get_operational_kpis():
    """GET KPIs - returns OBJECT"""
    # Generate some bins for calculation
    bins = generate_bins()
    alerts = generate_alerts()
    
    kpis = {
        "total_bins": len(bins),
        "avg_fill": round(sum(b["fill_level"] for b in bins) / len(bins), 1),
        "critical_bins": len([b for b in bins if b["fill_level"] > 85]),
        "active_alerts": len(alerts),
        "total_waste_collected_kg": random.randint(8000, 12000),
        "total_collections_today": random.randint(80, 150),
        "avg_route_efficiency": random.randint(82, 94),
        "bins_above_80": len([b for b in bins if b["fill_level"] > 80]),
        "collection_coverage": random.randint(88, 96),
        "prediction_accuracy": 92,
        "route_optimization": 35,
        "cost_savings": random.randint(10000, 15000)
    }
    
    return jsonify(kpis)  # Object, not array

if __name__ == '__main__':
    print("\n✅ ENDPOINTS (TEST THESE FIRST):")
    print("   http://localhost:5000/health")
    print("   http://localhost:5000/api/v2/smart-bins")
    print("   http://localhost:5000/api/v2/predictive-alerts")
    print("   http://localhost:5000/api/v2/operational-kpis")
    print("\n📡 Server starting on http://localhost:5000")
    print("=" * 60)
    
    app.run(host='0.0.0.0', port=5000, debug=True, threaded=True)