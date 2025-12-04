import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { SlideUp, FadeIn } from './AnimatedContainer';

export function Login({ onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
    } catch (err) {
      setError('Неверный email или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SlideUp className="w-full max-w-md">
      <Card className="border-border/50 bg-card/80 backdrop-blur-xl">
        <CardHeader className="space-y-1 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <CardTitle className="text-2xl font-bold">Добро пожаловать</CardTitle>
            <CardDescription>Войдите в свой аккаунт</CardDescription>
          </motion.div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <FadeIn delay={0.1}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </FadeIn>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <FadeIn delay={0.3} className="w-full">
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full"
              >
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full gap-2"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent"
                    />
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" />
                      Войти
                    </>
                  )}
                </Button>
              </motion.div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Нет аккаунта? <span className="text-primary">Зарегистрироваться</span>
              </button>
            </FadeIn>
          </CardFooter>
        </form>
      </Card>
    </SlideUp>
  );
}
