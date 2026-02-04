import random
import time
from datetime import datetime, timedelta
import json

class SmartCitySimulator:
    def __init__(self):
        self.regions = ['Downtown', 'Uptown', 'Industrial', 'Residential', 'Commercial']
        self.alert_types = {
            'Traffic': ['Accident', 'Congestion', 'Road Closure'],
            'Environment': ['High Pollution', 'Extreme Temperature', 'High Noise'],
            'Energy': ['Grid Overload', 'Power Outage', 'Low Generation'],
            'Security': ['Camera Offline', 'Unusual Activity', 'Emergency Call']
        }
    
    def generate_region_data(self, region):
        """Generate data for a specific region"""
        base_time = datetime.now()
        return {
            'region': region,
            'timestamp': base_time.isoformat(),
            'traffic': {
                'level': random.randint(0, 100),
                'congestion': random.choice(['Low', 'Medium', 'High', 'Critical']),
                'vehicles_per_minute': random.randint(10, 200),
                'avg_speed': random.randint(20, 80)
            },
            'environment': {
                'air_quality_index': round(random.uniform(0, 300), 1),
                'temperature': round(random.uniform(10, 40), 1),
                'humidity': random.randint(30, 95),
                'noise_level': random.randint(40, 110)
            },
            'energy': {
                'usage_kwh': random.randint(500, 5000),
                'solar_production': random.randint(100, 1000),
                'grid_demand': random.randint(400, 4000),
                'renewable_percentage': round(random.uniform(20, 80), 1)
            },
            'infrastructure': {
                'public_transport_usage': random.randint(200, 2000),
                'parking_availability': random.randint(0, 100),
                'waste_level': random.randint(0, 100),
                'water_consumption': random.randint(1000, 10000)
            }
        }
    
    def generate_dashboard_data(self):
        """Generate data for all regions"""
        return {
            'timestamp': datetime.now().isoformat(),
            'overall_status': random.choice(['Normal', 'Attention Needed', 'Critical']),
            'regions': [self.generate_region_data(region) for region in self.regions],
            'city_summary': {
                'total_energy_usage': random.randint(10000, 50000),
                'avg_traffic_congestion': random.randint(20, 80),
                'air_quality_status': random.choice(['Good', 'Moderate', 'Poor', 'Hazardous']),
                'public_transport_riders': random.randint(5000, 50000)
            }
        }
    
    def generate_alerts(self):
        """Generate alerts for the dashboard"""
        alerts = []
        for i in range(random.randint(0, 5)):
            alert_type = random.choice(list(self.alert_types.keys()))
            sub_type = random.choice(self.alert_types[alert_type])
            alerts.append({
                'id': i + 1,
                'type': alert_type,
                'subtype': sub_type,
                'region': random.choice(self.regions),
                'level': random.choice(['Low', 'Medium', 'High', 'Critical']),
                'message': f'{sub_type} detected in {random.choice(self.regions)}',
                'timestamp': (datetime.now() - timedelta(minutes=random.randint(0, 60))).isoformat(),
                'status': random.choice(['New', 'Acknowledged', 'Resolved']),
                'priority': random.randint(1, 5)
            })
        return sorted(alerts, key=lambda x: x['priority'], reverse=True)
    
    def generate_predictions(self):
        """Generate predictive analytics"""
        base_time = datetime.now()
        hours = 24
        predictions = []
        
        for hour in range(hours):
            time_point = base_time + timedelta(hours=hour)
            predictions.append({
                'hour': time_point.hour,
                'traffic_prediction': random.randint(0, 100),
                'energy_demand_prediction': random.randint(10000, 60000),
                'air_quality_prediction': round(random.uniform(0, 300), 1),
                'probability_incident': round(random.uniform(0, 0.3), 2)
            })
        
        return predictions
    
    def generate_historical_data(self, hours=72):
        """Generate historical data for charts"""
        historical = []
        base_time = datetime.now() - timedelta(hours=hours)
        
        for i in range(hours):
            timestamp = base_time + timedelta(hours=i)
            historical.append({
                'timestamp': timestamp.isoformat(),
                'traffic': random.randint(0, 100),
                'energy_usage': random.randint(10000, 60000),
                'air_quality': round(random.uniform(0, 300), 1),
                'public_transport': random.randint(1000, 10000),
                'incidents': random.randint(0, 10)
            })
        
        return historical

# Create singleton instance
simulator = SmartCitySimulator()

# Export functions
def get_dashboard_data():
    return simulator.generate_dashboard_data()

def get_alerts():
    return simulator.generate_alerts()

def get_predictions():
    return simulator.generate_predictions()

def get_historical_data():
    return simulator.generate_historical_data()

def get_region_data(region):
    return simulator.generate_region_data(region)

if __name__ == '__main__':
    print("Smart City Simulator")
    print(json.dumps(get_dashboard_data(), indent=2))
