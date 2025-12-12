"use client";

import { MotionDiv } from "@/components/motion";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8 relative bg-white dark:bg-neutral-950">
        {/* Logo */}
        <div className="absolute top-6 left-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xl font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            <span className="text-2xl">📚</span>
            StudySpace
          </Link>
        </div>

        {/* Form Container */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md">{children}</div>

        {/* Footer */}
        <div className="mt-10 text-center text-sm text-neutral-500 dark:text-neutral-400">
          © {new Date().getFullYear()} StudySpace. Tous droits réservés.
        </div>
      </div>

      {/* Right side - Visual (hidden on mobile) */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-linear-to-br from-primary-600 via-primary-500 to-primary-700">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0">
          <MotionDiv
            className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <MotionDiv
            className="absolute bottom-20 right-20 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl"
            animate={{
              x: [0, -30, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <MotionDiv
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Révisez ensemble,
              <br />
              <span className="text-primary-200">simplement.</span>
            </h2>
            <p className="text-lg text-primary-100 mb-8 max-w-md">
              Visio, tableau blanc, équations et fichiers dans une seule
              interface. Plus besoin de jongler entre 4 applications.
            </p>
          </MotionDiv>

          {/* Stats */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 flex gap-8"
          >
            <div>
              <div className="text-3xl font-bold">500</div>
              <div className="text-primary-200 text-sm">Places beta</div>
            </div>
            <div>
              <div className="text-3xl font-bold">100%</div>
              <div className="text-primary-200 text-sm">Gratuit</div>
            </div>
            <div>
              <div className="text-3xl font-bold">&lt;30s</div>
              <div className="text-primary-200 text-sm">Pour commencer</div>
            </div>
          </MotionDiv>
        </div>

        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>
    </div>
  );
}
