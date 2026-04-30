import { DisposalRequestsPage } from '@/app/admin/dashboard/disposal-requests/_components/DisposalRequestsPage'

export default function Page() {
  return <DisposalRequestsPage canCreate={true} canUpdateStatus={false} filterByCurrentUser={true} />
}
