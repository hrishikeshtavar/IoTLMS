interface AvatarProps {
  name: string;
  src?: string;
  size?: 32 | 40 | 48 | 64;
}

export function Avatar({ name, src, size = 40 }: AvatarProps) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  const colors = [
    '#1A73E8', '#FF6F00', '#1DB954', '#9C27B0', '#E91E63', '#00BCD4'
  ];
  
  const bgColor = colors[name.charCodeAt(0) % colors.length];
  
  return (
    <div
      className="rounded-[var(--radius-full)] flex items-center justify-center text-white font-medium overflow-hidden"
      style={{ 
        width: size, 
        height: size, 
        backgroundColor: bgColor,
        fontSize: size < 48 ? '12px' : '16px'
      }}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
}
