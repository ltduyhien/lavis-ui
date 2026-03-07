import { UtcTime } from '@/shared/ui/utc-time'

interface PlaceholderPageProps {
  title: string
  subtitle: string
}

export function PlaceholderPage({ title, subtitle }: PlaceholderPageProps) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4 pt-4">
      <div className="flex shrink-0 items-center justify-between pb-6">
        <h1 className="text-2xl">
          <span className="font-bold">{title}</span>
          <span className="font-normal text-lg"> | {subtitle}</span>
        </h1>
        <UtcTime />
      </div>
    </div>
  )
}
