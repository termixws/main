import { motion } from 'framer-motion';
import { Moon, Sun, LogOut, Scissors } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { logout, isAuthenticated } = useAuth();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.15 }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Scissors className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Salon Natasha
            </span>
          </motion.div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="relative overflow-hidden"
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: theme === 'dark' ? 0 : 180 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  {theme === 'dark' ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                </motion.div>
              </Button>
            </motion.div>

            {/* Logout Button */}
            {isAuthenticated && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="ghost"
                  onClick={logout}
                  className="gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Выйти</span>
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
