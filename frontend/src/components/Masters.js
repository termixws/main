import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, User, Phone, Award, Sparkles, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { StaggerContainer, StaggerItem, HoverScale } from './AnimatedContainer';
import { apiClient } from '../services/api';

// Mock data for demo
const mockMasters = [
  { id: 1, name: 'Анна Иванова', sex: 'Женский', phone: '+7 999 123-45-67', experience: 5, specialty: 'Стилист-колорист' },
  { id: 2, name: 'Мария Петрова', sex: 'Женский', phone: '+7 999 234-56-78', experience: 8, specialty: 'Мастер маникюра' },
  { id: 3, name: 'Елена Сидорова', sex: 'Женский', phone: '+7 999 345-67-89', experience: 3, specialty: 'Визажист' },
];

export function Masters() {
  const [masters, setMasters] = useState(mockMasters);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sex: '',
    phone: '',
    experience: 0,
    specialty: '',
  });

  useEffect(() => {
    loadMasters();
  }, []);

  const loadMasters = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getMasters();
      if (data && data.length > 0) {
        setMasters(data);
      }
    } catch (error) {
      console.log('Using mock data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.createMaster(formData);
      setShowDialog(false);
      setFormData({ name: '', sex: '', phone: '', experience: 0, specialty: '' });
      loadMasters();
    } catch (error) {
      // Mock add
      const newMaster = { ...formData, id: Date.now() };
      setMasters([...masters, newMaster]);
      setShowDialog(false);
      setFormData({ name: '', sex: '', phone: '', experience: 0, specialty: '' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.deleteMaster(id);
      loadMasters();
    } catch (error) {
      setMasters(masters.filter((m) => m.id !== id));
    }
  };

  if (loading && masters.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent"
        />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Мастера</h2>
          <p className="text-sm text-muted-foreground">Управление командой специалистов</p>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button onClick={() => setShowDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Добавить
          </Button>
        </motion.div>
      </div>

      {/* Masters Grid */}
      <StaggerContainer staggerDelay={0.08} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {masters.map((master) => (
            <StaggerItem key={master.id}>
              <HoverScale>
                <Card className="group relative overflow-hidden border-border/50 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <CardContent className="p-5">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(master.id)}
                        className="rounded-lg p-2 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                    
                    <h3 className="mb-1 text-lg font-semibold text-foreground">{master.name}</h3>
                    <p className="mb-4 text-sm text-primary">{master.specialty}</p>
                    
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{master.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        <span>{master.experience} лет опыта</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        <span>{master.sex}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </HoverScale>
            </StaggerItem>
          ))}
        </AnimatePresence>
      </StaggerContainer>

      {masters.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <User className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-foreground">Нет мастеров</h3>
          <p className="text-sm text-muted-foreground">Добавьте первого мастера</p>
        </motion.div>
      )}

      {/* Add Master Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Добавить мастера</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="master-name">Имя</Label>
              <Input
                id="master-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Введите имя"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Пол</Label>
                <Select value={formData.sex} onValueChange={(v) => setFormData({ ...formData, sex: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Мужской">Мужской</SelectItem>
                    <SelectItem value="Женский">Женский</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="master-phone">Телефон</Label>
                <Input
                  id="master-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+7 999 000-00-00"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="master-exp">Опыт (лет)</Label>
                <Input
                  id="master-exp"
                  type="number"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: Number(e.target.value) })}
                  min={0}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="master-spec">Специализация</Label>
                <Input
                  id="master-spec"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  placeholder="Стилист"
                  required
                />
              </div>
            </div>

            <DialogFooter className="gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                Отмена
              </Button>
              <Button type="submit">Добавить</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
