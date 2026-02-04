from flask import Flask, jsonify, request
from flask_cors import CORS
import data_simulator

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/')
def home():
    return jsonify({
        "message": "SSAcity Smart City Operations API",
        "version": "1.0.0",
        "endpoints": {
            "/dashboard": "Complete dashboard data",
            "/alerts": "Current alerts and incidents",
            "/predictions": "24-hour predictions",
            "/historical": "72-hour historical data",
            "/region/<name>": "Specific region data"
        }
    })

@app.route('/dashboard')
def dashboard():
    """Return complete dashboard data"""
    return jsonify(data_simulator.get_dashboard_data())

@app.route('/alerts')
def alerts():
    """Return current alerts"""
    return jsonify(data_simulator.get_alerts())

@app.route('/predictions')
def predictions():
    """Return predictive analytics"""
    return jsonify(data_simulator.get_predictions())

@app.route('/historical')
def historical():
    """Return historical data for charts"""
    return jsonify(data_simulator.get_historical_data())

@app.route('/region/<region_name>')
def region_data(region_name):
    """Return data for specific region"""
    return jsonify(data_simulator.get_region_data(region_name))

@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

if __name__ == '__main__':
    print("""
    🏙️ SSAcity Smart City Operations Center
    ======================================
    API Server Starting...
    
    Access endpoints:
    - Dashboard: http://localhost:5000/dashboard
    - Alerts:    http://localhost:5000/alerts
    - Predictions: http://localhost:5000/predictions
    - Historical: http://localhost:5000/historical
    
    Frontend should be accessible at: http://localhost:8000
    """)
    app.run(debug=True, host='0.0.0.0', port=5000)
