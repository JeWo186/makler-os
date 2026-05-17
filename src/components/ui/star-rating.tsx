import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  max?: number
  size?: 'sm' | 'md'
  className?: string
}

export function StarRating({ rating, max = 5, size = 'sm', className }: StarRatingProps) {
  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5',
            i < Math.round(rating)
              ? 'fill-amber-400 text-amber-400'
              : 'fill-slate-200 text-slate-200'
          )}
        />
      ))}
    </div>
  )
}
