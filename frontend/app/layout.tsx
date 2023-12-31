"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "./AppContext";
import { motion, AnimatePresence } from "framer-motion";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <AnimatePresence>{children}</AnimatePresence>
          </motion.div>
        </AppProvider>
      </body>
    </html>
  );
}
