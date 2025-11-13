// src/components/SkillRadarChart.jsx
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'

const SkillRadarChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <Radar
          name="Skills"
          dataKey="value"
          stroke="#6366f1"
          fill="#6366f1"
          fillOpacity={0.4}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}

export default SkillRadarChart