type LoginPageProps = {
  searchParams: Promise<{ redirect_to?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect_to } = await searchParams
  return (
    <div>
      <h1>login</h1>
    </div>
  )
}
