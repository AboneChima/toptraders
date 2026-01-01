import Image from 'next/image';

interface CoinAvatarProps {
  icon: string;
  name: string;
  size?: number;
}

export default function CoinAvatar({ icon, name, size = 40 }: CoinAvatarProps) {
  const firstLetter = name.charAt(0).toUpperCase();
  
  // Generate a color based on the first letter
  const getColorFromLetter = (letter: string) => {
    const colors = [
      'bg-blue-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-red-500',
      'bg-orange-500',
      'bg-yellow-500',
      'bg-green-500',
      'bg-teal-500',
      'bg-cyan-500',
      'bg-indigo-500',
    ];
    const index = letter.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const bgColor = getColorFromLetter(firstLetter);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <Image
        src={`/coins/${icon}.png`}
        alt={name}
        width={size}
        height={size}
        className="rounded-full"
        onError={(e) => {
          // Hide the image and show fallback
          e.currentTarget.style.display = 'none';
          const fallback = e.currentTarget.nextElementSibling as HTMLElement;
          if (fallback) fallback.style.display = 'flex';
        }}
      />
      {/* Fallback avatar with first letter */}
      <div
        className={`absolute inset-0 ${bgColor} rounded-full flex items-center justify-center text-white font-bold`}
        style={{ display: 'none', fontSize: size * 0.5 }}
      >
        {firstLetter}
      </div>
    </div>
  );
}
