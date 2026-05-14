import { LoginForm } from "./_components/login-form"

type LoginPageProps = {
  searchParams: Promise<{ redirect_to?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect_to } = await searchParams
  return <LoginForm redirectTo={redirect_to} />
}
