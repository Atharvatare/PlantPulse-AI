import os
import json
from openai import OpenAI


class OpenAIService:
    def __init__(self):
        self._api_key = os.getenv('OPENAI_API_KEY', '')
        self._client = None
        self.model = 'gpt-3.5-turbo'

    @property
    def client(self):
        if self._client is None and self._api_key:
            try:
                self._client = OpenAI(api_key=self._api_key)
            except Exception:
                self._client = None
        return self._client

    def is_available(self):
        return self.client is not None

    def analyze_asset(self, temperature, current_load, voltage, hours_operated, vibration):
        if not self.is_available():
            return self._local_analysis(temperature, current_load, voltage, hours_operated, vibration)

        prompt = (
            f"Analyze this industrial asset with sensor readings:\n"
            f"- Temperature: {temperature}°C\n"
            f"- Current Load: {current_load}A\n"
            f"- Voltage: {voltage}V\n"
            f"- Hours Operated: {hours_operated}h\n"
            f"- Vibration: {vibration}mm/s\n\n"
            f"Provide a JSON response with:\n"
            f"- health_score (0-100)\n"
            f"- failure_probability (0-1)\n"
            f"- risk_level (Low/Medium/High/Critical)\n"
            f"- recommendation (maintenance suggestion)"
        )

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {'role': 'system', 'content': 'You are an industrial AI maintenance expert.'},
                    {'role': 'user', 'content': prompt}
                ],
                temperature=0.3,
                max_tokens=300
            )
            content = response.choices[0].message.content
            return json.loads(content)
        except Exception:
            return self._local_analysis(temperature, current_load, voltage, hours_operated, vibration)

    def chat_with_ai(self, message):
        if not self.is_available():
            return 'AI service is not configured. Please set OPENAI_API_KEY in environment variables.'

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {'role': 'system', 'content': 'You are PlantPulse AI, an industrial maintenance assistant.'},
                    {'role': 'user', 'content': message}
                ],
                temperature=0.7,
                max_tokens=500
            )
            return response.choices[0].message.content
        except Exception as e:
            return f'AI service error: {str(e)}'

    def generate_report(self, asset_data):
        if not self.is_available():
            return f"Asset Health Report for {asset_data.get('assetName', asset_data.get('name', 'Unknown'))}:\nHealth Score: {asset_data.get('healthScore', asset_data.get('health_score', 'N/A'))}\nStatus: {asset_data.get('status', 'N/A')}"

        prompt = (
            f"Generate a detailed maintenance report for asset: {json.dumps(asset_data, indent=2)}"
        )

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {'role': 'system', 'content': 'You are an industrial maintenance report generator.'},
                    {'role': 'user', 'content': prompt}
                ],
                temperature=0.3,
                max_tokens=800
            )
            return response.choices[0].message.content
        except Exception as e:
            return f'Report generation error: {str(e)}'

    def analyze_fault(self, asset_data, symptoms):
        if not self.is_available():
            return f"Fault Analysis:\nAsset: {asset_data.get('assetName', asset_data.get('name', 'Unknown'))}\nSymptoms: {symptoms}\nRecommended Action: Schedule maintenance inspection."

        prompt = (
            f"Perform root cause analysis for asset: {json.dumps(asset_data, indent=2)}\n"
            f"Reported symptoms: {symptoms}\n\n"
            f"Provide: likely root causes, recommended actions, urgency level."
        )

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {'role': 'system', 'content': 'You are an industrial fault analysis expert.'},
                    {'role': 'user', 'content': prompt}
                ],
                temperature=0.3,
                max_tokens=500
            )
            return response.choices[0].message.content
        except Exception as e:
            return f'Fault analysis error: {str(e)}'

    def _local_analysis(self, temperature, current_load, voltage, hours_operated, vibration):
        health_score = 100
        health_score -= min(30, max(0, (temperature - 70) * 1.5))
        health_score -= min(20, max(0, (current_load - 90) * 1.0))
        health_score -= min(15, max(0, abs(voltage - 240) * 0.5))
        health_score -= min(25, max(0, (hours_operated / 1000) * 2))
        health_score -= min(20, max(0, vibration * 5))
        health_score = max(0, min(100, round(health_score, 1)))

        failure_probability = round((100 - health_score) / 100, 2)

        if failure_probability < 0.2:
            risk_level = 'Low'
        elif failure_probability < 0.4:
            risk_level = 'Medium'
        elif failure_probability < 0.7:
            risk_level = 'High'
        else:
            risk_level = 'Critical'

        if health_score >= 80:
            recommendation = 'Asset is in good condition. Continue regular monitoring.'
        elif health_score >= 60:
            recommendation = 'Schedule routine maintenance within next 2 weeks.'
        elif health_score >= 40:
            recommendation = 'Plan maintenance intervention within next 48 hours.'
        else:
            recommendation = 'URGENT: Immediate maintenance required. Asset at risk of failure.'

        return {
            'health_score': health_score,
            'failure_probability': failure_probability,
            'risk_level': risk_level,
            'recommendation': recommendation
        }
