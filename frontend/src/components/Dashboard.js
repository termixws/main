import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Briefcase, Calendar, LayoutDashboard } from 'lucide-react';
import { Navbar } from './Navbar';
import { Masters } from './Masters';
import { Services } from './Services';
import { Appointments } from './Appointments';
import { PageTransition, FadeIn } from './AnimatedContainer';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('masters');

  const tabs = [
    { id: 'masters', label: 'Мастера', icon: Users },
    { id: 'services', label: 'Услуги', icon: Briefcase },
    { id: 'appointments', label: 'Записи', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <PageTransition>
          {/* Header */}
          <FadeIn>
            <div className="mb-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <LayoutDashboard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Панель управления</h1>
                  <p className="text-sm text-muted-foreground">Управляйте салоном красоты</p>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Tab Navigation */}
          <FadeIn delay={0.1}>
            <div className="mb-6 flex gap-1 rounded-xl bg-muted/50 p-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-lg bg-background shadow-sm"
                        transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </FadeIn>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {activeTab === 'masters' && <Masters />}
              {activeTab === 'services' && <Services />}
              {activeTab === 'appointments' && <Appointments />}
            </motion.div>
          </AnimatePresence>
        </PageTransition>
      </main>
    </div>
  );
}
