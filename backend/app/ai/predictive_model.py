class PredictiveModel:
    @staticmethod
    def predict_health_score(params):
        temperature = params.get('temperature', 0)
        current_load = params.get('current_load', 0)
        voltage = params.get('voltage', 0)
        hours_operated = params.get('hours_operated', 0)
        vibration = params.get('vibration', 0)

        score = 100.0
        score -= max(0, (temperature - 70) * 1.5)
        score -= max(0, (current_load - 90) * 1.0)
        score -= max(0, abs(voltage - 240) * 0.3)
        score -= max(0, (hours_operated / 1000) * 2)
        score -= max(0, vibration * 5)
        return max(0, min(100, round(score, 1)))

    @staticmethod
    def predict_failure_probability(params):
        health_score = PredictiveModel.predict_health_score(params)
        return round((100 - health_score) / 100, 2)

    @staticmethod
    def get_risk_level(probability):
        if probability < 0.2:
            return 'Low'
        elif probability < 0.4:
            return 'Medium'
        elif probability < 0.7:
            return 'High'
        return 'Critical'

    @staticmethod
    def get_recommendation(health_score):
        if health_score >= 85:
            return 'Asset operating optimally. No action required.'
        elif health_score >= 70:
            return 'Minor degradation detected. Monitor closely.'
        elif health_score >= 50:
            return 'Schedule maintenance within 2 weeks.'
        elif health_score >= 30:
            return 'Plan intervention within 48 hours.'
        return 'CRITICAL: Immediate maintenance required.'
