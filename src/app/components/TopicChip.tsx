interface TopicChipProps {
  topic: 'Arduino' | 'ARM' | 'RISC-V' | '8051' | 'Raspberry Pi' | 'IoT' | 'Edge AI';
  size?: 'small' | 'medium';
}

const topicColors: Record<string, string> = {
  'Arduino': 'var(--color-topic-arduino)',
  'ARM': 'var(--color-topic-arm)',
  'RISC-V': 'var(--color-topic-riscv)',
  '8051': 'var(--color-topic-8051)',
  'Raspberry Pi': 'var(--color-topic-rpi)',
  'IoT': 'var(--color-topic-iot)',
  'Edge AI': 'var(--color-topic-ai)',
};

export function TopicChip({ topic, size = 'medium' }: TopicChipProps) {
  const sizeClasses = size === 'small' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-caption';
  
  return (
    <span
      className={`inline-flex items-center rounded-[var(--radius-sm)] text-white font-medium ${sizeClasses}`}
      style={{ backgroundColor: topicColors[topic] }}
    >
      {topic}
    </span>
  );
}
