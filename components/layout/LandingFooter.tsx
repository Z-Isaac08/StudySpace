"use client";

import { Badge } from "@/components/ui/badge";
import { Github, Mail, Twitter } from "lucide-react";
import Link from "next/link";

export function LandingFooter() {
  const linkFocusClasses =
    "rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 focus-visible:underline";

  return (
    <footer
      className="border-t border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900"
      role="contentinfo"
    >
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-xl font-bold bg-linear-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                StudySpace
              </h3>
              <Badge variant="outline" className="text-xs">
                Beta
              </Badge>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 max-w-md">
              La plateforme tout-en-un qui simplifie la collaboration étudiante.
              Réviser en groupe n&apos;a jamais été aussi simple.
            </p>
            <div className="flex gap-4">
              <Badge variant="outline">Made with ❤️ pour les étudiants</Badge>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <a
                href="https://twitter.com/studyspace"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/studyspace"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="mailto:contact@studyspace.app"
                className="text-neutral-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
              Produit
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/#features"
                  className={`text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors ${linkFocusClasses}`}
                >
                  Fonctionnalités
                </Link>
              </li>
              <li>
                <Link
                  href="/#demo"
                  className={`text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors ${linkFocusClasses}`}
                >
                  Comment ça marche
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className={`text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors ${linkFocusClasses}`}
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className={`text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors ${linkFocusClasses}`}
                >
                  Commencer gratuitement
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
              Légal
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className={`text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors ${linkFocusClasses}`}
                >
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className={`text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors ${linkFocusClasses}`}
                >
                  Conditions générales d&apos;utilisation
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className={`text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors ${linkFocusClasses}`}
                >
                  Contact
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@studyspace.app"
                  className={`text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors ${linkFocusClasses}`}
                >
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              © {new Date().getFullYear()} StudySpace. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6 text-sm text-neutral-600 dark:text-neutral-400">
              <Link
                href="/privacy"
                className={`hover:text-primary-600 dark:hover:text-primary-400 transition-colors ${linkFocusClasses}`}
              >
                Confidentialité
              </Link>
              <Link
                href="/terms"
                className={`hover:text-primary-600 dark:hover:text-primary-400 transition-colors ${linkFocusClasses}`}
              >
                CGU
              </Link>
              <span className="text-neutral-400 dark:text-neutral-600">·</span>
              <span>Made in France 🇫🇷</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
