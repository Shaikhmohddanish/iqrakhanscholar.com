import { LoadingPage } from '@/components/ui/loading-page'

export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <LoadingPage variant="detail" />
    </div>
  )
}
