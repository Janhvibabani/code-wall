'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/Input'
import { Pencil, Sparkles, Heart, Star, Cloud, Moon, Sun } from 'lucide-react'

interface WelcomeScreenProps {
  onStart: (username: string) => void
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [username, setUsername] = useState('')

  const floatingIcons = [
    { Icon: Star, delay: 0, x: 10, y: 20 },
    { Icon: Heart, delay: 1.5, x: 80, y: 15 },
    { Icon: Cloud, delay: 2.5, x: 15, y: 75 },
    { Icon: Moon, delay: 3.5, x: 75, y: 80 },
    { Icon: Sun, delay: 4.5, x: 85, y: 60 },
  ]

  return (
    <div className="h-screen relative overflow-hidden flex flex-col items-center justify-center bg-gradient-to-b from-pink-50 to-purple-50">
      {/* Floating Icons */}
      {floatingIcons.map(({ Icon, delay, x, y }, index) => (
        <motion.div
          key={index}
          className="absolute text-purple-300/40"
          initial={{ x: `${x}%`, y: `${y}%` }}
          animate={{
            y: [`${y - 5}%`, `${y + 5}%`],
            x: [`${x - 2}%`, `${x + 2}%`],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            y: {
              duration: 2.5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay
            },
            x: {
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay
            },
            opacity: {
              duration: 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }
          }}
        >
          <Icon size={24} />
        </motion.div>
      ))}

      {/* Main Content */}
      <motion.div 
        className="text-center space-y-8 max-w-md px-4 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="space-y-4">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Doodle Wall
            </h1>
          </motion.div>
          <p className="text-gray-500">Create and share your doodles with friends ✨</p>
        </div>

        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 bg-white/50 backdrop-blur-[10%] border border-purple-500 text-black"
            />
            <Pencil className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
          </div>

          <div className="space-y-2">
            <Button 
              onClick={() => username && onStart(username)} 
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
              disabled={!username}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mr-2"
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
              Start Drawing
            </Button>
          </div>

          <p className="text-xs text-gray-400 mt-8">
            All your doodles are saved locally in your browser 🎨
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

