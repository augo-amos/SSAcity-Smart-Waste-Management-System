"""
SSAcity Smart City Data Models
"""
from dataclasses import dataclass, asdict
from datetime import datetime
from typing import Optional
import json

@dataclass
class SmartBin:
    """SSA Smart Bin sensor data"""
    bin_id: str
    location: str
    gps_lat: float
    gps_lon: float
    fill_level: float  # 0-100%
    temperature: Optional[float] = None
    battery_level: Optional[float] = None
    last_emptied: Optional[datetime] = None
    status: str = "active"
    waste_type: str = "mixed"
    
    def to_dict(self):
        data = asdict(self)
        if self.last_emptied:
            data['last_emptied'] = self.last_emptied.isoformat()
        return data

@dataclass
class CityZone:
    """City operational zone"""
    zone_id: str
    name: str
    population: int
    smart_bin_count: int
    avg_waste_per_day: float
    collection_frequency: str
    priority_level: int
    
    def to_dict(self):
        return asdict(self)

@dataclass
class PredictiveAlert:
    """Predictive analytics alert"""
    alert_id: str
    type: str
    location: str
    severity: str
    predicted_time: datetime
    confidence: float
    recommended_action: str
    
    def to_dict(self):
        data = asdict(self)
        data['predicted_time'] = self.predicted_time.isoformat()
        return data