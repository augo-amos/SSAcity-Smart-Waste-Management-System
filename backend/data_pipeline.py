"""
SSAcity Smart City Data Pipeline
Simulates real smart bin data and predictive analytics
"""
import random
import time
from datetime import datetime, timedelta
from typing import List
from models import SmartBin, CityZone, PredictiveAlert

class SSAcityDataPipeline:
    def __init__(self):
        self.bins = self.initialize_smart_bins()
        self.zones = self.initialize_city_zones()
        
    def initialize_smart_bins(self) -> List[SmartBin]:
        """Initialize 10 SSA Smart Bins"""
        locations = [
            ("CBD_Moi_Avenue", -1.286389, 36.817223),
            ("CBD_Kimathi", -1.286944, 36.821111),
            ("Westlands_Sarit", -1.264167, 36.804722),
            ("Kilimani_Mpaka", -1.298611, 36.785833),
            ("Karen_Hardy", -1.319444, 36.709722),
            ("Eastleigh_1st", -1.276389, 36.855556),
            ("Embakasi_JKIA", -1.319167, 36.927500),
            ("Kibera_Lindi", -1.314722, 36.781111),
            ("Mathare_4A", -1.263889, 36.861111),
            ("Runda_Muthaiga", -1.233056, 36.820833),
        ]
        
        bins = []
        for i, (location, lat, lon) in enumerate(locations):
            bin_id = f"BIN_{i+1:03d}"
            waste_type = random.choice(["plastic", "organic", "mixed"])
            bins.append(SmartBin(
                bin_id=bin_id,
                location=location,
                gps_lat=lat,
                gps_lon=lon,
                fill_level=random.randint(0, 100),
                temperature=random.uniform(18, 32),
                battery_level=random.uniform(30, 100),
                last_emptied=datetime.now() - timedelta(hours=random.randint(1, 48)),
                waste_type=waste_type
            ))
        return bins
    
    def initialize_city_zones(self) -> List[CityZone]:
        """Initialize city zones"""
        return [
            CityZone("Z001", "Central Business District", 350000, 45, 8500.5, "daily", 5),
            CityZone("Z002", "Westlands & Parklands", 280000, 38, 7200.2, "daily", 4),
            CityZone("Z003", "Kilimani & Kileleshwa", 220000, 32, 5800.8, "daily", 4),
            CityZone("Z004", "Karen & Langata", 180000, 28, 4200.3, "bi-weekly", 3),
            CityZone("Z005", "Eastleigh & Pangani", 420000, 52, 10500.7, "daily", 5),
        ]
    
    def simulate_sensor_updates(self):
        """Update bin sensor data"""
        for bin in self.bins:
            # Increase fill level
            fill_increase = random.uniform(0.1, 2.0)
            bin.fill_level = min(100, bin.fill_level + fill_increase)
            
            # Update temperature
            bin.temperature = max(15, min(35, bin.temperature + random.uniform(-0.5, 0.5)))
            
            # Battery drain
            bin.battery_level = max(0, bin.battery_level - random.uniform(0.01, 0.05))
            
            # Random status changes
            if random.random() < 0.005:  # 0.5% chance
                bin.status = "maintenance" if random.random() < 0.5 else "offline"
            elif bin.status != "active" and random.random() < 0.1:
                bin.status = "active"
    
    def get_predictive_alerts(self) -> List[PredictiveAlert]:
        """Generate predictive alerts"""
        alerts = []
        
        for bin in self.bins:
            if bin.fill_level > 85:
                alerts.append(PredictiveAlert(
                    alert_id=f"ALERT_{bin.bin_id}_{int(time.time())}",
                    type="overflow_risk",
                    location=bin.location,
                    severity="critical" if bin.fill_level > 95 else "high",
                    predicted_time=datetime.now() + timedelta(hours=random.randint(1, 6)),
                    confidence=min(0.95, bin.fill_level / 100),
                    recommended_action=f"Schedule collection for {bin.location}"
                ))
            
            if bin.battery_level < 20:
                alerts.append(PredictiveAlert(
                    alert_id=f"BATT_{bin.bin_id}_{int(time.time())}",
                    type="maintenance_needed",
                    location=bin.location,
                    severity="medium",
                    predicted_time=datetime.now() + timedelta(days=7),
                    confidence=0.8,
                    recommended_action=f"Replace battery at {bin.location}"
                ))
        
        return alerts
    
    def get_zone_analytics(self):
        """Get analytics by zone"""
        analytics = []
        for zone in self.zones:
            zone_bins = [b for b in self.bins if zone.name.split()[0] in b.location]
            avg_fill = sum(b.fill_level for b in zone_bins) / len(zone_bins) if zone_bins else 0
            
            analytics.append({
                "zone_id": zone.zone_id,
                "name": zone.name,
                "smart_bin_count": zone.smart_bin_count,
                "active_bins": len([b for b in zone_bins if b.status == "active"]),
                "avg_fill_level": round(avg_fill, 1),
                "waste_per_day_kg": zone.avg_waste_per_day,
                "priority_level": zone.priority_level,
                "collection_efficiency": random.uniform(75, 98)
            })
        return analytics
    
    def get_platform_metrics(self):
        """Simulate iNairobi platform metrics"""
        return {
            "total_users": random.randint(1500, 2000),
            "active_users": random.randint(800, 1200),
            "avg_separation_rate": round(random.uniform(45, 85), 1),
            "total_rewards": random.uniform(50000, 150000),
            "user_growth": round(random.uniform(5, 15), 1),
            "top_location": random.choice(["CBD", "Westlands", "Kilimani", "Eastleigh"])
        }
    
    def get_operational_kpis(self):
        """Get operational KPIs"""
        return {
            "total_collections_today": random.randint(15, 25),
            "total_waste_collected_kg": round(random.uniform(5000, 15000), 1),
            "avg_route_efficiency": round(random.uniform(75, 95), 1),
            "bins_above_80": len([b for b in self.bins if b.fill_level > 80]),
            "bins_offline": len([b for b in self.bins if b.status != "active"]),
            "collection_coverage": round(random.uniform(85, 98), 1)
        }

# Global instance
pipeline = SSAcityDataPipeline()

# Background sensor updates
import threading
def update_sensors():
    while True:
        pipeline.simulate_sensor_updates()
        time.sleep(30)  # Update every 30 seconds

thread = threading.Thread(target=update_sensors, daemon=True)
thread.start()

# API functions
def get_smart_bins():
    return [bin.to_dict() for bin in pipeline.bins]

def get_city_zones():
    return [zone.to_dict() for zone in pipeline.zones]

def get_zone_analytics():
    return pipeline.get_zone_analytics()

def get_platform_metrics():
    return pipeline.get_platform_metrics()

def get_operational_kpis():
    return pipeline.get_operational_kpis()

def get_predictive_alerts():
    return [alert.to_dict() for alert in pipeline.get_predictive_alerts()]