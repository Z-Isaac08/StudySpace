'use client';

/**
 * PostSessionSummary Component
 * Displayed after a study session ends, showing session stats
 * and providing navigation to read-only review or workspace.
 */

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, FileText, PartyPopper, Type, Users } from 'lucide-react';

interface PostSessionSummaryProps {
  workspaceName: string;
  workspaceTag: string;
  duration: string;
  memberCount: number;
  wordCount: number;
  onViewReadOnly: () => void;
  onBackToWorkspace: () => void;
}

interface StatItem {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export function PostSessionSummary({
  workspaceName,
  duration,
  memberCount,
  wordCount,
  onViewReadOnly,
  onBackToWorkspace,
}: PostSessionSummaryProps) {
  const stats: StatItem[] = [
    {
      icon: <Clock className="h-5 w-5" />,
      label: "Temps d'étude",
      value: duration,
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: 'Participants',
      value: `${memberCount}`,
    },
    {
      icon: <Type className="h-5 w-5" />,
      label: 'Mots rédigés',
      value: wordCount > 0 ? `~${wordCount}` : '—',
    },
  ];

  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="w-full max-w-md rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-8 shadow-2xl"
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0, 0, 0.2, 1], delay: 0.1 }}
      >
        {/* Header with celebration icon */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 15,
              delay: 0.3,
            }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4"
          >
            <PartyPopper className="h-8 w-8 text-primary" />
          </motion.div>

          <h2 className="text-xl font-bold text-foreground">Session terminée !</h2>
          <p className="text-sm text-muted-foreground mt-1">{workspaceName} — Bonne révision</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="flex flex-col items-center gap-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 p-3 border border-neutral-100 dark:border-neutral-800"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
            >
              <div className="text-primary/70">{stat.icon}</div>
              <span className="text-lg font-bold text-foreground">{stat.value}</span>
              <span className="text-[10px] text-muted-foreground leading-tight text-center">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Action buttons */}
        <motion.div
          className="flex flex-col gap-2.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Button onClick={onViewReadOnly} variant="default" className="w-full gap-2">
            <FileText className="h-4 w-4" />
            Revoir les notes & le tableau
          </Button>
          <Button onClick={onBackToWorkspace} variant="outline" className="w-full gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour au workspace
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
