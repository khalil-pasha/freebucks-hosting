"use client"
import { motion } from "framer-motion"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "Is it really free?",
    answer: "Yes! You can earn Bucks by daily spins, referrals, and participating in the community, which you can then use to buy a server completely free."
  },
  {
    question: "What is a Buck?",
    answer: "Bucks are our virtual currency. You earn them on our platform and spend them on Minecraft server hosting plans."
  },
  {
    question: "Where are your servers located?",
    answer: "We have multiple nodes across North America and Europe to ensure low latency for everyone."
  },
  {
    question: "Can I install mods or plugins?",
    answer: "Absolutely! Our custom control panel gives you full access to install any modpack or plugins you desire."
  }
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="flex flex-col items-center w-full py-20">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Frequently Asked Questions
          </motion.h1>
          <p className="text-foreground/70 text-lg">
            Got questions? We've got answers.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-border/50 rounded-lg bg-card overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none cursor-pointer hover:bg-card/80 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold text-lg">{faq.question}</span>
                <ChevronDown className={`h-5 w-5 text-foreground/50 transition-transform ${openIndex === index ? 'rotate-180' : ''}`} />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6 text-foreground/70">
                  {faq.answer}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
