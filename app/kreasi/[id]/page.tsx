import { notFound } from 'next/navigation'
import { GAMES } from '@/components/games/list'
import GameHost from '@/components/games/GameHost'

export function generateStaticParams() { return GAMES.map((g) => ({ id: g.id })) }
export default function Page({ params }: { params: { id: string } }) {
  const g = GAMES.find((x) => x.id === params.id)
  if (!g) notFound()
  return <GameHost id={g.id} nama={g.nama} />
}
