import type { Metadata } from 'next';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Sign in — ABC OS',
  description:
    'Sign in or create an account to access your cooperative dashboard on ABC OS.',
};

export default function LoginPage() {
  return (
    <main className="stage" style={{ minHeight: '100vh' }}>
      <div
        className="rise"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '0 16px',
        }}
      >
        <LoginForm />
      </div>
    </main>
  );
}
