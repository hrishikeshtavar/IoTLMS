export type TopicType = 'Arduino' | 'ARM' | 'RISC-V' | '8051' | 'Raspberry Pi' | 'IoT' | 'Edge AI';

const topicColors: Record<TopicType, string> = {
  'Arduino': '#4CAF50',
  'ARM': '#9C27B0',
  'RISC-V': '#E91E63',
  '8051': '#FF5722',
  'Raspberry Pi': '#C2185B',
  'IoT': '#1A73E8',
  'Edge AI': '#00BCD4',
};

interface TopicChipProps {
  topic: TopicType;
}

export function TopicChip({ topic }: TopicChipProps) {
  const bgColor = topicColors[topic];
  
  return (
    <span
      className="inline-flex items-center px-3 py-1 text-xs font-medium text-white"
      style={{ 
        backgroundColor: bgColor,
        borderRadius: '99px'
      }}
    >
      {topic}
    </span>
  );
}
